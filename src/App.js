import './Styles/App.css'
import MainContainer from './Components/Layout/MainContainer';
import { Route, Routes } from 'react-router-dom';
import Welcome from './Pages/Welcome';
import Chatbar from './Components/Layout/ChatBar';
import Users from './Pages/Users';
import Groups from './Pages/Groups';
import CreateGroups from './Pages/CreateGroups.jsx';
import LoginAndRegister from './Pages/Auth/Login&Register'
import { useEffect, useRef } from 'react';

function App() {
   
 
  return (
    <div className="App" >
      <Routes>
        <Route path='/' element={<LoginAndRegister />} />
        <Route path='inbox' element={<MainContainer />} >
          <Route path='welcome' element={<Welcome />} />
          <Route path='chatroom/:_id' element={<Chatbar />} />
          <Route path='users' element={<Users />} />
          <Route path='groups' element={<Groups />} />
          <Route path='create-group' element={<CreateGroups />} />

        </Route>
      </Routes>
    </div>
  );
}

export default App;
