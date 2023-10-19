import React from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh; /* Para que ocupe el 100% de la pantalla vertical */
    box-sizing: border-box; /* Esto hace que el padding esté dentro del tamaño total */
`;

const LeftContainer = styled.div`
    flex: 0 0 80%; /* 85% de ancho */
    height: 100%; /* 100% de alto */
    padding: 20px; /* Aplicamos el padding al contenedor de la izquierda */
    box-sizing: border-box; /* Esto hace que el padding esté dentro del tamaño total */
    background-color: rgba(0, 0, 0, 0.05); /* Color de fondo para la izquierda */
`;

const RightContainer = styled.div`
    flex: 0 0 20%; /* 15% de ancho */
    height: 100%; /* 100% de alto */
    background-color: rgba(0, 0, 0, 0.15); /* Color de fondo para la derecha */
`;

export default function Home({ user, setUser }) {

    return (
        <Container>
            <LeftContainer>
                {/* Contenido para el contenedor de la izquierda */}
            </LeftContainer>
            <RightContainer>
                {/* Contenido para el contenedor de la derecha */}
            </RightContainer>
        </Container>
    );
}

