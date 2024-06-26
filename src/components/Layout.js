import React from 'react';
import styled from 'styled-components';

const Layout = ({children}) => {
    return (
        <ImageContainer>
            <img src="assets/background/background_layout_type_a.jpg" alt="background" />
            <TitleContainer>SeeLook</TitleContainer>
            <ContentContainer>
                {children}
            </ContentContainer>
        </ImageContainer>
    );
}

export default Layout;

const ImageContainer = styled.div`
    position: relative;
    height: 100vh;
    width: 100vw;
    overflow: hidden; ////컨테이너 벗어나는 콘텐츠 숨기기

    img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover; ////이미지가 부모 요소 덮기
    }
    
    &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
        z-index: 1;
    }
`;

const TitleContainer = styled.div`
    position: absolute;
    display: inline;
    top: -100px;
    right: 200px;
    color: white;
    font-family: 'sans-serif';
    font-size: 220px; 
    font-weight: 700;
    letter-spacing: -20px;
    transform: rotate(-90deg);
    transform-origin: right center;
    z-index: 2;
`;

const ContentContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    width: 100%;
    max-width: 500px;
    padding: 20px;
    box-sizing: border-box;
`;
