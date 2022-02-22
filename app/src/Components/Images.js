//file: src/Components/Images.js

import axios from "axios";
import React from "react";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import IconButton from '@mui/material/IconButton';

import {
  useParams
} from "react-router-dom";

const baseURL = "http://0.0.0.0:8080/album_images/";

const Images = () => {
  const [images, setImages] = React.useState(null);
  let { id } = useParams();

  React.useEffect(() => {
    axios.get(baseURL + id).then((response) => {
      setImages(response.data);
    });
  }, []);

  if (!images) return null;

  return (
    <div>
      <h1 style={{ marginLeft: "43%" }}>{images['images'][0]['_source']['album'].toUpperCase()}</h1>
    <ImageList sx={{ width: 1200, height: "auto", margin: "50px 50px 50px 100px"}} cols={3} gap={20} m={2} pt={3}>
      {images['images'].map((item) => (
        <ImageListItem key={item._id}>
          <img
            src={`${item._source.path}?w=161&fit=crop&auto=format`}
            srcSet={`${item._source.path}?w=161&fit=crop&auto=format&dpr=2 2x`}
            alt={item._source.name}
            loading="lazy"
            style={{ height: "300px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"  }} />
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
    </div>

  );
}

export default Images;