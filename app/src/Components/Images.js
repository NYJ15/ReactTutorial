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
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import IconButton from '@mui/material/IconButton';

import {
  useParams
} from "react-router-dom";

const baseURL = "http://0.0.0.0:8080/album_images/";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
  ({ theme }) => ({
    '.MuiFormControlLabel-label': {
      color: theme.palette.primary.main,
      FontFamily: "Raleway"
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
      console.log(response.data['images'])
      setImages(response.data);
    });
  }, []);

  if (!images) return null;

  const searchTags = (event) => {

      axios
        .post("http://0.0.0.0:8080/search_tags", JSON.stringify({
           "search": event.target.value, 
           "parameter": searchParam,
           "album_id": id}), {
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


  return (
    <div>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="auto"
      >
      <h1 >{images['images'][0]['_source']['album'].toUpperCase()}</h1>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="12vh"
      >
        <RadioGroup name="use-radio-group" defaultValue="tags" row>
          <MyFormControlLabel value="tags" label="Search By Tags" control={<Radio color="secondary" onClick={() => setSearchParam("tags")} />} />
          <MyFormControlLabel value="text" label="Search By Text" control={<Radio color="secondary" onClick={() => setSearchParam("text")} />} />
        </RadioGroup>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="auto"
      >
        <TextField label="Search" id="outlined-search" type="search" onChange={searchTags}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#1976d2" }} />
              </InputAdornment>
            )
          }}
        />
      </Box>
      <ImageList sx={{ width: 1200, height: "auto", margin: "50px 50px 50px 100px" }} cols={3} gap={20} m={2} pt={3}>
        {images['images'] && images['images'].length > 0  && images['images'].map((item) => (
          <ImageListItem key={item._id}>
            <img
              src={`${item._source.path}?w=161&fit=crop&auto=format`}
              srcSet={`${item._source.path}?w=161&fit=crop&auto=format&dpr=2 2x`}
              alt={item._source.name}
              loading="lazy"
              style={{ height: "300px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }} />
            <ImageListItemBar
              title={item._source.name}
              subtitle={item._source.tags}
            // actionIcon={
            //   <IconButton
            //     sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
            //     aria-label={`info about ${item.title}`}
            //   >
            //     <DeleteForeverIcon />
            //   </IconButton>
            // } 
            />

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
    </div>

  );
}

export default Images;