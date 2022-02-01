import React, {useEffect, useState} from 'react';
import axios from "axios";
import { useDropzone } from 'react-dropzone';
import "./Upload.css"


const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };
  
  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 200,
    height: 200,
    padding: 4,
    boxSizing: 'border-box'
  };
  
  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };
  
  const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };

const baseURL = " http://0.0.0.0:8080/upload_image";

const Upload = () => {
    const [files, setFiles] = useState([]);
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });
  
  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  function uploadPhoto() {
    const data = new FormData()
    data.append('file', files)
    data.append('tags', ["hello", "new", "test"])
    // axios
    //   .post(baseURL, data)
    //   .headers("Content-Type"= "multipart/form-data" }
    //   .then(response => {
    //     console.log(response.data);
    // }).catch(error => {
    //  console.log("*****  "+error)
    // });
    axios({
      // Endpoint to send files
      url: baseURL,
      method: "POST",
      headers: {
        // Add any auth token here
        content_type: "multipart/form-data" 
        // authorization: "your token comes here",
      },
      // Attaching the form data
      data: data,
    })
      .then((res) => { }) // Handle the response from backend here
      .catch((err) => { }); // Catch errors if any
  }
  

  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Choose a file...</p>
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
      <button onClick={uploadPhoto}> Submit </button>
    </section>
  );
}


// const Upload = () => {
//     const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

//     const files = acceptedFiles.map(file => (
//         <li key={file.path}>
//             {file.path} - {file.size} bytes
//         </li>
//     ));

//     // file conversion

//     // const [post, setPost] = React.useState(null);

//     // React.useEffect(() => {
//     //     axios.get(`${baseURL}`).then((response) => {
//     //         setPost(response.data);
//     //     });
//     // }, []);

//     function uploadPhoto() {
//         const data = new FormData()
//         // data.append('file', acceptedFiles)
//         data.append('tags', ["hello", "new"])
//         axios
//           .post(baseURL, data)
//           .then((response) => {
//             console.log(response.data);
//           });
//       }

//     return (
//         <section className="container">
//             <div {...getRootProps({ className: 'dropzone' })}>
//                 <input {...getInputProps()} />
//                 <p>Drag 'n' drop some files here, or click to select files</p>
//             </div>
//             <aside>
//                 <h4>Files</h4>
//                 <ul>{files}</ul>
//             </aside>
//             {/* button -  on click call the request to upload the photo */}

//             <button onClick={uploadPhoto}> Submit </button>

//         </section>
//     )
// }

export default Upload;