import axios from "axios";
import React from "react";
import "./Images.css"

const baseURL = " http://0.0.0.0:8080/login";

const Images = () => { 
  const [post, setPost] = React.useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setPost(response.data);
      console.log(response.data)
    });
  }, []);

  if (!post) return null;

  return (
    <div>
      <h1>{post.hello}</h1>
      {/* <p>{post.body}</p> */}
    </div>
  );
}

export default Images;