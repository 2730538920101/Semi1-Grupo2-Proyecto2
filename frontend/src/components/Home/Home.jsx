import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Media from "react-media";
import Select from "react-select";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    box-sizing: border-box;
`;

const MenuContainer = styled.div`
    display: flex;
    flex: 0 0 10%;
    max-height: 10%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.2);
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
    overflow: hidden;
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
    padding: 20px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.05);
`;

const RightContainer = styled.div`
    width: 100%;
    background-color: rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    flex: 1; /* Ocupa el espacio restante en MainContainer */
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
    flex-direction: column; /* Cambiado */
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
`;

const ItemImage = styled.img`
    height: 75px;
    object-fit: contain;
    margin-right: 10px;
`;

const ItemName = styled.p`
    margin: 0;
    white-space: pre-line; /* Muestra saltos de línea */
    word-break: break-all; /* Rompe palabras largas */
    color: white;
    overflow: hidden;
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
    margin-right: 10px;
    flex: 1;
    word-break: break-all;
    white-space: pre-line; 
`;

const MyMessage = styled.div`
    background-color: #007bff;
    padding: 10px;
    border-radius: 8px;
    margin-left: 10px;
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

export default function Home({ user, setUser }) {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [activeTab, setActiveTab] = useState("Tab1");
    const [searchText, setSearchText] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [listData] = useState([
        { name: "Item 1", image: "images/Cuadrada.png" },
        { name: "Item 2", image: "images/Cuadrada.png" },
        { name: "Item 3", image: "images/Cuadrada.png" },
        { name: "Item 4", image: "images/Cuadrada.png" },
        { name: "Item 5", image: "images/Cuadrada.png" },
        { name: "Item 6", image: "images/Cuadrada.png" },
        { name: "Item 7", image: "images/Cuadrada.png" },
        { name: "Item 8", image: "images/Cuadrada.png" },
        { name: "Item 9", image: "images/Cuadrada.png" },
        { name: "Item 10", image: "images/Cuadrada.png"},
        { name: "Item 11", image: "images/Cuadrada.png" },
        { name: "Item 12", image: "images/Cuadrada.png" },
    ]);

    const messageContainerRef = useRef(null);

    const options = listData.map((item, index) => ({
        label: item.name,
        value: index,
    }));

    const handleChange = (selected) => {
        setSelectedOptions(selected);
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

    useEffect(() => {
        if (activeTab === "Tab2") {
            // Desplazar hacia abajo en MessageContainer
            if (messageContainerRef.current) {
                messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
            }
        }
    }, [activeTab, chatMessages]);
    

    return (
        <Container>
            <Media queries={{ small: "(max-width: 900px)" }}>
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
                                        options={options}
                                        value={selectedOptions}
                                        onChange={handleChange}
                                    />
                                </MenuLeft>
                                <MenuRight>
                                    <Image src="images/Cuadrada.png" alt="Imagen" id="image" />
                                    <TextContainer>
                                        <Text>Daniel Barillas</Text>
                                    </TextContainer>
                                </MenuRight>
                            </MenuContainer>
                            <MainContainer>
                                <LeftContainer>
                                </LeftContainer>
                                <RightContainer>
                                    <Tabs>
                                        <TabButton onClick={() => handleTabClick("Tab1")} style={{ border: activeTab === "Tab1" ? "2px solid white" : "none", }}>
                                            Contactos
                                        </TabButton>
                                        <TabButton onClick={() => handleTabClick("Tab2")} style={{ border: activeTab === "Tab2" ? "2px solid white" : "none", }}>
                                            Chat
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
                                                {listData.map((item, index) => {
                                                    if (item.name.toLowerCase().includes(searchText.toLowerCase())) {
                                                        return (
                                                            <ListItem key={index}>
                                                                <ItemImage src={item.image} alt={item.name} />
                                                                <ItemName>{item.name}</ItemName>
                                                            </ListItem>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </List>
                                        </Content>
                                    )}
                                    {activeTab === "Tab2" && (
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
