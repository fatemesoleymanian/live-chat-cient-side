import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
} from "@mui/material";
import React, { useState } from "react";
import '../Styles/create-groups.css'
import '../Styles/App.css'
import DoneOutlineRoundedIcon from '@mui/icons-material/DoneOutlineRounded'
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const CreateGroups = () => {
    const lightTheme = useSelector((state) => state.themeKey);
    const [groupName, setGroupName] = useState('');
    const userData = JSON.parse(localStorage.getItem('user'))
    const [open, setOpen] = React.useState(false);


    const navigate = useNavigate()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const createGroup = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        };
        let users = [];
        users.push(userData.user._id)
        axios.post('https://live-chat-server-side.vercel.app/api/v1/chat/group/', {
            name: groupName,
            users: [JSON.stringify(users)]
        }, config).then((response) => {
            navigate('/inbox/groups')
        })
    }

    return (
        <AnimatePresence>
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Do you want to create a Group Named " + groupName}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            This will create a create group in which you will be the admin and
                            other will be able to join this group.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Disagree</Button>
                        <Button
                            onClick={() => {
                                createGroup();
                                handleClose();
                            }}
                            autoFocus
                        >
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 1, scale: 1 }}
                transition={{
                    ease: "anticipate",
                    duration: "0.4"
                }} className={"create-group-wrapper" + (lightTheme ? "" : " dark")}>
                <input type="text" placeholder="Enter group name ."
                    className={"search-box" + (lightTheme ? "" : " dark")}
                    value={groupName}
                    onChange={(e) => {
                        setGroupName(e.target.value);
                    }}
                    onKeyDown={(event) => {
                        if (event.code === "Enter") {
                            handleClickOpen();
                        }
                    }} />
                <IconButton onClick={() => { handleClickOpen(); }}>
                    <DoneOutlineRoundedIcon className={(lightTheme ? "" : " dark")} />
                </IconButton>
            </motion.div>
        </AnimatePresence>
    )
}


export default CreateGroups;