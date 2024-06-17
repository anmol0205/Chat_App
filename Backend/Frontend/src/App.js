import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import SignUp from './Components/Sign';
import UserState from './Context/UserState';
import User from './Components/User';
import Lobby from './Components/Lobby';
import Room from './Components/Room';
import { FrndProvider } from './Context/FrndState';
function App() {
  return (
      <UserState>
      <FrndProvider>
        <Routes>
        <Route path="/Sign" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path='/Profile' element={<User/>}></Route>
        <Route path='/Lobby' element={<Lobby/>}/>
        <Route path='/room/:roomid' element={<Room/>}/>
        </Routes>
      </FrndProvider>
      </UserState>
    
    
  );
}

export default App;
