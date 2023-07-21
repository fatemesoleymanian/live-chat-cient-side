import React, { createContext, useState } from "react";
import '../../Styles/container.css'
import '../../Styles/App.css'
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// type stateType = {
//     themeKey: boolean,
// }
export const myContext = createContext();

const MainContainer = () => {
    const dispatch = useDispatch();

    const lightTheme = useSelector((state) => state.themeKey);
    const [refresh, setRefresh] = useState(true);

    return (<div className={"wrapper" + (lightTheme ? "" : " dark-container")}>
        <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh }}>
            <Sidebar />
            <Outlet />
        </myContext.Provider>
    </div>)


}

export default MainContainer;