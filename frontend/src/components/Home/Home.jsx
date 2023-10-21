import React from "react";
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
    width: 100%;
    background-color: rgba(0, 0, 0, 0.2);
`;

const MenuLeft = styled.div`
    flex: 0 0 75%;
    padding: 20px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.05);
`;

const MenuRight = styled.div`
    flex: 0 0 25%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.15);
    overflow: hidden; /* Para asegurarte de que la imagen no se desborde */
`;

const ImageContainer = styled.div`
    flex: 1; /* La imagen ocupa todo el espacio disponible */
    display: flex;
    justify-content: center;
    align-items: center;
    max-height: 100%; /* Limita la altura máxima de la imagen al 100% de ImageContainer */
    width: auto; /* El ancho se ajusta automáticamente para mantener la proporción */

    img {
        max-height: 100%; /* La imagen ocupa todo el alto del contenedor */
        width: auto; /* El ancho se ajusta automáticamente para mantener la proporción */
        object-fit: contain; /* La imagen se ajusta manteniendo la relación de aspecto */
    }
`;



const TextContainer = styled.div`
    font-size: min(3vw, 24px); /* Tamaño de fuente adaptable al espacio disponible */
    text-align: center;
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
            <Media queries={{ small: "(max-width: 800px)" }}>
                {(matches) =>
                    matches.small ? (
                        // Versión para móviles
                        <>
                        </>
                    ) : (
                        // Versión para computadoras
                        <>
                            <MenuContainer>
                                <MenuLeft>
                                    {/* Contenido para la parte izquierda del menú en computadoras */}
                                </MenuLeft>
                                <MenuRight>
                                    <ImageContainer>
                                        <img
                                            src="./images/Cuadrada.png"
                                            alt="Imagen"
                                        />
                                    </ImageContainer>
                                    <TextContainer>
                                        {/* Texto para el espacio restante en MenuRight */}
                                        Tu texto aquí
                                    </TextContainer>
                                </MenuRight>
                            </MenuContainer>
                            <MainContainer>
                                <LeftContainer>
                                    {/* Contenido para el contenedor de la izquierda en computadoras */}
                                </LeftContainer>
                                <RightContainer>
                                    {/* Contenido para el contenedor de la derecha en computadoras */}
                                </RightContainer>
                            </MainContainer>
                        </>
                    )
                }
            </Media>
        </Container>
    );
}
