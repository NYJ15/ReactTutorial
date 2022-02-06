//file: src/Components/index.js

import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";


import Upload from './Upload'
import Images from './Images';


const Components = () => {
    return(
        <Router>
            <Routes>
            <Route path = "/upload" element={<Upload />} />
            <Route path = "/" element={<Images />}  />
            </Routes>
        </Router>
    );
};

export default Components;