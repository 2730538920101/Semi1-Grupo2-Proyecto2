import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom'
import { LuLogIn } from "react-icons/lu";
import { AiOutlineCamera, AiOutlineUserAdd } from "react-icons/ai";
import { GoKey } from "react-icons/go";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 5px
`;

const BlackBox = styled.div`
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.4);
    padding: 20px;
    border-radius: 30px;
    width: 30%;
    min-width: 300px;
    min-height: 300px;
    text-align: center;
    margin: auto;
    justify-content: space-between; /* Alinea los elementos hacia arriba y abajo */
    border: 1px solid white;
    @media (max-width: 300px) {
        min-width: 200px; /* Cambia el min-width a 200px cuando la pantalla sea menor o igual a 300px de ancho */
    }
`;

const BlackBox2 = styled(BlackBox)`
    min-height: 350px;
`;

const CommonStyles = `
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid white;
    color: white;
    padding: 10px;
    border-radius: 10px;
`;

const TextField = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
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
    height: 100%;
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

export default function Login({ user, setUser }) {

    const [tipo, setTipo] = useState(true);
    const webcamRef = useRef(null);
    const push = useNavigate();

    const inputChange = ({ target }) => {
        const { name, value } = target
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleLogin = () => {
        push('/Home')
    };

    const handleChangeMode = () => {
        setTipo(!tipo);
    };

    const handleRegister = () => {
        push('/register');
    };

    const videoConstraints = {
        width: 720,
        height: 720,
        facingMode: "user"
    };

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const file = base64toFile(imageSrc, 'capturedImage.jpg', 'image/jpeg');
        setUser({
            ...user,
            imagen: imageSrc,
            imagenfile: file
        });
        handleLogin();
    }

    function base64toFile(base64String, filename, mimeType) {
        const base64Data = base64String.split(',')[1];
        const decodedData = atob(base64Data);
        const byteArray = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; i++) {
            byteArray[i] = decodedData.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: mimeType });
        const file = new File([blob], filename, { type: mimeType });
        return file;
    }

    return (
        <Container>
            {tipo ? (
                <BlackBox>
                    <Title>Login</Title>
                    <ContentContainer>
                        <TextField type="text" name="email" placeholder="Correo" onChange={inputChange} value={user.email} />
                        <TextField type="password" name="password" placeholder="Contraseña" onChange={inputChange} value={user.password} />
                        <ButtonsContainer>
                            <Button0 onClick={handleLogin}>Login <LuLogIn /></Button0>
                            <Button onClick={handleChangeMode}>Usar reconocimiento facial <AiOutlineCamera /></Button>
                        </ButtonsContainer>
                    </ContentContainer>
                    <Button1 onClick={handleRegister}>Registrarse<AiOutlineUserAdd /></Button1>
                </BlackBox>
            ) : (
                <BlackBox2>
                    <Title>Login</Title>
                    <ContentContainer>
                        <TextField type="text" name="email" placeholder="Correo" onChange={inputChange} value={user.email} />
                        <WebcamContainer>
                            <WebcamWrapper>
                                <StyledWebcam audio={false} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} mirrored={true} />
                            </WebcamWrapper>
                        </WebcamContainer>
                        <ButtonsContainer>
                            <Button0 onClick={capture}>Login <LuLogIn /></Button0>
                            <Button onClick={handleChangeMode}>Usar credenciales <GoKey /></Button>
                        </ButtonsContainer>
                    </ContentContainer>
                    <Button1 onClick={handleRegister}>Registrarse<AiOutlineUserAdd /></Button1>
                </BlackBox2>
            )}
        </Container>
    );
}


