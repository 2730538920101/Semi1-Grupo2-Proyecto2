import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useHistory } from 'react-router'

export default function Login() {

    const [tipo, setTipo] = useState(true);
    const [videoStream, setVideoStream] = useState(null);

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
        height: 45%;
        text-align: center;
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start; /* Centra verticalmente, pero coloca el título en la parte superior */
        align-items: center; /* Centra horizontalmente */
        border: 1px solid white;
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

    const RegisterButton = styled(Button)`
        width: 100%; /* Ancho del 100% para el botón "Register" */
        margin-top: auto; /* Coloca el botón en la parte inferior de la BlackBox */
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

    const VideoPreview = styled.video`
        width: 100%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 10px;
    `;

    const handleLogin = () => {
        // Lógica para el inicio de sesión
        // Aquí puedes añadir tu lógica de autenticación
    };

    const handleChangeMode = () => {
        setTipo(!tipo);
        if (tipo) {
            startCamera();
        } else {
            stopCamera();
        }
    };

    const handleRegister = () => {
        // Lógica para el registro
        // Aquí puedes añadir tu lógica para el registro
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoStream(stream);
            const videoElement = document.getElementById("videoPreview");
            if (videoElement) videoElement.srcObject = stream;
        } catch (error) {
            console.error("Error accessing the camera: ", error);
        }
    };

    const stopCamera = () => {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            setVideoStream(null);
        }
    };

    return (
        <Container>
            <BlackBox>
                <Title>Login</Title>
                <ContentContainer>
                    {tipo ? (
                        <>
                            <TextField type="text" placeholder="Usuario" variant='outlined' />
                            <TextField type="password" placeholder="Contraseña" variant='outlined' />
                        </>
                    ) : (
                        <>
                            <VideoPreview id="videoPreview" autoPlay playsInline />
                        </>
                    )}
                    <ButtonsContainer>
                        <Button0 onClick={handleLogin}>Login</Button0>
                        <Button onClick={handleChangeMode}>{tipo ? "Usar reconocimiento facial" : "Usar credenciales"}</Button>
                    </ButtonsContainer>
                </ContentContainer>
                <RegisterButton onClick={handleRegister}>Registrarse</RegisterButton>
            </BlackBox>
        </Container>
    );
}


