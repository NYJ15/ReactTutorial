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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="auto"
      >
      <h1 >Search</h1>
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
          <MyFormControlLabel value="both" label="Search By Both" control={<Radio color="secondary" onClick={() => setSearchParam("both")} />} />

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
                <SearchIcon sx={{ color: "#1976d2" }} />
              </InputAdornment>
            )
          }}
          className={classes.root}
        />
      </Box>

      {images &&

        <ImageList sx={{ width: 1200, height: "auto", margin: "10px 50px 50px 100px" }} cols={3} gap={8} m={2} pt={3}>
          {images['images'].map((item) => (
            <ImageListItem key={item._id}>
              <img
                src={`${item._source.path}?w=161&fit=crop&auto=format`}
                srcSet={`${item._source.path}?w=161&fit=crop&auto=format&dpr=2 2x`}
                alt={item._source.name}
                loading="lazy"
                style={{ height: "300px" }} />
              <ImageListItemBar
                title={item._source.name}
                subtitle={item._source.tags} />
            </ImageListItem>
          ))}
        </ImageList>
      }
    </div>
  )

}

export default Search