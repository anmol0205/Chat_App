import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import SignUp from './Components/Sign';
import UserState from './Context/UserState';
import User from './Components/User';
import Lobby from './Components/Lobby';
import Room from './Components/Room';
import Home from './Components/Home';
import { FrndProvider } from './Context/FrndState';
function App() {
  return (
      <UserState>
      <FrndProvider>
        <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/Sign" element={<SignUp />} />
        <Route path='/Profile' element={<User/>}></Route>
        <Route path='/Lobby' element={<Lobby/>}/>
        <Route path='/room/:roomid' element={<Room/>}/>
        </Routes>
      </FrndProvider>
      </UserState>
    
    
  );
}

export default App;
