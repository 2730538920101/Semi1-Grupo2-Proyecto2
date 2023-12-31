import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom'
import { LuLogIn } from "react-icons/lu";
import { AiOutlineCamera, AiOutlineUserAdd } from "react-icons/ai";
import { GoKey } from "react-icons/go";
import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_REQUEST_URL;

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
    const [loginImage, setLoginImage] = useState({
        imagen: null,
        imagenfile: null
    });
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
        if (user.EMAIL === '' || (tipo && user.APP_PASSWORD === '')) {
            alert('Por favor llene todos los campos');
        } else {
            const formData = new FormData();
            formData.append('EMAIL', user.EMAIL);
            formData.append('APP_PASSWORD', user.APP_PASSWORD);
            if (!tipo) {
                const imageSrc = webcamRef.current.getScreenshot();
                const file = base64toFile(imageSrc, 'capturedImage.jpg', 'image/jpeg');
                setLoginImage({
                    imagen: imageSrc,
                    imagenfile: file
                });
                formData.append('PICTURE', file);
            } else {
                formData.append('PICTURE', null);
            }
            axios.post('/user/login', formData)
                .then((response) => {
                    if (response.data.success) {
                        alert(response.data.result)
                        setUser({
                            'ID_USER':response.data.session[0].ID_USER,
                            'EMAIL':response.data.session[0].EMAIL,
                            'FULL_NAME':response.data.session[0].FULL_NAME,
                            'DPI':response.data.session[0].DPI,
                            'APP_PASSWORD':'', 
                            'PICTURE':response.data.session[0].PICTURE
                        })
                        localStorage.setItem('semisocial_session', JSON.stringify({
                            'ID_USER':response.data.session[0].ID_USER,
                            'EMAIL':response.data.session[0].EMAIL,
                            'FULL_NAME':response.data.session[0].FULL_NAME,
                            'DPI':response.data.session[0].DPI,
                            'APP_PASSWORD':'', 
                            'PICTURE':response.data.session[0].PICTURE
                        }));
                        push('/home');
                    } else {
                        alert(response.data.result);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleChangeMode = () => {
        setTipo(!tipo);
        setLoginImage({
            imagen: null,
            imagenfile: null
        });
    };

    const handleRegister = () => {
        push('/register');
    };

    const videoConstraints = {
        width: 720,
        height: 720,
        facingMode: "user"
    };

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

    useEffect(() => {
        if (user && user.ID_USER && user.ID_USER !== -1) {
            push("/home");
        } else {
            if (localStorage.getItem("semisocial_session")) {
                const TempUser = JSON.parse(localStorage.getItem("semisocial_session"));
                if (TempUser && TempUser.ID_USER && TempUser.ID_USER !== -1) {
                    setUser(TempUser);
                    push("/home");
                }
            }else{
                localStorage.setItem('semisocial_session', JSON.stringify({'ID_USER':'', 'FULL_NAME':'','EMAIL':'', 'DPI':'', 'APP_PASSWORD':'', 'PICTURE':''}));
            }
        }
    });

    return (
        <Container>
            {tipo ? (
                <BlackBox>
                    <Title>Login</Title>
                    <ContentContainer>
                        <TextField type="email" name="EMAIL" placeholder="Correo" onChange={inputChange} value={user.EMAIL} />
                        <TextField type="password" name="APP_PASSWORD" placeholder="Contraseña" onChange={inputChange} value={user.APP_PASSWORD} />
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
                        <TextField type="email" name="EMAIL" placeholder="Correo" onChange={inputChange} value={user.EMAIL} />
                        <WebcamContainer>
                            <WebcamWrapper>
                                <StyledWebcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} mirrored={true} />
                            </WebcamWrapper>
                        </WebcamContainer>
                        <ButtonsContainer>
                            <Button0 onClick={handleLogin}>Login <LuLogIn /></Button0>
                            <Button onClick={handleChangeMode}>Usar credenciales <GoKey /></Button>
                        </ButtonsContainer>
                    </ContentContainer>
                    <Button1 onClick={handleRegister}>Registrarse<AiOutlineUserAdd /></Button1>
                </BlackBox2>
            )}
        </Container>
    );
}


