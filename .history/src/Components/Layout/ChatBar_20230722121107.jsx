import React, { useContext, useEffect, useRef, useState } from "react";
import '../../Styles/chatbar.css'
import '../../Styles/App.css'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send'
import Skeleton from "@mui/material/Skeleton";
import MyMessages from '../MyMessages'
import OthersMessages from '../OthersMessages'
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { myContext } from "./MainContainer"
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client"
const ENDPOINT = "https://live-chat-server-side.vercel.app/";
let socket, chat;

const Chatbar = () => {

    const dyParams = useParams();
    const [chatId, chat_user] = dyParams._id.split("&");
    const [messages, setMessages] = useState([])
    const [messagesCopy, setMessagesCopy] = useState([])
    const [newMessage, setNewMessage] = useState('');
    const userData = JSON.parse(localStorage.getItem('user'))
    const { refresh, setRefresh } = useContext(myContext)
    const [socketConnectionStatus, setSocketConnectionStatus] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const navigate = useNavigate()

    const sendMessage = async () => {
        var data = null;
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        };
        axios.post('https://live-chat-server-side.vercel.app/api/v1/message/', {
            chatId: chatId,
            content: newMessage
        }, config)
            .then((response) => {
                console.log(response)
                data = response
                // setNewMessage('')
                // setRefresh(!refresh);
                setNewMessage("");
                console.log('message fired')
                socket.emit("new message", data)

            });
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage()
            setNewMessage("");
            setRefresh(!refresh)
        }
    }
    //connect to socket
    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", userData.user);
        socket.on("connection", () => {
            console.log('first socket!!')
            setSocketConnectionStatus(!socketConnectionStatus)
        });
    }, []);

    //new message recieved
    useEffect(() => {
        socket.on("message received", (newMessage) => {
            // if (!messagesCopy || messagesCopy._id !== newMessage._id) {

            // } else {
            setMessages([...messages], newMessage)
            //}
        })

    });

    //fetch chats
    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        };
        axios.get(`https://live-chat-server-side.vercel.app/api/v1/message/${chatId}`, config)
            .then(({ data }) => {
                setMessages(data)
                setLoaded(true)
                socket.emit("join chat", chatId)
            });
        setMessagesCopy(messages);

    }, [refresh, chatId, userData.token, messages])

    const leaveGroupOclearHistory = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        };
        axios.put('https://live-chat-server-side.vercel.app/api/v1/chat/leave-group/', {
            chatId: chatId,
            userId: userData.user._id
        }, config)
            .then((response) => {
                navigate('/inbox/welcome')
            });
    }

    const lightTheme = useSelector((state) => state.themeKey);
    //scroll to bottom
    useEffect(() => {
        if (loaded === true) {
            divRef.current.scrollHeight({
                top: document.body.scrollHeight,
                left: 0,
                behavior: 'smooth'
            });
        }
    }, [])
    const divRef = useRef()


    if (!loaded) {
        return (
            <div style={{
                border: "20px",
                padding: "10px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
            }}>
                <Skeleton
                    variant="rectangular"
                    sx={{ width: "100%", borderRadius: "10px" }}
                    height={60} />

                <Skeleton variant="rectangular"
                    sx={{ width: "100%", borderRadius: "10px", flexGrow: "1" }}
                    height={60} />

                <Skeleton
                    variant="rectangular"
                    sx={{ width: "100%", borderRadius: "10px" }}
                    height={60} />
            </div >
        );
    }
    else {
        return (
            <div className="chatbar-wrapper" >
                <div className={"chatarea-header" + (lightTheme ? "" : " dark")}>
                    <p className={"conv-icon" + (lightTheme ? "" : " dark")}>{chat_user[0]}</p>
                    <div className={"header-text" + (lightTheme ? "" : " dark")}>
                        <p className={" conv-title" + (lightTheme ? "" : " dark")}>{chat_user}</p>

                    </div>
                    <IconButton
                        onClick={() => { leaveGroupOclearHistory() }}>
                        <DeleteIcon className={(lightTheme ? "" : " dark")} />
                    </IconButton>
                </div>
                <div className={"messages-container" + (lightTheme ? "" : " dark")}
                    ref={divRef}>

                    {messages && (
                        messages.map((message, index) => {

                            if (message.sender._id === userData.user._id) return (
                                <MyMessages
                                    key={index}
                                    name={message.sender.name}
                                    message={message.content}
                                    timestamp={message.updatedAt.split('T').pop()}
                                />)
                            else return (
                                <OthersMessages key={index}
                                    name={message.sender.name}
                                    message={message.content}
                                    timestamp={message.updatedAt.split('T').pop()}
                                />
                            )

                        })
                    )}
                    {
                        messages.length === 0 && <div class='center-div'>
                            start chat with {chat_user}!
                        </div>
                    }


                </div>
                <div className={"text-input-area" + (lightTheme ? "" : " dark")}>
                    <input type="text" placeholder="Type a message"
                        className={"search-box" + (lightTheme ? "" : " dark")}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        value={newMessage}
                    />
                    <IconButton onClick={() => {
                        sendMessage()
                        setRefresh(!refresh)
                    }}>
                        <SendIcon className={(lightTheme ? "" : " dark")} />
                    </IconButton>
                </div>

            </div>)

    }

}

export default Chatbar;