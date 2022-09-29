import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import Matchs from '../../pages/Matchs';
import Navbar from '../Navbar';

const index = () => {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path= "/" element={<Home/>}/>
                <Route path= "/profile" exact="true" element={<Profil/>}/>
                <Route path= "/matchs" exact="true" element={<Matchs/>}/>
                <Route path= "*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </Router>
    );
};

export default index;