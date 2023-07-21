import React, { useEffect } from "react";
import '../Styles/welcome.css'
import '../Styles/App.css'
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const Logo = require('../Images/live-chat.png');


const Welcome = () => {
    const navigate = useNavigate()
    let userData = null;
    useEffect(() => {
        userData = JSON.parse(localStorage.getItem('user'));
        console.log(userData)
        if (!userData) {
            navigate("/")
        }
    }, [])
    userData = JSON.parse(localStorage.getItem('user'));

    const lightTheme = useSelector((state) => state.themeKey);

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 1, scale: 1 }}
                transition={{
                    ease: "anticipate",
                    duration: "0.4"
                }} className={"welcome-container" + (lightTheme ? "" : " dark")}>
                <img src={Logo} alt='welcome' className="welcome-logo" />
                {userData && <p>Welcome {userData.user.name} ! <span>&#128075;</span> </p>}
                <p>View and text directly to people present in the chat rooms. </p>
            </motion.div>
        </AnimatePresence>
    )
}


export default Welcome;