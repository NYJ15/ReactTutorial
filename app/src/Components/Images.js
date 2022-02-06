//file: src/Components/Images.js

import axios from "axios";
import React from "react";
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import "./Images.css"
import {
  Link
} from "react-router-dom";

const baseURL = "http://0.0.0.0:8080/upload_image";

const Images = () => {
  const [images, setPost] = React.useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setPost(response.data);
    });
  }, []);

  if (!images) return null;

  return (
    <><div><Link to="/upload">Upload Image</Link></div><Box display="grid" gridTemplateColumns="repeat(12, 1fr)" m={2} pt={3}>
      <Box gridColumn="span 2"></Box>
      <Divider orientation="vertical" flexItem style={{ marginRight: "30px" }} />
      <Box gridColumn="span 5" sx={{ marginLeft: "70px" }}>
        <h1 style={{ color: "black" }}>Images</h1>
        <div>
          {images['images'].map(item => (
            <div key={item._id}>
            <><><h3 style={{ color: "black" }}>{item._source.name} </h3>
              <img src={item._source.path} alt={item._source.name} style={{ flex: 1, width: '70%', height: '70%', resizeMode: 'contain' }} />
            </>

              <div style={{ marginTop: "10px", color: "#1b5fdc" }}>  
              Tags:  {item._source.tags}</div></>
              </div>
          ))}
        </div>
      </Box>
      <Divider orientation="vertical" flexItem style={{ marginLeft: "30px" }} />
      <Box gridColumn="span 3"></Box>
    </Box></>


  );
}

export default Images;