import React from 'react';
import axios from "axios";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import FolderIcon from '@mui/icons-material/Folder';
import Box from '@mui/material/Box';


const baseURL = "http://0.0.0.0:8080/albums";

const Albums = () => {
    const [albums, setAlbums] = React.useState(null);

    const Demo = styled('div')(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
    }));

    React.useEffect(() => {
        axios.get(baseURL).then((response) => {
            setAlbums(response.data);
            console.log(response.data)
        });
    }, []);

    if (!albums) return null;

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
        >
            <Grid >
                <Typography variant="h6" component="div">
                    My Albums
                </Typography>

                <Demo>
                    <List>
                        {albums['result'].map((item) => (
                            <ListItem>
                                <ListItemIcon>
                                    <FolderIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.album_name}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Demo>
            </Grid>
        </Box>

    );
}

export default Albums;