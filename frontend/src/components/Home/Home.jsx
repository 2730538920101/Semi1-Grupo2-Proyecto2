import React, { useState } from "react";
import styled from "styled-components";
import Media from "react-media";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
`;

const MenuContainer = styled.div`
    display: flex;
    flex: 0 0 12%;
    max-height: 12%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.2);
`;

const MenuLeft = styled.div`
    flex: 0 0 75%;
    padding: 10px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.05);
`;

const MenuRight = styled.div`
    display: flex;
    max-height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.15);
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
`;

const Image = styled.img`
    max-height: 100%;
    object-fit: contain;
`;

const TextContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    height: 100%;
    flex: 1;
    overflow: hidden;
`;

const Text = styled.p`
    margin: 0;
    white-space: nowrap;
    color: white;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
`;



const MainContainer = styled.div`
    display: flex;
    flex: 1;
`;

const LeftContainer = styled.div`
    flex: 0 0 75%;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.05);
`;

const RightContainer = styled.div`
    flex: 0 0 25%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.15);
`;

export default function Home({ user, setUser }) {

    return (
        <Container>
            <Media queries={{ small: "(max-width: 900px)" }}>
                {(matches) =>
                    matches.small ? (
                        <>
                        </>
                    ) : (
                        <>
                            <MenuContainer>
                                <MenuLeft>
                                    <Image src="images/SemiSocial.png" alt="Imagen" id="image" />
                                </MenuLeft>
                                <MenuRight>
                                    <Image src="images/Cuadrada.png" alt="Imagen" id="image" />
                                    <TextContainer>
                                        <Text>Daniel Barillas</Text>
                                    </TextContainer>
                                </MenuRight>
                            </MenuContainer>
                            <MainContainer>
                                <LeftContainer>
                                </LeftContainer>
                                <RightContainer>
                                </RightContainer>
                            </MainContainer>
                        </>
                    )
                }
            </Media>
        </Container>
    );
}