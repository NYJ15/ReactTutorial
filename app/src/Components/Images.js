//file: src/Components/Images.js

import axios from "axios";
import React from "react";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

const baseURL = "http://0.0.0.0:8080/upload_image";

const Images = () => {
  const [images, setImages] = React.useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setImages(response.data);
    });
  }, []);

  if (!images) return null;

  return (
    
    <ImageList sx={{ width: 1200, height: 800, margin: "50px 50px 50px 100px" }} variant="woven" cols={3} gap={8} m={2} pt={3}>
      {images['images'].map((item) => (
        <ImageListItem key={item._id}>
          <img
            src={`${item._source.path}?w=161&fit=crop&auto=format`}
            srcSet={`${item._source.path}?w=161&fit=crop&auto=format&dpr=2 2x`}
            alt={item._source.name}
            loading="lazy" />
          <ImageListItemBar
            title={item._source.name}
            subtitle={item._source.tags} />
        </ImageListItem>
      ))}
    </ImageList>

  );
}

export default Images;