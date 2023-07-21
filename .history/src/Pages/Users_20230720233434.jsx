import React, { useEffect, useState } from "react";
import '../Styles/users-groups.css'
import '../Styles/App.css'
import '../Styles/sidebar.css'
import { IconButton } from "@mui/material";
import SerachIcon from '@mui/icons-material/Search'
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logo = require('../Images/live-chat.png');


const Users = () => {
    const lightTheme = useSelector((state) => state.themeKey);
    const [refresh, setRefresh] = useState(true);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem('user'))
    if (!userData) {
        navigate(-1);
    }

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        };
        axios.get('http://localhost:5000/api/v1/user/', config).then((response) => {
            setUsers(response.data.users)
        })
    }, [refresh])

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 1, scale: 1 }}
                transition={{
                    ease: "anticipate",
                    duration: "0.5"
                }} className="list-container">

                <div className={"user-groups-header" + (lightTheme ? "" : " dark")}>
                    <img src={Logo} alt="logo" style={{ height: "2rem", width: "2rem" }} />
                    <p className={"user-groups-title" + (lightTheme ? "" : " dark")}>Online Users</p>
                </div>

                <div className={"sb-search" + (lightTheme ? "" : " dark")}>

                    <IconButton onClick={() => { setRefresh(!refresh) }}>
                        <SerachIcon className={(lightTheme ? "" : " dark")} />
                    </IconButton>
                    <input placeholder="Search" className={"search-box" + (lightTheme ? "" : " dark")} />
                </div>

                <div className="user-group-list">
                    {users.map((user, index) => {
                        return (
                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                className={"list-item" + (lightTheme ? "" : " dark")} key={index}
                                onClick={() => {

                                    const config = {
                                        headers: {
                                            Authorization: `Bearer ${userData.token}`
                                        }
                                    };
                                    axios.post('http://localhost:5000/api/v1/chat/',
                                        {
                                            userId: user._id,
                                            name: user.name
                                        },
                                        config).then((res) => {
                                            navigate(`/inbox/chatroom/${res.data._id}&${res.data.name}`)
                                        });

                                }}>
                                <p className="conv-icon">{user.name.charAt(0)}</p>
                                <p className={"conv-title" + (lightTheme ? "" : " dark")}>
                                    {user.name}
                                </p>

                            </motion.div>
                        )
                    })}

                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default Users;