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
            alignItems="center" minHeight="50vh">

            <Grid item xs={5}>
                <ThemeProvider theme={lightTheme}>
                    <h1 style={{ marginLeft: "40%" }}>Albums</h1>
                    {albums && albums.length > 0 ?
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: 'background.default',
                                display: 'grid',
                                gridTemplateColumns: { md: '1fr 1fr' },
                                gap: 2,

                            }}
                        >
                            {albums.map((item) => (
                                <Link to={"/images/" + item.album_id} key={item.album_id} style={{ textDecoration: 'none', }}>
                                    <Item key={item.album_id} elevation="8" sx={{
                                        display: 'flex',
                                        alignItems: 'center', justifyContent: 'left'
                                    }}>
                                        <FolderIcon sx={{ p: 1 }} />
                                        {item.album_name}
                                    </Item>
                                </Link>
                            ))}
                        </Box>
                        :

                        <h4 style={{ marginLeft: "43%" }}>No Albums</h4>
                    }
                </ThemeProvider>
            </Grid>

        </Grid>

    );
}

export default Albums;