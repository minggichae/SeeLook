import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { app } from "../../firebaseApp";
import { v4 as uuidv4 } from "uuid";
import "swiper/css";
import "swiper/css/pagination";
import "./Clothes.css";

const Clothes = () => {
  const storage = getStorage(); // Get firebase storage
  const auth = getAuth(app); // firebase 인증 객체 가져오기
  const user = auth.currentUser; // 현재 사용자의 정보 가져오기
  const navigate = useNavigate();

  const Mainbtn = () => {
    navigate("/Main");
  };

  const [category, setCategory] = useState("root/옷장"); // 기본 카테고리 root
  const [filesUrl, setFilesUrl] = useState([]); // File Url List
  const [filteredImages, setFilteredImages] = useState([]); // 필터링된 이미지 리스트

  // (스토리지) => (스토리지 Ref) => listALL -> (res.items) => getDownloadURL -> img src

  useEffect(() => {
    const fetchImageUrls = async (category) => {
      const filesRef = ref(storage, category); // File Ref info
      try {
        const imageFiles = await listAll(filesRef);
        const imageUrls = await Promise.all(
          imageFiles.items.map(async (item) => {
            const imageUrl = await getDownloadURL(item); // 이미지 다운로드 URL 가져오기
            const metadata = await getMetadata(item); // 이미지 메타데이터 가져오기
            const uploadDate = metadata.timeCreated; // 이미지 생성 날짜 가져오기
            return {
              imageUrl,
              metadata: {
                ...metadata,
                customMetadata: {
                  ...metadata.customMetadata,
                  uploadDate, // 생성 날짜를 업로드 날짜로 할당해주기
                },
              },
            };
          })
        );

        // 현재 로그인한 사용자의 이미지로 필터링을 한 후 userImages에 저장
        // image는 element를 뜻함. (요소)
        const userImages = imageUrls.filter(
          (image) => image.metadata.customMetadata.userID === user.uid
        );

        // 생성 날짜를 기준으로 이미지 내림차순 정렬
        userImages.sort(
          (a, b) =>
            new Date(b.metadata.customMetadata.uploadDate) -
            new Date(a.metadata.customMetadata.uploadDate)
        );

        setFilesUrl(userImages);
        console.log(userImages);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAllImageUrls = async () => {
      const rootRef = ref(storage, "root/옷장"); // root 폴더 참조 생성
      try {
        const allImageUrls = []; // 모든 이미지의 Url을 담을 배열
        const rootFolder = await listAll(rootRef); // root 폴더의 모든 항목 목록 가져오기

        // rootFolder.prefixes는 root 폴더 아래의 모든 하위 폴더를 나타내는 배열이다.
        for (const folder of rootFolder.prefixes) {
          // 모든 하위 폴더 순회하기
          const imageFiles = await listAll(folder);
          const imageUrls = await Promise.all(
            imageFiles.items.map(async (item) => {
              const imageUrl = await getDownloadURL(item); // 이미지 다운로드 URL 가져오기
              const metadata = await getMetadata(item); // 이미지 메타데이터 가져오기
              const uploadDate = metadata.timeCreated; // 이미지 생성 날짜 가져오기
              return {
                imageUrl,
                metadata: {
                  ...metadata,
                  customMetadata: {
                    ...metadata.customMetadata,
                    uploadDate, // 생성 날짜를 업로드 날짜로 할당해주기
                  },
                },
              };
            })
          );
          allImageUrls.push(...imageUrls); // imageUrls 배열의 모든 요소를 추가
          // ...을 사용하는 이유는 배열의 요소 하나하나를 저장하기 위함
        }

        // 현재 로그인한 사용자의 이미지로 필터링을 한 후 userImages에 저장
        // image는 element를 뜻함. (요소)
        const userImages = allImageUrls.filter(
          (image) => image.metadata.customMetadata.userID === user.uid
        );

        // 생성 날짜를 기준으로 이미지 내림차순 정렬
        userImages.sort(
          (a, b) =>
            new Date(b.metadata.customMetadata.uploadDate) -
            new Date(a.metadata.customMetadata.uploadDate)
        );

        setFilesUrl(userImages);
        console.log(userImages);
      } catch (error) {
        console.log(error);
      }
    };

    if (category === "root/옷장") {
      fetchAllImageUrls();
    } else {
      fetchImageUrls(category);
    }
  }, [category]);

  return (
    <>
      <div className="category-btn-bundle-clothes">
        <button
          className="category-btn-clothes"
          onClick={() => setCategory("root/옷장")}
        >
          전체
        </button>
        <button
          className="category-btn-clothes"
          onClick={() => setCategory("root/옷장/상의")}
        >
          상의
        </button>
        <button
          className="category-btn-clothes"
          onClick={() => setCategory("root/옷장/하의")}
        >
          하의
        </button>
        <button
          className="category-btn-clothes"
          onClick={() => setCategory("root/옷장/아우터")}
        >
          아우터
        </button>
        <button
          className="category-btn-clothes"
          onClick={() => setCategory("root/옷장/신발")}
        >
          신발
        </button>
      </div>
      <Swiper
        slidesPerView={"auto"}
        centeredSlides={true}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="clohtesswiper"
      >
        {filesUrl.length > 0 ? (
          filesUrl.map((url) => (
            <SwiperSlide key={uuidv4()}>
              <p>
                업로드 시간:{" "}
                {new Date(
                  url.metadata.customMetadata.uploadDate
                ).toLocaleString()}
              </p>
              <img src={url.imageUrl} alt="Uploaded" />
            </SwiperSlide>
          ))
        ) : (
          <></>
        )}
      </Swiper>
      <div className="category-btn-bundle-clothes">
        <button className="custom-btn btn-10" onClick={Mainbtn}>
          Main
        </button>
      </div>
    </>
  );
};

export default Clothes;
