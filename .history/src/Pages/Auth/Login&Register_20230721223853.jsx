import React, { FormEvent, useEffect, useState } from "react";
import '../../Styles/login.css';
import '../../Styles/App.css'
import '../../Styles/sidebar.css';
import FormControl from '@mui/material/FormControl';
import { Button, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, CircularProgress } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toaster from '../../Components/Toaster';
const Logo = require('../../Images/live-chat.png');




const LoginAndRegister = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log(userData)
        if (userData) {
            navigate("/inbox/welcome")
        }
    }, [])


    const [log_Or_reg, setLog_Or_reg] = useState(false);

    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const [loginStatus, setLoginStatus] = React.useState({ message: "", key: Math.random() });
    const [signUpStatus, setSignUpStatus] = React.useState({ message: "", key: Math.random() });


    const lightTheme = useSelector((state) => state.themeKey);
    console.log(lightTheme)

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // const changeHandler = (e: React.FormEvent) => {
    //     console.log(e.target.value)
    //     setData({ ...data, [e.target.name]: e.target.value })
    // }

    const loginHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                },
            };

            const response = await axios.post(
                "https://live-chat-server-side.vercel.app/api/v1/user/auth/login",
                data,
                config
            );
            console.log(response);
            setLoginStatus({ message: "Success", key: Math.random() });
            setLoading(false)
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/inbox/welcome')
        } catch (error) {
            setLoginStatus({
                message: "Invalid username or password!",
                key: Math.random()
            })
        }
        setLoading(false)

    }
    const signupHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                },
            };

            const response = await axios.post(
                "http://localhost:5000/api/v1/user/auth/register",
                data,
                config
            );
            console.log(response);
            setSignUpStatus({ message: "Success", key: Math.random() });
            setLoading(false)
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/inbox/welcome')
        } catch (error) {
            if (error.response.status === 400) {
                console.log("error")

                setSignUpStatus({
                    message: "Email or username already taken.choose another please.",
                    key: Math.random()
                })
            }
        }
        setLoading(false)


    }


    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 1, scale: 1 }}
                transition={{
                    ease: "anticipate",
                    duration: "0.4"
                }} className={"login-wrapper" + (lightTheme ? "" : " dark-container")}>
                <div className="image-container">
                    <img src={Logo} alt='welcome' className="welcome-logo" />
                </div>
                {/* LOGIN */}
                {
                    log_Or_reg && <div className={"login-box" + (lightTheme ? "" : " dark")}>
                        <h2 className={"login-text" + (lightTheme ? "" : " dark")}>Login to your account.</h2>
                        <TextField id="standard-basic" label="Username :" variant="outlined" onChange={(e) => setData({ ...data, name: e.target.value })}
                            inputProps={{ style: { color: (lightTheme ? "black" : " grey") } }} />
                        <FormControl sx={{ m: 1, width: '26ch', color: 'grey' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password :</InputLabel>
                            <OutlinedInput

                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                            />
                        </FormControl>
                        <Button variant="outlined" onClick={loginHandler}>Login</Button>
                        <h4 className="switch-auth-text">
                            You don't have an account?
                            <b className="switch-auth" onClick={() => { setLog_Or_reg(!log_Or_reg) }}>
                                Sign Up</b></h4>
                        {loginStatus ? (
                            <Toaster key={loginStatus.key} message={loginStatus.message} />
                        ) : null}
                    </div>
                }
                {/* Register */}
                {
                    !log_Or_reg && <div className={"login-box" + (lightTheme ? "" : " dark")}>
                        <h2 className={"login-text" + (lightTheme ? "" : " dark")}>Create an account.</h2>
                        <TextField id="standard-basic" label="Username :" variant="outlined" onChange={(e) => setData({ ...data, name: e.target.value })}
                            inputProps={{ style: { color: (lightTheme ? "black" : " grey") } }} />
                        <TextField id="standard-basic" label="Email :" variant="outlined" onChange={(e) => setData({ ...data, email: e.target.value })}
                            inputProps={{ style: { color: (lightTheme ? "black" : " grey") } }} />
                        <FormControl sx={{ m: 1, width: '26ch', color: 'grey' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password :</InputLabel>
                            <OutlinedInput

                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                            />
                        </FormControl>
                        <Button variant="outlined" onClick={signupHandler}>Sign Up</Button>
                        <h4 className="switch-auth-text">
                            Already have an account?
                            <b className="switch-auth" onClick={() => { setLog_Or_reg(!log_Or_reg) }}>
                                Login</b></h4>
                        {signUpStatus ? (
                            <Toaster key={signUpStatus.key} message={signUpStatus.message} />
                        ) : null}
                    </div>
                }

            </motion.div>
        </AnimatePresence>
    )
}

export default LoginAndRegister;