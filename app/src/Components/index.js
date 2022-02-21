//file: src/Components/index.js

import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";


import Upload from './Upload';
import Images from './Images';
import SignUp from './Register';
import Albums from './Albums';
import Search from './Search';


const Components = () => {
    return(
        <Router>
            <Routes>
            <Route path = "/upload" element={<Upload />} />
            <Route path = "/" element={<Albums />} />
            <Route path = "/images/:id" element={<Images />}  />
            <Route path = "/register" element={<SignUp />} />
            <Route path = "/search" element={<Search />} />
            </Routes>
        </Router>
    );
};

export default Components;