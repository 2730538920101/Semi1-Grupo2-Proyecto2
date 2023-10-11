import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import { useHistory } from 'react-router'

export default function Login() {

    const [tipo, setTipo] = useState(true);

    const Container = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    `;

    const BlackBox = styled.div`
        background-color: rgba(0, 0, 0, 0.4);
        padding: 20px;
        border-radius: 30px;
        width: 25%;
        min-width: 300px;
        height: 30%;
        min-height: 300px;
        text-align: center;
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start; /* Centra verticalmente, pero coloca el título en la parte superior */
        align-items: center; /* Centra horizontalmente */
        border: 1px solid white;
    `;

    const BlackBox2 = styled(BlackBox)`
        height: 50%;
        min-height: 350px;
    `;

    const CommonStyles = `
        background-color: rgba(0, 0, 0, 0.3);
        border: 1px solid white;
        color: white;
        padding: 10px;
        border-radius: 10px; /* Agrega esquinas redondeadas */
    `;

    const TextField = styled.input`
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        box-sizing: border-box; /* Asegura que el padding se incluya en el ancho */
        ${CommonStyles}
        
        &:focus::placeholder {
            color: transparent;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        }
        
        &::placeholder {
            color: white;
            position: absolute;
            top: 10px;
            left: 10px;
            transition: all 0.3s ease;
        }
    `;

    const ButtonsContainer = styled.div`
        display: flex;
        width: 100%;
    `;

    const Button = styled.button`
        width: 50%;
        padding: 10px;
        margin-bottom: 5px;
        ${CommonStyles}
    `;

    const Button0 = styled(Button)`
        margin-right: 3px;
    `;

    const Button1 = styled(Button)`
        width: 100%;
    `;

    const Title = styled.h2`
        margin-bottom: 20px;
        color:white;
    `;

    const ContentContainer = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%; /* Ocupa todo el espacio vertical disponible */
    `;

    const WebcamContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

    const WebcamWrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 15px;
`;

    const StyledWebcam = styled(Webcam)`
    width: 100%;
    height: 100%;
`;


    const handleLogin = () => {
        // Lógica para el inicio de sesión
        // Aquí puedes añadir tu lógica de autenticación
    };

    const handleChangeMode = () => {
        setTipo(!tipo);
    };

    const handleRegister = () => {
        // Lógica para el registro
        // Aquí puedes añadir tu lógica para el registro
    };

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    return (
        <Container>
            {tipo ? (
                <BlackBox>
                    <Title>Login</Title>
                    <ContentContainer>
                        <TextField type="text" placeholder="Usuario" variant='outlined' />
                        <TextField type="password" placeholder="Contraseña" variant='outlined' />
                        <ButtonsContainer>
                            <Button0 onClick={handleLogin}>Login</Button0>
                            <Button onClick={handleChangeMode}>{tipo ? "Usar reconocimiento facial" : "Usar credenciales"}</Button>
                        </ButtonsContainer>
                        <Button1 onClick={handleRegister}>Registrarse</Button1>
                    </ContentContainer>
                </BlackBox>
            ) : (
                <BlackBox2>
                    <Title>Login</Title>
                    <ContentContainer>
                        <WebcamContainer>
                            <WebcamWrapper>
                                <StyledWebcam audio={false} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} />
                            </WebcamWrapper>
                        </WebcamContainer>
                        <ButtonsContainer>
                            <Button0 onClick={handleLogin}>Login</Button0>
                            <Button onClick={handleChangeMode}>{tipo ? "Usar reconocimiento facial" : "Usar credenciales"}</Button>
                        </ButtonsContainer>
                        <Button1 onClick={handleRegister}>Registrarse</Button1>
                    </ContentContainer>
                </BlackBox2>
            )}
        </Container>
    );
}


