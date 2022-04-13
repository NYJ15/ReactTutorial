import React from 'react';
import axios from "axios";
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { makeStyles } from "@material-ui/core/styles";
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#000000a8",
      borderWidth: "2px"
    },
    "& .MuiOutlinedInput-input": {
      color: "#000000a8"
    },
    "& .MuiInputLabel-outlined": {
      color: "#000000a8"
    }
  }
});

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
  ({ theme }) => ({
    '.MuiFormControlLabel-label': {
      color: "#000000a8",
      FontFamily: "Poppins"
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

const baseURL = "http://0.0.0.0:8080/search_tags";

function Search() {
  const [searchParam, setSearchParam] = React.useState("tags")

  const [images, setImages] = React.useState(null);

  const searchTags = (event) => {
    if (!(event.target.value)) {
      setImages(null);
    }
    else {
      axios
        .post(baseURL, JSON.stringify({ 
          "search": event.target.value,
          "parameter": searchParam
        }), {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then((response) => {
          setImages(response.data);
        })
        .catch((error) => {
          // error response
          console.log(error)
        });
    }

  }

  const classes = useStyles();

  return (
    <div>
      <Box m={2} pt={3}
        sx={{
          background: "#ffffff4f",
          borderRadius: "20px",
          height: "100%"
        }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="auto"
      >
      <h1 className="font-link">Search</h1>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="10vh"
      >
        <RadioGroup name="use-radio-group" defaultValue="tags" row>
          <MyFormControlLabel value="tags"  label={<Typography style={{fontFamily: "Poppins"}}>Search By Tags</Typography>} control={<Radio color="default"  onClick={() => setSearchParam("tags")} />} />
          <MyFormControlLabel value="text" label={<Typography style={{fontFamily: "Poppins"}}>Search By Text</Typography>} control={<Radio color="default" onClick={() => setSearchParam("text")} />} />
          <MyFormControlLabel value="both" label={<Typography style={{fontFamily: "Poppins"}}>Search By Both</Typography>} control={<Radio color="default" onClick={() => setSearchParam("both")} />} />

        </RadioGroup>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="12vh"
      >
        <TextField label="Search" id="outlined-search" type="search" onChange={searchTags}
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

      {images &&

        <ImageList sx={{ width: "84em", height: "auto", margin: "10px 50px 50px 40px" }} cols={3} gap={10} m={2} pt={3}>
          {images['images'].map((item) => (
            <ImageListItem key={item._id}>
            <div style={{ padding: 15, background: "#ffffffb3" }} >
              <img
                src={`${item._source.path}?w=161&fit=crop&auto=format`}
                srcSet={`${item._source.path}?w=161&fit=crop&auto=format&dpr=2 2x`}
                alt={item._source.name}
                loading="lazy"
                style={{ height: "250px", width: "25.5em", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}
              />
              <ImageListItemBar
                sx={{ fontFamily: "Poppins", marginTop: "1.5em" }}
                title={item._source.name}
                subtitle={<span>Album: {item._source.album} | Tags: {item._source.tags.join(', ')} </span>}
                position="below"
              />
            </div>

          </ImageListItem>
          ))}
        </ImageList>
      }
      </Box>
    </div>
  )

}

export default Search