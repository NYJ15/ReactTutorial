//file: src/Components/Upload.js

import React, { useState } from 'react';
import axios from "axios";
import "./Upload.css"
import { Box, TextField, Button } from '@mui/material';
import BackupIcon from '@mui/icons-material/Backup';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const initialState = { alt: "", src: "" };

function Upload() {
  const baseURL = " http://0.0.0.0:8080/upload_image";
  const [uploadFile, setUploadFile] = React.useState();
  const [Album, setAlbum] = React.useState();
  const [tags, setTags] = React.useState();
  const [{ alt, src }, setPreview] = useState(initialState);
  const [oldAlbums, setOldAlbums] = React.useState();
  const [apiResponse, setResponse] = React.useState();

  const [value, setValue] = React.useState(null);
  const filter = createFilterOptions();

  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  React.useEffect(() => {
    axios.get("http://0.0.0.0:8080/albums").then((response) => {
      console.log(response.data)
      setOldAlbums(response.data['result']);
    });
  }, []);


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
        setResponse(response.data["result"])
        setState({
          open: true, ...{
            vertical: 'top',
            horizontal: 'center',
          }
        });
        setTimeout(() => { window.location = '/images/' + response.data['album_id']; }, 1500);

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
          <Button variant="outlined" sx={{
            width: "70%", marginBottom: "10px", marginLeft: "40px", border: 'none', '&:hover': {
              background: 'none',
              border: 'none'
            },
          }}>
            Upload Image
          </Button>
          <Autocomplete
            value={value}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                setValue({
                  album_name: newValue,
                });
              } else if (newValue && newValue.inputValue) {
                setValue({
                  album_name: newValue.inputValue,
                });
              } else {
                setValue(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const isExisting = options.some((option) => inputValue === option.album_name);
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  album_name: `Add "${inputValue}"`,
                });
              }
              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={oldAlbums}
            getOptionLabel={(option) => {
              if (typeof option === 'string') {
                setAlbum(option)
                return option;
              }
              if (option.inputValue) {
                setAlbum(option.inputValue)
                return option.inputValue;
              }
              // Regular option
              setAlbum(option.album_name);
              return option.album_name;
            }}
            renderOption={(props, option) => <li {...props}>{option.album_name}</li>}
            // sx={{ width: 300 }}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Album Name" />
            )}
          />

          {/* <TextField label="Album Name" color="secondary" id="margin-normal" margin="normal" focused onChange={(e) => setAlbum(e.target.value)} /> */}
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

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert severity="success">{apiResponse}</Alert>
      </Snackbar>

    </div>
  );
}
export default Upload;