import React, { useEffect, useState } from "react";
import '../../Styles/sidebar.css';
import '../../Styles/App.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import NightLightIcon from '@mui/icons-material/Nightlight'
import LightModeIcon from '@mui/icons-material/LightMode'
import LogoutIcon from '@mui/icons-material/LogoutOutlined'
import { IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search'
import ConversationItem from "../ConversationItems";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../Feature/themeSlice";
import { AnimatePresence, motion } from "framer-motion";
import axios from 'axios'

// type stateType = {
//     themeKey: boolean,
// }

const Sidebar = () => {


    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState('');
    const lightTheme = useSelector((state) => state.themeKey);
    const [conversations, setConversations] = useState([]);
    const [refresh, setRefresh] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'))
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        };
        axios.get('https://live-chat-server-side.vercel.app/api/v1/chat/', config).then((response) => {
            setConversations(response.data)
        })
    }, [refresh]);
    const userData = JSON.parse(localStorage.getItem('user'))

    const logoutHandler = () => {
        localStorage.removeItem('user')
        navigate("/")
    }

    return (

        <AnimatePresence>
            <motion.div className="sidebar-wrapper">
                <motion.div initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }} exit={{ scaleY: 1 }}
                    transition={{
                        ease: "anticipate",
                        duration: "0.4"
                    }} className={"sb-header" + (lightTheme ? "" : " dark")}>
                    <div>
                        <IconButton onClick={() => { navigate('/inbox/welcome') }}>
                            <AccountCircleIcon className={"icon" + (lightTheme ? "" : " dark")} />
                        </IconButton>
                    </div>
                    <div>
                        <IconButton onClick={() => { navigate('users') }} title={'see and add user'}>
                            <PersonAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
                        </IconButton>
                        <IconButton onClick={() => { navigate('groups') }} title={'see available groups'}>
                            <GroupAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
                        </IconButton>
                        <IconButton onClick={() => { navigate('create-group') }} title={'create groups'}>
                            <AddCircleIcon className={"icon" + (lightTheme ? "" : " dark")} />
                        </IconButton>

                        <IconButton title={'switch theme mode'} onClick={() => {
                            dispatch(toggleTheme())
                        }}>
                            {lightTheme && <NightLightIcon className={"icon" + (lightTheme ? "" : " dark")} />}
                            {!lightTheme && <LightModeIcon className={"icon" + (lightTheme ? "" : " dark")} />}
                        </IconButton>
                        {
                            userData &&
                            <IconButton onClick={logoutHandler}>
                                <LogoutIcon className={"icon" + (lightTheme ? "" : " dark")} />

                            </IconButton>
                        }
                    </div>
                </motion.div>

                <motion.div initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }} exit={{ scaleY: 1 }}
                    transition={{
                        ease: "anticipate",
                        duration: "0.4"
                    }} className={"sb-search" + (lightTheme ? "" : " dark")}>
                    <IconButton>
                        <SearchIcon className={"icon" + (lightTheme ? "" : " dark")} />
                    </IconButton>
                    <input placeholder="search" className={"search-box" + (lightTheme ? "" : " dark")}
                        onClick={() => {
                            setRefresh(true)
                        }}
                    />
                </motion.div>

                <motion.div initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }} exit={{ scaleX: 1 }}
                    transition={{
                        ease: "anticipate",
                        duration: "0.4"
                    }} className={"sb-conversations" + (lightTheme ? "" : " dark")}>
                    {
                        conversations &&
                        conversations.map((conv, index) => {

                            if (conv.isGroupChat) return (
                                <ConversationItem key={index} name={conv.name} lastMessage={conv?.lastMessage?.content}
                                    timestamp={conv.updatedAt.split('T').pop()}
                                    _id={conv._id} groupTypeFlag={true} />
                            )
                            else return (
                                <ConversationItem key={index} name={conv?.users[1]?._id === userData?.user?._id ? conv?.users[0]?.name : conv?.users[1]?.name}
                                    lastMessage={conv?.lastMessage?.content}
                                    timestamp={conv.updatedAt.split('T').pop()}
                                    _id={conv._id} groupTypeFlag={false} />
                            )

                        })
                    }


                </motion.div>
            </motion.div>
        </AnimatePresence>
    )

}

export default Sidebar;
