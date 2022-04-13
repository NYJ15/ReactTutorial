//file: src/Components/Images.js

import axios from "axios";
import React from "react";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@mui/material/Typography';

import {
  useParams
} from "react-router-dom";

const baseURL = "http://0.0.0.0:8080/album_images/";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
      color: "#000000a8",
      fontFamily: "Poppins"
    }
  }
});

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
  ({ theme }) => ({
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#000000a8",
      borderWidth: "2px",
      fontFamily: "Poppins"
    },
    "& .MuiOutlinedInput-input": {
      color: "#000000a8",
      borderColor: "#000000a8",
      fontFamily: "Poppins"
    },
    "& .MuiInputLabel-outlined": {
      color: "#000000a8",
      borderColor: "#000000a8",
      fontFamily: "Poppins"
    }
  }),
);

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <StyledFormControlLabel checked={checked} {...props} />;
}

MyFormControlLabel.propTypes = {
  value: PropTypes.any,
};


function Images() {
  const [images, setImages] = React.useState(null);
  const [searchParam, setSearchParam] = React.useState("tags")

  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  let { id } = useParams();

  React.useEffect(() => {
    axios.get(baseURL + id).then((response) => {
      setImages(response.data);
    });
  }, []);

  const classes = useStyles();

  const [sortBy, setSortBy] = React.useState('');

  const handleChange = (event) => {
    setSortBy(event.target.value);
    let sort_field = event.target.value.toLowerCase();
    if (sort_field === "name") {
      const sortedData = [...images['images']].sort((a, b) => {
        return a._source.name > b._source.name ? 1 : -1
      })
      setImages({ "images": sortedData })
    }
    else {
      const sortedData = [...images['images']].sort((a, b) => {

        return a._source.uploaded_on > b._source.uploaded_on ? 1 : -1
      })
      setImages({ "images": sortedData })
    }

  };

  const handleUpdate = (imageid) => {
    window.location = '/edit/' + imageid;
  }

  const handleDelete = (image_id) => {
    axios
      .delete("http://0.0.0.0:8080/image/" + image_id)
      .then((resp) => {
        alert(resp.data['result'])
        window.location.reload();
      })
      .catch((error) => {
        console.log(error)
      });
  };
  if (!images) return null;

  const searchTags = (event) => {
    if (event.target.value !== "") {
    axios
      .post("http://0.0.0.0:8080/search_tags", JSON.stringify({
        "search": event.target.value,
        "parameter": searchParam,
        "album_id": id
      }), {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((resp) => {
        if (resp.data['images'].length > 0) {
          setImages(resp.data);
        }
        else {
          setState({
            open: true, ...{
              vertical: 'top',
              horizontal: 'center',
            }
          });

        }
      })
      .catch((error) => {
        console.log(error)
      });
    }
  }


  return (
    <div>
      <Box m={2} pt={3}
        sx={{
          background: "#ffffff4f",
          borderRadius: "20px",
          height: "2000px"
        }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="auto"
        >
          <h2 className="font-link" style={{ textTransform: "capitalize", fontSize: "2.2em" }}>{images['images'][0]['_source']['album']}</h2>
        </Box>

        <Box
          display="flex"
          minHeight="auto"
          sx={{marginLeft: "3%"}}
        >
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="3vh"
            >
              <RadioGroup name="use-radio-group" defaultValue="tags" row>
                <MyFormControlLabel value="tags" label={<Typography style={{fontFamily: "Poppins"}}>Search By Tags</Typography>} control={<Radio color="default" onClick={() => setSearchParam("tags")} />} />
                <MyFormControlLabel value="text" label={<Typography style={{fontFamily: "Poppins"}}>Search By Text</Typography>} control={<Radio color="default" onClick={() => setSearchParam("text")} />} />
              </RadioGroup>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="auto"
            >
              <TextField label="Search" id="outlined-search" type="search" onChange={searchTags} fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#000000a8" }} />
                    </InputAdornment>
                  )
                }}

                className={classes.root}
              />
            </Box>
          </FormControl>
          <FormControl sx={{ m: 2, minWidth: 120, marginTop: "3.7%", }} className={classes.root}>
            <InputLabel id="demo-simple-select-label" sx={{ fontFamily: "Poppins" }}>Sort By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sortBy}
              label="Sort By"
              onChange={handleChange}
            >
              <MenuItem value={"Date"} sx={{ fontFamily: "Poppins" }}>Date</MenuItem>
              <MenuItem value={"Name"} sx={{ fontFamily: "Poppins" }}>Name</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <ImageList sx={{ width: "84em", height: "auto", margin: "30px 50px 50px 40px" }} cols={3} gap={30} >
          {images['images'] && images['images'].length > 0 && images['images'].map((item) => (
            <ImageListItem key={item._id}>
              <div style={{ padding: 15, background: "white" }} >
                <img
                  src={`${item._source.path}?w=161&fit=crop&auto=format`}
                  srcSet={`${item._source.path}?w=161&fit=crop&auto=format&dpr=2 2x`}
                  alt={item._source.name}
                  loading="lazy"
                  style={{ height: "250px", width: "25em", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}
                />
                <ImageListItemBar
                  sx={{ fontFamily: "Poppins", marginTop: "1.5em" }}
                  title={item._source.name}
                  subtitle={item._source.tags.join(', ')}
                  position="below"
                  actionIcon={
                    <IconButton
                      aria-label={`info about ${item.title}`}
                    >
                      <EditIcon sx={{ color: '#5284b1c4' }} onClick={() => handleUpdate(item._id)} />
                      <DeleteForeverIcon sx={{ color: '#cb6165' }} onClick={() => handleDelete(item._id)} />
                    </IconButton>
                  }
                />
              </div>

            </ImageListItem>
          ))}
        </ImageList>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          autoHideDuration={1000}
          open={open}
          onClose={handleClose}
          key={vertical + horizontal}
        >
          <Alert severity="error">No Images</Alert>
        </Snackbar>
      </Box>
    </div>

  );
}

export default Images;
