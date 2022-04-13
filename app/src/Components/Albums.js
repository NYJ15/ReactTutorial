import React from 'react';
import axios from "axios";
import Grid from '@mui/material/Grid';
import FolderIcon from '@mui/icons-material/Folder';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const baseURL = "http://0.0.0.0:8080/albums";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
}));

const Albums = () => {
    const [albums, setAlbums] = React.useState(null);
    const lightTheme = createTheme({ palette: { mode: 'light' } });

    React.useEffect(() => {
        axios.get(baseURL).then((response) => {
            setAlbums(response.data['result']);
        });
    }, []);


    return (

        <Grid container spacing={2} justifyContent="center"
            alignItems="center" minHeight="50vh" className="font-link">

            <Grid item xs={5}>
                <ThemeProvider theme={lightTheme}>
                    {albums && albums.length > 0 ?
                        <Box
                            sx={{
                                p: 6,
                                display: 'grid',
                                gridTemplateColumns: { md: '1fr 1fr' },
                                gap: 2,
                                background: "#ffffffb0",
                                borderRadius: "20px",
                                marginTop: "10%"
                            }}
                        >
                           
                            <h2><b>
                                
                                Albums
                            </b></h2>
                            <br />
                            {albums.map((item) => (
                                <Link to={"/images/" + item.album_id} key={item.album_id} style={{ textDecoration: 'none', }}>
                                    <Item key={item.album_id} elevation="8" sx={{
                                        display: 'flex',
                                        alignItems: 'center', justifyContent: 'left',
                                        borderRadius: "5px",
                                    }}>
                                        <FolderIcon sx={{ p: 1 }} />
                                        <span className="font-link">{item.album_name}</span>
                                    </Item>
                                </Link>
                            ))}
                        </Box>
                        :
                        <Box
                            sx={{
                                p: 6,
                                display: 'grid',
                                gridTemplateColumns: { md: '1fr 1fr' },
                                gap: 2,
                                background: "#ffffffb0",
                                borderRadius: "20px"
                            }}
                        >
                            <h1 style={{ marginLeft: "40%" }}>Albums</h1>
                            <br />
                            <h4 style={{ marginLeft: "43%" }}>No Albums</h4>
                        </Box>
                    }
                </ThemeProvider>
            </Grid>

        </Grid>

    );
}

export default Albums;