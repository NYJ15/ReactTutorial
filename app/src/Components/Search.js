import React from 'react';
import axios from "axios";
import { Box, TextField, InputAdornment} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';


const baseURL = " http://0.0.0.0:8080/search_tags";

function Search() {

  const [images, setImages] = React.useState(null);


  const searchTags = (event) => {
    console.log(event.target.value);

    if (!(event.target.value)) {
      setImages(null);
    }
    else {
      axios
        .post(baseURL, JSON.stringify({ "search": event.target.value }), {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then((response) => {
          console.log(response.data["images"])
          setImages(response.data);
        })
        .catch((error) => {
          // error response
          console.log(error)
        });
    }

  }
  return (
    <div>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="30vh"
      >
        <TextField label="Search by Tags" id="outlined-search" type="search" onChange={searchTags} 
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{color: "#1976d2"}}/>
            </InputAdornment>
          )
        }}
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