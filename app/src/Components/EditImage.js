//file: src/Components/Upload.js

import React, { useState } from 'react';
import axios from "axios";
import "./Upload.css"
import { Box, TextField, Button } from '@mui/material';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import {
    useParams
} from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "#000000a8",
            borderWidth: "2px",
            fontFamily: "Poppins"
        },
        "& .MuiOutlinedInput-input": {
            color: "#000000a8",
            fontFamily: "Poppins"
        },
        "& .MuiInputLabel-outlined": {
            color: "#000000a8s",
            fontFamily: "Poppins"
        }
    }
});


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const initialState = { alt: "", src: "" };

function Edit() {
    let { id } = useParams();
    const baseURL = " http://0.0.0.0:8080/image/";
    const [tags, setTags] = React.useState();
    const [{ alt, src }, setPreview] = useState(initialState);
    const [apiResponse, setResponse] = React.useState();
    const [imageData, setImageData] = React.useState();
    const [severity, setSeverity] = React.useState();

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
        axios.get(baseURL + id).then((response) => {
            setPreview({
                src: response.data['images']['_source']['path'],
                alt: response.data['images']['_source']['name']
            })
            setImageData(response.data['images']['_source'])
        });
    }, []);


    const submitForm = (event) => {
        event.preventDefault();

        const dataArray = new FormData();
        dataArray.append("tags", tags);

        axios
            .put(baseURL + id, dataArray, {
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
    }


    const classes = useStyles();

    return (
        <div style={{ marginTop: "3%" }} class="bckg"> 
            <form onSubmit={submitForm} style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>

                <Box m={2} pt={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        '& .MuiTextField-root': { width: '42ch' },
                        justifyContent: "space-between",
                        p: 8,
                        background: "#ffffffb0",
                        borderRadius: "20px"
                    }}>

                    <h2 className="font-link" sx={{ width: "70%", marginLeft: "40px", background: "white" }}>
                        Edit Image
                    </h2>

                    {imageData &&
                        <Card sx={{ display: 'flex', background: "white", }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 200, padding: "0.8em"}}
                                image={src}
                                alt={alt}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: 200 }} className="font-link">
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                    <Typography component="div" color="black" >
                                        <b>

                                            <span className="font-link">
                                                Album:
                                            </span>
                                        </b>

                                    </Typography>
                                    <Typography component="div" variant="subtitle1" color="black" >
                                        <small>
                                            <span className="font-link">
                                                {imageData.album}
                                            </span>
                                        </small>
                                    </Typography>
                                    <Typography component="div" variant="subtitle1" color="black" >
                                        <b>
                                            <span className="font-link">
                                                Name:
                                            </span>
                                        </b>
                                    </Typography>
                                    <Typography variant="subtitle1" color="black" component="div">
                                        <small>

                                            <span className="font-link">
                                                {imageData.name}
                                            </span>
                                        </small>

                                    </Typography>
                                    <Typography component="div" variant="subtitle1" color="black" >
                                        <b>

                                            <span className="font-link">
                                                Tags:
                                            </span>
                                        </b>

                                    </Typography>
                                    <Typography variant="subtitle1" color="black" component="div">
                                        <small>

                                            <span className="font-link">
                                                {imageData.tags.join(', ')}
                                            </span>
                                        </small>

                                    </Typography>
                                </CardContent>

                            </Box>

                        </Card>
                    }
                    {/* <TextField label="Album Name" color="secondary" id="margin-normal" margin="normal" focused onChange={(e) => setAlbum(e.target.value)} /> */}
                    <TextField label="Tags" id="margin-normal" margin="normal" onChange={(e) => setTags(e.target.value)} className={classes.root} />
                    <Button variant="contained" type="submit" endIcon={<CloudDoneIcon />}
                        sx={{ width: "100%", marginTop: "10px", textTransform: "capitalize", background: "#000000a8"}}>
                        <span className="font-link" >
                            Submit
                        </span>
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

        </div >
    );
}
export default Edit;