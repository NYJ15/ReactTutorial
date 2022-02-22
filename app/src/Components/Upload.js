//file: src/Components/Upload.js

import React, { useState } from 'react';
import axios from "axios";
import "./Upload.css"
import { Box, TextField, Button } from '@mui/material';
import BackupIcon from '@mui/icons-material/Backup';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1976d2",
      borderWidth: "2px"
    },
    "& .MuiOutlinedInput-input": {
      color: "#1976d2"
    },
    "& .MuiInputLabel-outlined": {
      color: "#1976d2"
    }
  }
});

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
  const [severity, setSeverity] = React.useState();

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
        setSeverity("success")
        setState({
          open: true, ...{
            vertical: 'top',
            horizontal: 'center',
          }
        });
        setTimeout(() => { window.location = '/images/' + response.data['album_id']; }, 1500);

      })
      .catch((error) => {
        setResponse(error.response.data['result'])
        setSeverity("error")
        setState({
          open: true, ...{
            vertical: 'top',
            horizontal: 'center',
          }
        });
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

  const classes = useStyles();

  return (
    <div style={{marginTop: "4%"}}>
      <form onSubmit={submitForm} style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>

        <Box m={2} pt={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            '& .MuiTextField-root': { width: '25ch' },
            justifyContent: "space-between",
            p: 8, border: '1px solid #c9dcf4',
            background: "linear-gradient(#a1e5f3, #ecfafd)"

          }}>
          <Button variant="outlined" sx={{
            width: "70%", marginBottom: "10px", marginLeft: "40px", border: 'none', '&:hover': {
              background: 'none',
              border: 'none'
            },
          }}>
            Upload Image
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
            <img className="preview" src={src} alt={alt} style={{ width: "250px", marginTop: "5px", marginBottom: "10px" }} />

          </Box>
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
            freeSolo
            sx={{ color: "#1976d2" }}
            renderInput={(params) => (
              <TextField {...params}
                label="Album Name"
                InputLabelProps={{ style: { color: "#1976d2", borderColor: "#1976d2" } }}
                className={classes.root}
              />
            )}
          />

          {/* <TextField label="Album Name" color="secondary" id="margin-normal" margin="normal" focused onChange={(e) => setAlbum(e.target.value)} /> */}
          <TextField label="Tags" color="info" id="margin-normal" margin="normal" onChange={(e) => setTags(e.target.value)} className={classes.root}/>
          <Box pt={1} sx={{
            color: "#1976d2",
            alignItems: 'center',
            justifyContent: "center",
            display: 'flex',
          }}>

            <label htmlFor="fileUpload" style={{
              justifyContent: "center",
              padding: "8px",
              borderRadius: "50%",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "#1976d2"
            }}><BackupIcon /> </label>
            <input type="file" id="fileUpload" onChange={fileHandler} style={{ display: 'none' }} />

          </Box>

          <Button variant="contained" type="submit" endIcon={<CloudDoneIcon />}
            sx={{ width: "70%", marginTop: "10px", marginLeft: "40px", }}>
            Submit
          </Button>


        </Box>

      </form>


      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert severity={severity}>{apiResponse}</Alert>
      </Snackbar>

    </div>
  );
}
export default Upload;