import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom'


const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 10px
`;

const BlackBox = styled.div`
    background-color: rgba(0, 0, 0, 0.4);
    padding: 20px;
    border-radius: 30px;
    width: 40%;
    min-width: 300px;
    min-height: 300px;
    text-align: center;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border: 1px solid white;

    @media (max-width: 300px) {
        min-width: 200px; /* Cambia el min-width a 200px cuando la pantalla sea menor o igual a 300px de ancho */
    }
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

export default function Register({ user, setUser }) {

    const [tipo, setTipo] = useState(true);
    const [newUser, setNewUser] = useState({ 'user': '', 'name': '', 'email': '', 'dpi': '', 'password': '', 'confirm': '' });
    const push = useNavigate();

    const inputRef = useRef();
    const webcamRef = useRef(null);

    const inputChange = ({ target }) => {
        const { name, value } = target
        setNewUser({
            ...newUser,
            [name]: value
        })
    }

    const handleImagen = () => {
        inputRef.current.click();
    };

    const handleChangeMode = () => {
        setTipo(!tipo);
    };

    const handleRegister = () => {

    };

    const handleRegresar = () => {
        push('/');
    }

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const file = base64toFile(imageSrc, 'capturedImage.jpg', 'image/jpeg');
        setNewUser({
            ...newUser,
            imagen: imageSrc,
            imagenfile: file
        });
        setTipo(true);
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
            <BlackBox>
                <Title>Registro</Title>
                <ContentContainer>
                    <TextField type="text" name="user" placeholder="Usuario" onChange={inputChange} value={newUser.user} />
                    <TextField type="text" name="name" placeholder="Nombre" onChange={inputChange} value={newUser.name} />
                    <TextField type="email" name="email" placeholder="Correo Electronico" onChange={inputChange} value={newUser.email} />
                    <TextField type="number" name="dpi" placeholder="DPI" onChange={inputChange} value={newUser.dpi} min="1000000000000" max="9999999999999" />
                    <TextField type="password" name="password" placeholder="Contraseña" onChange={inputChange} value={newUser.password} />
                    <TextField type="password" name="confirm" placeholder="Confirmar Contraseña" onChange={inputChange} value={newUser.confirm} />
                    {
                        tipo ? (
                            newUser.imagen ? (
                                <img src={newUser.imagen} alt="Imagen seleccionada" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', marginBottom: '10px' }} />
                            ) : (
                                <></>
                            )
                        ) : (
                            <WebcamContainer>
                                <WebcamWrapper>
                                    <StyledWebcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} mirrored={true} />
                                </WebcamWrapper>
                            </WebcamContainer>
                        )
                    }
                    <ButtonsContainer>
                        {tipo ? (
                            <Button0 onClick={handleImagen}>
                                Subir imagen
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    ref={inputRef}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setNewUser({
                                            ...newUser,
                                            imagen: URL.createObjectURL(file),
                                            imagenfile: file
                                        });
                                    }}
                                />
                            </Button0>
                        ) : (
                            <Button0 onClick={capture}>
                                Tomar foto
                            </Button0>
                        )}
                        <Button onClick={handleChangeMode}>{tipo ? "Usar camara" : "Usar imagen del dispositivo"}</Button>
                    </ButtonsContainer>
                    <ButtonsContainer>
                        <Button0 onClick={handleRegresar}>Regresar</Button0>
                        <Button onClick={handleRegister}>Registrarse</Button>
                    </ButtonsContainer>
                </ContentContainer>
            </BlackBox>
        </Container>
    );
}


