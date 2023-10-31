import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Media from "react-media";
import Select from "react-select";
import Webcam from "react-webcam";
import { useNavigate } from 'react-router-dom'
import { IoMdContacts } from "react-icons/io";
import { BiMessageDetail, BiLogOut } from "react-icons/bi";
import { RiUserSearchFill } from "react-icons/ri";
import { BsTranslate, BsFillPersonPlusFill, BsSendCheckFill } from "react-icons/bs";
import { MdOutlineCheckCircle, MdOutlineCancel, MdCancelPresentation } from "react-icons/md"
import { AiFillEdit, AiOutlinePlus, AiOutlineSend } from "react-icons/ai";
import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_REQUEST_URL;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    box-sizing: border-box;
    /* ===== Scrollbar CSS ===== */
    /* Firefox */
    * {
        scrollbar-width: auto;
        scrollbar-color: #1f4169 #ffffff;
    }

    /* Chrome, Edge, and Safari */
    *::-webkit-scrollbar {
        width: 16px;
    }

    *::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.5);
    }

    *::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0);
        border-radius: 10px;
        border: 1px solid #ffffff;
    }
`;

const MenuContainer = styled.div`
    display: flex;
    flex: 0 0 10%;
    max-height: 10%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    position: relative;
`;

const MenuLeft = styled.div`
    flex: 0 0 77%;
    padding: 10px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.05);
    display: flex;
`;

const MenuRight = styled.div`
    flex: 0 0 23%;
    display: flex;
    max-height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.15);
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    position: relative;
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    background-color: rgba(0, 0, 0, 1);
    border: 1px solid white;
    border-radius: 4px;
    display: block;
    width: 23%;
    z-index: 2;
`;

const DropdownOption = styled.div`
    padding: 10px;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const Image = styled.img`
    max-height: 100%;
    object-fit: contain;
`;

const TextContainer = styled.div`
    display: flex;
    align-items: center;
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
    max-height: 90%;
    display: flex;
`;

const LeftContainer = styled.div`
    flex: 0 0 77%;
    width: 100%;
    padding: 60px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.05);
    overflow-y: auto;
`;

const RightContainer = styled.div`
    width: 100%;
    background-color: rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const CustomSelect = styled(Select)`
    margin-left: 15px;
    margin-right: 10px;
    width: 100%;
    align-self: center;
`;

const Tabs = styled.div`
    display: flex;
    justify-content: space-around;
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid white;
`;

const TabButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: white;
    width: 100%;
    height: 100%;
    padding: 5px;
`;

const TabButtonDisable = styled(TabButton)`
    color: gray;
`;

const Content = styled.div`
    flex: 1;
    overflow-y: auto;
    border: 1px solid white;
`;

const Content2 = styled.div`
    flex: 1;
    overflow-y: auto;
    border: 1px solid white;
    display: flex;
    flex-direction: column;
`;

const SearchContainer = styled.div`
    position: sticky;
    top: 0;
    z-index: 0;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.15);
    padding: 2px;
    border-bottom: 1px solid white;
`;

const SearchInput = styled.input`
    flex: 1;
    border: none;
    padding: 5px;
`;

const List = styled.div`
    flex: 1;
    overflow-y: auto;
`;

const ListItem = styled.div`
    height: 100%;
    max-height: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid white;
    border-left: 1px solid white;
    border-right: 1px solid white;
    padding: 5px;
    cursor: pointer;
    justify-content: space-between;
`;

const ItemImage = styled.img`
    height: 65px;
    object-fit: contain;
    margin-right: 10px;
    border-radius: 10px;
    border: 1px solid white;
`;

const ItemName = styled.p`
    margin: 0;
    white-space: pre-line;
    word-break: break-all;
    color: white;
    overflow: hidden;
    text-align: center;
    width: 100%;
`;

const ContactState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 65px;
    max-width: 50px;
    min-width: 50px;
    color: white;
    padding: 2px;
    border-left: 1px solid white;
`;

const Button = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    cursor: pointer;
    font-size: 1.5rem;
    color: white;
    text-align: center;
    width: 100%;
    height: 100%;
`;

const ButonText = styled(Button)`
    font-size: 0.6rem;
    text-align: center;
    cursor: default;
`;

const ChatContainer = styled.div`
    flex: 1;
    height: 100%;
    overflow-y: auto;
    padding: 10px;
`;

const MessageContainer = styled.div`
    display: flex;
    margin-bottom: 10px;
    word-break: break-all;
`;

const OtherMessage = styled.div`
    background-color: #e5e5ea;
    padding: 10px;
    border-radius: 8px;
    margin-right: 15px;
    flex: 1;
    word-break: break-all;
    white-space: pre-line; 
`;

const MyMessage = styled.div`
    background-color: #007bff;
    padding: 10px;
    border-radius: 8px;
    margin-left: 15px;
    color: white;
    flex: 1;
    word-break: break-all;
    white-space: pre-line; 
`;

const InputContainer = styled.div`
    position: sticky;
    bottom: 0; /* Agregado */
    z-index: 1;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0);
    padding: 10px;
    padding-top: 10px;
    border-top: 1px solid white;
`;

const InputField = styled.textarea`
    flex: 1;
    width: 100%;
    border: none;
    padding: 10px;
    resize: none;
`;

const SendButton = styled.button`
    background-color: #007bff;
    border: none;
    color: white;
    padding: 10px;
    border-radius: 8px;
    margin-left: 10px;
    cursor: pointer;
`;

const Post = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    padding: 10px;
    padding-top: 22px;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 2px solid white;
    position: relative;
`;

const LeftPost = styled.div`
    flex: 0 0 50%;
    width: 100%;
    margin-right: 10px
`;

const LeftImage = styled.img`
    width: 100%;
    height: auto;
    object-fit: contain;
    border: 1px solid white;
    border-radius: 10px;
`;

const RightPost = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const RightTop = styled.div`
    max-height: 25%;
    overflow-y: auto;
    border: 1px solid white;
    border-radius: 10px;
    margin-bottom: 10px;
    padding: 10px;
    color: white;
    white-space: pre-line;
    word-wrap: break-word;
    max-width: 100%;
`;

const RightBottom = styled.div`
    flex: 1;
    overflow-y: auto;
    border: 1px solid white;
    border-radius: 10px;
    padding: 10px;
    color: white;
    white-space: pre-line;
    word-wrap: break-word;
    max-width: 100%;
`;

const RightComplete = styled.div`
    flex: 1;
    overflow-y: none;
    border: 1px solid white;
    border-radius: 10px;
    padding: 10px;
    padding-right: 15px;
    padding-bottom: 15px;
    color: white;
    white-space: pre-line;
    word-wrap: break-word;
`;

const Username = styled.div`
    position: absolute;
    top: -15px;
    left: -15px;
    background-color: black;
    color: white;
    padding: 5px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border: 1px solid white;
`;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid white;
  padding: 5px 0;
`;

const CommentText = styled.div`
  flex: 1;
  align-self: flex-start;
  padding-right: 10px;
  white-space: pre-line;
  word-wrap: break-word;
`;

const CommentMeta = styled.div`
  display: flex;
  align-self: flex-end;
  align-items: center;
  white-space: pre-line;
`;

const PostDate = styled.div`
    margin-right: 10px;
`;

const PostData = styled.div`
    display: flex;
    flex-direction: row;
    border-top: 1px solid white;
    margin-top: 5px;
`;

const PostTags = styled.div`
    flex: 0 0 50%;
    width: 100%;
    white-space: pre-line;
    word-wrap: break-word;
`;

const PostMeta = styled.div`
    display: flex;
    flex: 1;
    align-self: flex-end;
    align-items: center;
    white-space: pre-line;
`;

const TranslateIcon = styled(BsTranslate)`
    cursor: pointer;
`;

const ModalContent = styled.div`
    display: flex;
    flex: 1;
    bottom: 0; /* Lo mantiene en la parte inferior */
    left: 0; /* Lo mantiene a la izquierda */
    transform: translate(0, 0); /* No se desplaza */
    background: black;
    width: 100%; /* Ocupa el 100% del ancho del modal */
    height: 100%; /* Ocupa el 100% del alto del modal */
    overflow-y: auto; /* Agregar barra de desplazamiento si es necesario */
`;

const ModalButton = styled.div`
    position: absolute;
    width: 45px;
    height: 45px;
    border-radius: 5px;
    color: white;
    font-size: 40px;
`;

const BlackBox = styled.div`
    background-color: rgba(0, 0, 0, 0.4);
    padding: 20px;
    border-radius: 30px;
    width: 60%;
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

const Button0 = styled.button`
    width: 50%;
    padding: 10px;
    margin-bottom: 5px;
    ${CommonStyles}
`;

const Button1 = styled(Button0)`
    margin-right: 3px;
`;

const Button2 = styled(Button0)`
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

const Publish = styled.div`
    position: absolute;
    bottom: 28px;
    right: 22px;
    background-color: black;
    color: white;
    padding: 5px;
    border-top-left-radius: 8px;
    border: 1px solid white;
    z-index: 10;
    color: white;
`;

const Publish2 = styled(Publish)`
    bottom: 28px;
    right: 110px;
    border-top-right-radius: 8px;
`;

export default function Home({ user, setUser }) {

    const push = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [activeTab, setActiveTab] = useState("Tab1");
    const [searchText, setSearchText] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [tipo, setTipo] = useState(true);
    const [chatID, setChatID] = useState(-1);
    const [chatMessages, setChatMessages] = useState([]);
    const [listAmigos, setListAmigos] = useState([]);
    const [listConectar, setListConectar] = useState([]);
    const [posts, setPost] = useState([
        { time: "10/10/25", user: "Usuario 1", description: "Contenido de la publicación 1.", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", image: "images/PlaceHolder.jpg", comments: [{ time: "10/10/25", user: "User1", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User3", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comment: "Este es un coment" }, { time: "10/10/25", user: "User4", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comment: "Este es un coment" }, { time: "10/10/25", user: "User5", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comment: "Este es un coment" }], tags: ["g", "h", "i"] },
        { time: "10/10/25", user: "Usuario 2", description: "", image: "images/SemiSocial.png", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comments: [{ time: "10/10/25", user: "User1", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User3", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comment: "Este es un coment" }, { time: "10/10/25", user: "User4", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comment: "Este es un coment" }, { time: "10/10/25", user: "User5", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comment: "Este es un coment" }, { time: "10/10/25", user: "User6", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comment: "Este es un coment" }, { time: "10/10/25", user: "User7", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comment: "Este es un coment" }], tags: ["f", "g", "h"] },
        { time: "10/10/25", user: "Usuario 3", description: "Contenido de la publicación 3...", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", image: "images/PlaceHolder.jpg", comments: [{ time: "10/10/25", user: "User1", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", selectedLanguage: "", isLanguageMenuOpen: false, traduccion: "", comment: "Este es un comentario de prueba" }], tags: ["e", "f", "g"] },
    ]);
    const [newPost, setNewPost] = useState({ 'DESCRIPTION': '', 'imagen': 'images/PlaceHolder.jpg' });
    const [filteredPosts, setFilteredPosts] = useState(posts);
    const [listEtiquetas, setListEtiquetas] = useState(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])
    const [editUser, setEditUser] = useState({ 'FULL_NAME': user.FULL_NAME, 'DPI': user.DPI, 'APP_PASSWORD': '', 'PICTURE': '' });
    const inputRef = useRef();
    const inputRef2 = useRef();
    const webcamRef = useRef(null);
    const messageContainerRef = useRef(null);

    const inputChange = ({ target }) => {
        const { name, value } = target
        setEditUser({
            ...editUser,
            [name]: value
        })
    }

    const handleImagen = () => {
        inputRef.current.click();
    };

    const handleImagen2 = () => {
        inputRef2.current.click();
    };

    const handleChangeMode = () => {
        setTipo(!tipo);
    };

    const handleEdit = () => {
        if (editUser.FULL_NAME !== '' || editUser.DPI !== '' || editUser.APP_PASSWORD !== '') {
            const formData = new FormData();
            formData.append('FULL_NAME', editUser.FULL_NAME);
            formData.append('DPI', editUser.DPI);
            formData.append('APP_PASSWORD', editUser.APP_PASSWORD);
            formData.append('PICTURE', editUser.imagenfile);
            axios.put("/user/" + user.ID_USER, formData)
                .then((res) => {
                    if (res.data.success === true) {
                        alert(res.data.result);
                        setUser({
                            ...user,
                            FULL_NAME: editUser.FULL_NAME,
                            DPI: editUser.DPI,
                            PICTURE: res.data.PICTURE
                        });
                        setEditUser({ 'FULL_NAME': user.FULL_NAME, 'DPI': user.DPI, 'APP_PASSWORD': '', 'PICTURE': '' })
                        localStorage.setItem('semisocial_session', JSON.stringify({ 'ID_USER': user.ID_USER, 'FULL_NAME': editUser.FULL_NAME, 'EMAIL': user.EMAIL, 'DPI': editUser.DPI, 'APP_PASSWORD': editUser.APP_PASSWORD, 'PICTURE': res.data.PICTURE }));
                        setShowEditModal(false);
                    }
                    else {
                        alert(res.data.result);
                    }
                })
                .catch((err) => {
                    alert(err);
                });
        } else {
            alert('Debe llenar todos los campos');
        }
    };

    const videoConstraints = {
        width: 720,
        height: 720,
        facingMode: "user"
    };

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const file = base64toFile(imageSrc, 'capturedImage.jpg', 'image/jpeg');
        setEditUser({
            ...editUser,
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

    const etiquetas = listEtiquetas.map((item, index) => ({
        label: item,
        value: index,
    }));

    const openEditModal = () => {
        setShowEditModal(true);
        setIsMenuOpen(false);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
    };


    const handleChange = (selected) => {
        setSelectedOptions(selected);
        const selectedTags = selected.map((option) => option.label);
        if (selectedTags.length === 0) {
            setFilteredPosts(posts)
        } else {
            const filtered = posts.filter((post) =>
                post.tags.some((tag) => selectedTags.includes(tag))
            );
            setFilteredPosts(filtered);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleSend = () => {
        if (newMessage) {
            axios.post("/user/mensajes", {
                ID_USER: user.ID_USER,
                ID_FRIEND: chatID,
                CONTENT: newMessage
            })
                .then((res) => {
                    if (res.data.success === true) {
                        setNewMessage("");
                    }
                    else {
                        alert(res.data.result);
                    }
                })
                .catch((err) => {
                    alert(err);
                });
        }
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        setIsMenuOpen(false);
        setUser({
            "ID_USER": -1,
            "FULL_NAME": "",
            "EMAIL": "",
            "DPI": "",
            "APP_PASSWORD": "",
            "PICTURE": ""
        })
        localStorage.setItem('semisocial_session', JSON.stringify({ 'ID_USER': '', 'FULL_NAME': '', 'EMAIL': '', 'DPI': '', 'APP_PASSWORD': '', 'PICTURE': '' }));
        push("/");
    };

    const handleImageLoad = (index) => {
        const leftImage = document.getElementById(`leftImage-${index}`);
        if (leftImage) {
            const leftImageHeight = leftImage.clientHeight;
            const rightPost = document.getElementById(`rightPost-${index}`);
            if (rightPost) {
                rightPost.style.maxHeight = `${leftImageHeight}px`;
            }
        }
    };

    const handleImageLoadNew = () => {
        const leftImage = document.getElementById(`leftImage-new`);
        if (leftImage) {
            const leftImageHeight = leftImage.clientHeight;
            const rightPost = document.getElementById(`rightPost-new`);
            if (rightPost) {
                rightPost.style.maxHeight = `${leftImageHeight}px`;
            }
        }
    };

    const fetchAndUpdateData = () => {
        if (user.ID_USER !== -1) {
            const formData = new FormData();
            formData.append("ID_USER", user.ID_USER);
            axios
                .get("/user/friends?ID_USER=" + user.ID_USER, formData)
                .then((res) => {
                    if (res.data.success === true) {
                        if (!arraysEqual(res.data.friends, listAmigos)) {
                            setListAmigos(res.data.friends);
                        }
                    } else {
                        alert(res.data.result);
                    }
                })
                .catch((err) => {
                    alert(err);
                });
            axios
                .get("/user/toconnect?ID_USER=" + user.ID_USER, formData)
                .then((res) => {
                    if (res.data.success === true) {
                        if (!arraysEqual(res.data.friends, listConectar)) {
                            setListConectar(res.data.friends);
                        }
                    } else {
                        alert(res.data.result);
                    }
                })
                .catch((err) => {
                    alert(err);
                });
            if (chatID !== -1) {
                axios
                    .get("/user/chat?ID_USER=" + user.ID_USER + "&ID_FRIEND=" + chatID)
                    .then((res) => {
                        if (res.data.success === true) {
                            if (!arraysEqual(res.data.messages, chatMessages)) {
                                setChatMessages(res.data.messages);
                            }
                        } else {
                            setChatID(-1);
                            alert(res.data.result);
                        }
                    })
                    .catch((err) => {
                        alert(err);
                    });
            }
        } else {
            push("/");
        }
    };

    const arraysEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (!areObjectsEqual(arr1[i], arr2[i])) {
                return false;
            }
        }
        return true;
    };

    const areObjectsEqual = (obj1, obj2) => {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) return false;

        for (const key of keys1) {
            if (obj1[key] !== obj2[key]) return false;
        }

        return true;
    };

    const sendFriendRequest = (ID_USER) => {
        axios.post("/user/friendrequest", {
            APPLICANT_USER_ID: user.ID_USER,
            REQUIRED_USER_ID: ID_USER
        })
            .then((res) => {
                alert(res.data.result);
            })
            .catch((err) => {
                alert(err);
            });
    }

    const setChat = (ID_USER) => {
        axios
            .get("/user/chat?ID_USER=" + user.ID_USER + "&ID_FRIEND=" + ID_USER)
            .then((res) => {
                if (res.data.success === true) {
                    setChatID(ID_USER);
                    setChatMessages(res.data.messages);
                    setActiveTab("Tab3")
                } else {
                    setChatID(-1);
                    alert(res.data.result);
                }
            })
            .catch((err) => {
                alert(err);
            });
    }

    useEffect(() => {
        fetchAndUpdateData();
        const intervalId = setInterval(fetchAndUpdateData, 1000);
        return () => clearInterval(intervalId);
    }, [user.ID_USER, listAmigos, listConectar]);

    const friendrequestaccept = (ID_USER) => {
        axios.put("/user/friendrequestaccept", {
            APPLICANT_USER_ID: ID_USER,
            REQUIRED_USER_ID: user.ID_USER
        })
            .then((res) => {
                alert(res.data.result);
            })
            .catch((err) => {
                alert(err);
            });
    }

    const friendrequestreject = (ID_USER) => {
        axios.put("/user/friendrequestreject", {
            APPLICANT_USER_ID: ID_USER,
            REQUIRED_USER_ID: user.ID_USER
        })
            .then((res) => {
                alert(res.data.result);
            })
            .catch((err) => {
                alert(err);
            });
    }

    useEffect(() => {
        if (user) {
            if (user.ID_USER !== -1) {
                const formData = new FormData();
                formData.append('ID_USER', user.ID_USER);
                axios.get('/user/friends?ID_USER=' + user.ID_USER, formData)
                    .then((res) => {
                        if (res.data.success === true) {
                            setListAmigos(res.data.friends)
                        } else {
                            alert(res.data.result);
                        }
                    })
                    .catch((err) => {
                        alert(err);
                    });
                axios.get('/user/toconnect?ID_USER=' + user.ID_USER, formData)
                    .then((res) => {
                        if (res.data.success === true) {
                            setListConectar(res.data.friends)
                        } else {
                            alert(res.data.result);
                        }
                    })
                    .catch((err) => {
                        alert(err);
                    });
            } else {
                push("/");
            }
        } else {
            if (localStorage.getItem("semisocial_session")) {
                const TempUser = JSON.parse(localStorage.getItem("semisocial_session"));
                if (TempUser && TempUser.ID_USER && TempUser.ID_USER !== -1) {
                    setUser(TempUser);
                } else {
                    push("/");
                }
            } else {
                push("/");
            }
        }
    }, []);

    useEffect(() => {
        if (activeTab === "Tab2") {
            if (messageContainerRef.current) {
                messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
            }
        }
    }, [activeTab, chatMessages]);

    useEffect(() => {
        const handleWindowResize = () => {
            posts.forEach((post, index) => {
                const leftImage = document.getElementById(`leftImage-${index}`);
                if (leftImage) {
                    const leftImageHeight = leftImage.clientHeight;
                    const rightPost = document.getElementById(`rightPost-${index}`);
                    if (rightPost) {
                        rightPost.style.maxHeight = `${leftImageHeight}px`;
                    }
                }
            });
            const leftImage = document.getElementById(`leftImage-new`);
            if (leftImage) {
                const leftImageHeight = leftImage.clientHeight;
                const rightPost = document.getElementById(`rightPost-new`);
                if (rightPost) {
                    rightPost.style.maxHeight = `${leftImageHeight}px`;
                }
            }
        };

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, [posts]);

    return (
        <Container>
            <Media queries={{ small: "(max-width: 0px)" }}>
                {(matches) =>
                    matches.small ? (
                        <>
                        </>
                    ) : (
                        <>
                            <MenuContainer>
                                <MenuLeft>
                                    <Image src="images/SemiSocial.png" alt="Imagen" id="image" />
                                    <CustomSelect
                                        isMulti
                                        options={etiquetas}
                                        value={selectedOptions}
                                        onChange={handleChange}
                                    />
                                </MenuLeft>
                                <MenuRight onClick={handleMenuToggle}>
                                    <Image src={process.env.REACT_APP_REQUEST_S3_URL + user.PICTURE} alt="Imagen" id="image" />
                                    <TextContainer>
                                        <Text>{user.FULL_NAME}</Text>
                                    </TextContainer>
                                </MenuRight>
                                {
                                    isMenuOpen && (
                                        <DropdownMenu>
                                            <DropdownOption onClick={openEditModal}><AiFillEdit />{"  Editar Perfil"}</DropdownOption>
                                            <DropdownOption onClick={handleLogout}><BiLogOut />{"  Cerrar Sesión"}</DropdownOption>
                                        </DropdownMenu>
                                    )
                                }
                            </MenuContainer>
                            <MainContainer>
                                <LeftContainer>
                                    {showEditModal ? (
                                        <ModalContent>
                                            <ModalButton onClick={closeEditModal} style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                                <MdCancelPresentation />
                                            </ModalButton>
                                            <BlackBox>
                                                <Title>Editar</Title>
                                                <ContentContainer>
                                                    <TextField type="text" name="FULL_NAME" placeholder="Nombre" onChange={inputChange} value={editUser.FULL_NAME} />
                                                    <TextField type="number" name="DPI" placeholder="DPI" onChange={inputChange} value={editUser.DPI} min="1000000000000" max="9999999999999" />
                                                    <TextField type="password" name="APP_PASSWORD" placeholder="Contraseña" onChange={inputChange} value={editUser.APP_PASSWORD} />
                                                    {
                                                        tipo ? (
                                                            editUser.imagen ? (
                                                                <img src={editUser.imagen} alt="Imagen seleccionada" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', marginBottom: '10px' }} />
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
                                                            <Button1 onClick={handleImagen}>
                                                                Subir imagen
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    style={{ display: 'none' }}
                                                                    ref={inputRef}
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        setEditUser({
                                                                            ...editUser,
                                                                            imagen: URL.createObjectURL(file),
                                                                            imagenfile: file
                                                                        });
                                                                    }}
                                                                />
                                                            </Button1>
                                                        ) : (
                                                            <Button1 onClick={capture}>
                                                                Tomar foto
                                                            </Button1>
                                                        )}
                                                        <Button0 onClick={handleChangeMode}>{tipo ? "Usar camara" : "Usar imagen del dispositivo"}</Button0>
                                                    </ButtonsContainer>
                                                    <ButtonsContainer>
                                                        <Button2 onClick={handleEdit}>Editar perfil</Button2>
                                                    </ButtonsContainer>
                                                </ContentContainer>
                                            </BlackBox>
                                        </ModalContent>
                                    ) : (
                                        <>
                                            <Post key={-1}>
                                                <LeftPost>
                                                    <LeftImage src={newPost.imagen} alt="Nuevo post" id='leftImage-new' onLoad={handleImageLoadNew} />
                                                </LeftPost>
                                                <RightPost id={`rightPost-new`}>
                                                    <RightComplete>
                                                        <textarea
                                                            value={newPost.DESCRIPTION}
                                                            onChange={(e) => setNewPost({ ...newPost, DESCRIPTION: e.target.value })}
                                                            placeholder="Escribe tu publicación aquí..."
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                fontSize: '14px',
                                                                border: 'none',
                                                                resize: 'none',
                                                                outline: 'none',
                                                            }}
                                                        />
                                                        <Publish style={{ cursor: 'pointer' }} ><AiOutlinePlus></AiOutlinePlus>{" Publicar"}</Publish>
                                                        <Publish2 style={{ cursor: 'pointer' }} onClick={handleImagen2}><AiOutlinePlus></AiOutlinePlus>{" Subir imagen"}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                                ref={inputRef2}
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    setNewPost({
                                                                        ...newPost,
                                                                        imagen: URL.createObjectURL(file),
                                                                        imagenfile: file
                                                                    });
                                                                }}
                                                            />
                                                        </Publish2>
                                                    </RightComplete>
                                                </RightPost>
                                            </Post>
                                            {filteredPosts.map((post, index) => (
                                                <Post key={index}>
                                                    <LeftPost>
                                                        <Username>{post.user}</Username>
                                                        <LeftImage src={post.image} alt="Imagen izquierda" id={`leftImage-${index}`} onLoad={() => handleImageLoad(index)} />
                                                    </LeftPost>
                                                    <RightPost id={`rightPost-${index}`}>
                                                        <RightTop>
                                                            {post.description !== "" ? post.description : "Sin descripción."}
                                                            <PostData>
                                                                <PostTags>
                                                                    {post.tags.map((tag, index) => (
                                                                        <span key={index}>{"#" + tag + "\n"}</span>
                                                                    ))}
                                                                </PostTags>
                                                                <PostMeta style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                    <PostDate>Fecha: {post.time}</PostDate>
                                                                    <TranslateIcon />
                                                                </PostMeta>
                                                            </PostData>
                                                        </RightTop>
                                                        <RightBottom>
                                                            {post.comments.map((comment, index) => (
                                                                <CommentContainer key={index}>
                                                                    <CommentText>
                                                                        {comment.user}: {comment.comment}
                                                                    </CommentText>
                                                                    <CommentMeta>
                                                                        <PostDate>Fecha: {comment.time}</PostDate>
                                                                        <TranslateIcon />
                                                                    </CommentMeta>
                                                                </CommentContainer>
                                                            ))}
                                                        </RightBottom>
                                                    </RightPost>
                                                </Post>
                                            ))}
                                        </>
                                    )}
                                </LeftContainer>
                                <RightContainer>
                                    <Tabs>
                                        <TabButton onClick={() => handleTabClick("Tab1")} style={{ border: activeTab === "Tab1" ? "2px solid white" : "none", }}>
                                            <IoMdContacts /> Amigos
                                        </TabButton>
                                        <TabButton onClick={() => handleTabClick("Tab2")} style={{ border: activeTab === "Tab2" ? "2px solid white" : "none", }}>
                                            <RiUserSearchFill /> Conectar
                                        </TabButton>
                                        {
                                            chatID !== -1 ? (
                                                <TabButton onClick={() => handleTabClick("Tab3")} style={{ border: activeTab === "Tab3" ? "2px solid white" : "none", }}>
                                                    <BiMessageDetail /> Chat
                                                </TabButton>
                                            ) : (
                                                <TabButtonDisable>
                                                    <BiMessageDetail /> Chat
                                                </TabButtonDisable>
                                            )
                                        }
                                    </Tabs>
                                    {activeTab === "Tab1" && (
                                        <Content>
                                            <SearchContainer>
                                                <SearchInput
                                                    type="text"
                                                    placeholder="Buscar..."
                                                    value={searchText}
                                                    onChange={(e) => setSearchText(e.target.value)}
                                                />
                                            </SearchContainer>
                                            <List>
                                                {listAmigos.map((item, index) => {
                                                    if (item.FULL_NAME.toLowerCase().includes(searchText.toLowerCase())) {
                                                        return (
                                                            <ListItem key={index} onClick={() => setChat(item.ID_FRIEND)}>
                                                                <ItemImage src={process.env.REACT_APP_REQUEST_S3_URL + item.PICTURE} alt={item.FULL_NAME} />
                                                                <ItemName>{item.FULL_NAME}</ItemName>
                                                            </ListItem>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </List>
                                        </Content>
                                    )}
                                    {activeTab === "Tab2" && (
                                        <Content>
                                            <SearchContainer>
                                                <SearchInput
                                                    type="text"
                                                    placeholder="Buscar..."
                                                    value={searchText}
                                                    onChange={(e) => setSearchText(e.target.value)}
                                                />
                                            </SearchContainer>
                                            <List>
                                                {listConectar.map((item, index) => {
                                                    if (item.FULL_NAME.toLowerCase().includes(searchText.toLowerCase())) {
                                                        return (
                                                            <>
                                                                <ListItem key={index}>
                                                                    <ItemImage src={process.env.REACT_APP_REQUEST_S3_URL + item.PICTURE} alt={item.FULL_NAME} />
                                                                    <ItemName>{item.FULL_NAME}</ItemName>
                                                                    {item.APP_FRIEND_STATUS === "Enviada" && (
                                                                        <ContactState>
                                                                            <ButonText>
                                                                                {"Esperando\nRespuesta"}
                                                                            </ButonText>
                                                                            <Button>
                                                                                <BsSendCheckFill />
                                                                            </Button>
                                                                        </ContactState>
                                                                    )}
                                                                    {item.APP_FRIEND_STATUS === "Esperando" && (
                                                                        <ContactState>
                                                                            <Button onClick={() => friendrequestaccept(item.OTHER_ID)}>
                                                                                <MdOutlineCheckCircle />
                                                                            </Button>
                                                                            <Button onClick={() => friendrequestreject(item.OTHER_ID)}>
                                                                                <MdOutlineCancel />
                                                                            </Button>
                                                                        </ContactState>
                                                                    )}
                                                                    {item.APP_FRIEND_STATUS === "Enviar" && (
                                                                        <ContactState onClick={() => sendFriendRequest(item.OTHER_ID)}>
                                                                            <Button>
                                                                                <BsFillPersonPlusFill />
                                                                            </Button>
                                                                        </ContactState>
                                                                    )}
                                                                </ListItem>
                                                            </>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </List>
                                        </Content>
                                    )}
                                    {activeTab === "Tab3" && (
                                        <Content2>
                                            <ChatContainer ref={messageContainerRef}>
                                                {chatMessages.map((message, index) => (
                                                    <MessageContainer key={index}>
                                                        {message.isMine ? (
                                                            <MyMessage>{message.CONTENT}</MyMessage>
                                                        ) : (
                                                            <OtherMessage>{message.CONTENT}</OtherMessage>
                                                        )}
                                                    </MessageContainer>
                                                ))}
                                            </ChatContainer>
                                            <InputContainer>
                                                <InputField
                                                    placeholder="Mensaje aquí..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                />
                                                <SendButton onClick={handleSend}>Enviar</SendButton>
                                            </InputContainer>
                                        </Content2>
                                    )}
                                </RightContainer>
                            </MainContainer>
                        </>
                    )
                }
            </Media>
        </Container>
    );
}