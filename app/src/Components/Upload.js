//file: src/Components/Upload.js

import React, { useState } from 'react';
import axios from "axios";
import "./Upload.css"
import { Box, TextField, Button } from '@mui/material';
import BackupIcon from '@mui/icons-material/Backup';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const initialState = { alt: "", src: "" };

function Upload() {
  const baseURL = " http://0.0.0.0:8080/upload_image";
  const [uploadFile, setUploadFile] = React.useState();
  const [Album, setAlbum] = React.useState();
  const [tags, setTags] = React.useState();
  const [{ alt, src }, setPreview] = useState(initialState);


  const submitForm = (event) => {
    event.preventDefault();

    const dataArray = new FormData();
    dataArray.append("album", Album)
    dataArray.append("tags", tags);
    dataArray.append("file", uploadFile[0]);

    axios
      .post(baseURL, dataArray, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((response) => {
        // successfully uploaded response
        alert(response.data["result"])
        window.location = '/';
      })
      .catch((error) => {
        // error response
        alert(error)
      });
  };

  const fileHandler = event => {
    setUploadFile(event.target.files)
    const { files } = event.target;
    setPreview(
      files.length
        ? {
          src: URL.createObjectURL(files[0]),
          alt: files[0].name
        }
        : initialState
    );
  };

  return (
    <div>
      <form onSubmit={submitForm} style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"

      }}>
        <Box m={2} pt={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            '& .MuiTextField-root': { width: '25ch' },
            justifyContent: "space-between",
            p: 8, border: '1px solid #c9dcf4'
          }}>
          <TextField label="Album Name" color="secondary" id="margin-normal" margin="normal" focused onChange={(e) => setAlbum(e.target.value)} />
          <TextField label="Tags" color="secondary" id="margin-normal" margin="normal" focused onChange={(e) => setTags(e.target.value)} />
          <Box pt={1} sx={{
            color: "#9d27b0",
            border: 1,
            width: "70%",
            height: "30px",
            marginLeft: "40px"
          }}>

            <label htmlFor="fileUpload" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: "center",
            }}><AttachFileIcon /> Choose Image</label>
            <input type="file" id="fileUpload" onChange={fileHandler} style={{ display: 'none' }} />

          </Box>

          <Button variant="outlined" type="submit" endIcon={<BackupIcon />} sx={{ width: "70%", marginTop: "10px", marginLeft: "40px", }}>
            Submit
          </Button>


        </Box>

      </form>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <img className="preview" src={src} alt={alt} style={{ width: "20%", marginTop: "10px" }} />

      </Box>
    </div>
  );
}
export default Upload;