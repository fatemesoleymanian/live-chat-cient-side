import React from "react";
import { useNavigate } from "react-router-dom";
import '../Styles/sidebar.css'
import '../Styles/App.css'
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Group from '@mui/icons-material/Group'

const ConversationItem = ({ name, lastMessage, timestamp, _id, groupTypeFlag }) => {

    const navigate = useNavigate()
    const lightTheme = useSelector((state) => state.themeKey);

    return (
        <>
            <motion.div title={groupTypeFlag === true ? "group chat" : "private chat"} onClick={() => {
                navigate(`chatroom/${_id}&${name}`)
            }}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.98 }} className={"conversation-containrt" + (lightTheme ? "" : " conversation-containrt-dark")} >
                <p className={"conv-icon"}>
                    {groupTypeFlag === true ? <Group className={"icon" + (lightTheme ? "" : " dark")} /> : name[0]}

                </p>
                <p className={"conv-title" + (lightTheme ? "" : " dark-txt")}>{name}</p>
                <p className={"conv-lastMessage" + (lightTheme ? "" : " dark-txt")}>{lastMessage && lastMessage.length > 16 ? `${lastMessage.substring(0,16)}...` : lastMessage}</p>
                <p className={"conv-timestamp" + (lightTheme ? "" : " dark-txt")}>{timestamp}</p>

            </motion.div>
        </>
    )

}

export default ConversationItem;