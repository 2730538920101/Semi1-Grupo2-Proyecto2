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
    const push = useNavigate();

    const inputChange = ({ target }) => {
        const { name, value } = target
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleLogin = () => {
        // Lógica para el inicio de sesión
        // Aquí puedes añadir tu lógica de autenticación
    };

    const handleChangeMode = () => {
        setTipo(!tipo);
    };

    const handleRegister = () => {
        push('/register');
    };

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    const LoginContent = ({ inputChange, handleLogin, handleChangeMode, user }) => (
        <ContentContainer>
            <TextField type="text" name="user" placeholder="Usuario" onChange={inputChange} value={user.user} />
            <TextField type="password" name="password" placeholder="Contraseña" onChange={inputChange} value={user.password} />
            <ButtonsContainer>
                <Button0 onClick={handleLogin}>Login <LuLogIn /></Button0>
                <Button onClick={handleChangeMode}>Usar reconocimiento facial <AiOutlineCamera /></Button>
            </ButtonsContainer>
        </ContentContainer>
    );
    
    const RegisterContent = ({ handleChangeMode }) => (
        <ContentContainer>
            <WebcamContainer>
                <WebcamWrapper>
                    <StyledWebcam audio={false} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} mirrored={true} />
                </WebcamWrapper>
            </WebcamContainer>
            <ButtonsContainer>
                <Button0 onClick={handleLogin}>Login <LuLogIn /></Button0>
                <Button onClick={handleChangeMode}>Usar credenciales <GoKey /></Button>
            </ButtonsContainer>
        </ContentContainer>
    );

    return (
        <Container>
            {tipo ? (
                <BlackBox>
                    <Title>Login</Title>
                    <LoginContent inputChange={inputChange} handleLogin={handleLogin} handleChangeMode={handleChangeMode} user={user} />
                    <Button1 onClick={handleRegister}>Registrarse<AiOutlineUserAdd /></Button1>
                </BlackBox>
            ) : (
                <BlackBox2>
                    <Title>Login</Title>
                    <RegisterContent handleChangeMode={handleChangeMode} />
                    <Button1 onClick={handleRegister}>Registrarse<AiOutlineUserAdd /></Button1>
                </BlackBox2>
            )}
        </Container>
    );
}


