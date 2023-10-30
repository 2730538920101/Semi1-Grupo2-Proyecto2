import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Media from "react-media";
import Select from "react-select";
import { useNavigate } from 'react-router-dom'
import { IoMdContacts } from "react-icons/io";
import { BiMessageDetail, BiLogOut } from "react-icons/bi";
import { RiUserSearchFill } from "react-icons/ri";
import { BsTranslate, BsFillPersonPlusFill, BsSendCheckFill } from "react-icons/bs";
import { MdOutlineCheckCircle, MdOutlineCancel } from "react-icons/md"
import { AiFillEdit } from "react-icons/ai";
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
    z-index: 1;
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

export default function Home({ user, setUser }) {

    const push = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [activeTab, setActiveTab] = useState("Tab1");
    const [searchText, setSearchText] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [listAmigos, setListAmigos] = useState([]);
    const [listConectar, setListConectar] = useState([]);
    const [posts, setPost] = useState([
        { time: "10/10/25", user: "Usuario 1", description: "Contenido de la publicación 1.", image: "images/Cuadrada.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User3", comment: "Este es un coment" }, { time: "10/10/25", user: "User4", comment: "Este es un coment" }, { time: "10/10/25", user: "User5", comment: "Este es un coment" }], tags: ["g", "h", "i"] },
        { time: "10/10/25", user: "Usuario 2", description: "", image: "images/SemiSocial.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User3", comment: "Este es un coment" }, { time: "10/10/25", user: "User4", comment: "Este es un coment" }, { time: "10/10/25", user: "User5", comment: "Este es un coment" }, { time: "10/10/25", user: "User6", comment: "Este es un coment" }, { time: "10/10/25", user: "User7", comment: "Este es un coment" }], tags: ["f", "g", "h"] },
        { time: "10/10/25", user: "Usuario 3", description: "Contenido de la publicación 3...", image: "images/Cuadrada.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }], tags: ["e", "f", "g"] },
        { time: "10/10/25", user: "Usuario 4", description: "", image: "images/Cuadrada.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }], tags: ["c", "e", "f"] },
        { time: "10/10/25", user: "Usuario 5", description: "Contenido de la publicación 5...", image: "images/Cuadrada.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }], tags: ["b", "c", "e"] },
        { time: "10/10/25", user: "Usuario 6", description: "", image: "images/Cuadrada.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }], tags: ["a", "b", "c"] },
        { time: "10/10/25", user: "Usuario 7", description: "Contenido de la publicación 7...", image: "images/Cuadrada.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }], tags: ["j", "a", "b"] },
        { time: "10/10/25", user: "Usuario 8", description: "", image: "images/Cuadrada.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }], tags: ["i", "j", "a"] },
        { time: "10/10/25", user: "Usuario 9", description: "Contenido de la publicación 9...", image: "images/Cuadrada.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }], tags: ["h", "i", "j"] },
        { time: "10/10/25", user: "Usuario 10", description: "Contenido de la publicación 10...", image: "images/Cuadrada.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }], tags: ["g", "h", "i"] },
        { time: "10/10/25", user: "Usuario 11", description: "", image: "images/Cuadrada.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }], tags: ["f", "g", "h"] },
        { time: "10/10/25", user: "Usuario 12", description: "Contenido de la publicación 12...", image: "images/Cuadrada.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }], tags: ["e", "f", "g"] },
        { time: "10/10/25", user: "Usuario 13", description: "", image: "images/Cuadrada.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }], tags: ["c", "e", "f"] },
        { time: "10/10/25", user: "Usuario 14", description: "Contenido de la publicación 14...", image: "images/Cuadrada.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }], tags: ["b", "c", "e"] },
        { time: "10/10/25", user: "Usuario 15", description: "", image: "images/Cuadrada.png", comments: [{ time: "10/10/25", user: "User1", comment: "Este es un comentario de prueba" }, { time: "10/10/25", user: "User2", comment: "Este es un comentario de prueba" }], tags: ["a", "b", "c"] },
    ]);
    const [filteredPosts, setFilteredPosts] = useState(posts);
    const [listEtiquetas, setListEtiquetas] = useState(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const messageContainerRef = useRef(null);

    const etiquetas = listEtiquetas.map((item, index) => ({
        label: item,
        value: index,
    }));

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
            setChatMessages([...chatMessages, { text: newMessage, isMine: true }]);
            setNewMessage("");
        }
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen); // Alternar el estado del menú
    };

    const handleLogout = () => {
        setIsMenuOpen(false);
        setUser({
            "ID_USER": -1,
            "FULL_NAME": "",
            "EMAIL": "",
            "DPI": "",
            "APP_PASSWORD": "",
            "PICTURE":""
        })
        localStorage.setItem('semisocial_session', JSON.stringify({'ID_USER':'', 'FULL_NAME':'','EMAIL':'', 'DPI':'', 'APP_PASSWORD':'', 'PICTURE':''}));
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

    useEffect(() => {
        console.log(process.env.REACT_APP_REQUEST_S3_URL + user.PICTURE)
        if (user) {
            if (user.ID_USER !== -1) {
                const formData = new FormData();
                formData.append('ID_USER', user.ID_USER);
                axios.get('/user/friends?ID_USER='+user.ID_USER, formData)
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
                axios.get('/user/toconnect?ID_USER='+user.ID_USER, formData)
                    .then((res) => {
                        if (res.data.success === true) {
                            console.log(res.data)
                            setListConectar(res.data.friends)
                        } else {
                            alert(res.data.result);
                        }
                    })
                    .catch((err) => {
                        alert(err);
                    });
            }else{
                push("/");
            }
        } else {
            if (localStorage.getItem("semisocial_session")) {
                const TempUser = JSON.parse(localStorage.getItem("semisocial_session"));
                if (TempUser && TempUser.ID_USER && TempUser.ID_USER !== -1) {
                    setUser(TempUser);
                }else{
                    push("/");
                }
            } else {
                push("/");
            }
        }
    }, []);

    useEffect(() => {
        if (activeTab === "Tab2") {
            // Desplazar hacia abajo en MessageContainer
            if (messageContainerRef.current) {
                messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
            }
        }
    }, [activeTab, chatMessages]);

    useEffect(() => {
        const handleWindowResize = () => {
            // Vuelve a calcular la altura de los elementos RightPost
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
        };

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, [posts]);

    return (
        <Container>
            <Media queries={{ small: "(max-width: 10px)" }}>
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
                                        <Text>Daniel Barillas</Text>
                                    </TextContainer>
                                </MenuRight>
                                {
                                    isMenuOpen && (
                                        <DropdownMenu>
                                            <DropdownOption><AiFillEdit />{"  Editar Perfil"}</DropdownOption>
                                            <DropdownOption onClick={handleLogout}><BiLogOut />{"  Cerrar Sesión"}</DropdownOption>
                                        </DropdownMenu>
                                    )
                                }
                            </MenuContainer>
                            <MainContainer>
                                <LeftContainer>
                                    {/* Renderiza la lista de publicaciones */}
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
                                </LeftContainer>
                                <RightContainer>
                                    <Tabs>
                                        <TabButton onClick={() => handleTabClick("Tab1")} style={{ border: activeTab === "Tab1" ? "2px solid white" : "none", }}>
                                            <IoMdContacts /> Amigos
                                        </TabButton>
                                        <TabButton onClick={() => handleTabClick("Tab2")} style={{ border: activeTab === "Tab2" ? "2px solid white" : "none", }}>
                                            <RiUserSearchFill /> Conectar
                                        </TabButton>
                                        <TabButton onClick={() => handleTabClick("Tab3")} style={{ border: activeTab === "Tab3" ? "2px solid white" : "none", }}>
                                            <BiMessageDetail /> Chat
                                        </TabButton>
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
                                                            <ListItem key={index}>
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
                                                                    <ContactState>
                                                                        {item.APP_FRIEND_STATUS === "Enviada" && (
                                                                            <>
                                                                                <ButonText>
                                                                                    {"Esperando\nRespuesta"}
                                                                                </ButonText>
                                                                                <Button>
                                                                                    <BsSendCheckFill />
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                        {item.APP_FRIEND_STATUS === "Esperando" && (
                                                                            <>
                                                                                <Button>
                                                                                    <MdOutlineCheckCircle />
                                                                                </Button>
                                                                                <Button>
                                                                                    <MdOutlineCancel />
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                        {item.APP_FRIEND_STATUS === "Enviar" && (
                                                                            <Button>
                                                                                <BsFillPersonPlusFill />
                                                                            </Button>
                                                                        )}
                                                                    </ContactState>
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
                                                            <MyMessage>{message.text}</MyMessage>
                                                        ) : (
                                                            <OtherMessage>{message.text}</OtherMessage>
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