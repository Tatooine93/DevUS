import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import Conversation from '../../pages/Conversation';
import Navbar from '../Navbar';

const index = () => {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path= "/" element={<Home/>}/>
                <Route path= "/profile" exact element={<Profil/>}/>
                <Route path= "/conversation" exact element={<Conversation/>}/>
                <Route path= "*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </Router>
    );
};

export default index;