import React, { useState } from 'react';
import axios from "axios";
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';


const baseURL = " http://0.0.0.0:8080/search_tags";

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));
  

const SearchDiv = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

function Search() {


  const searchTags = (event) => {
    console.log(event.target.value);
    axios
      .post(baseURL, JSON.stringify({ "search": event.target.value }), {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((response) => {
        console.log(response.data["images"])
        // successfully uploaded response
        // alert(response.data["result"])
        // window.location = '/';
      })
      .catch((error) => {
        // error response
        console.log(error)
      });

  }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="30vh"
        >
        <SearchDiv style={{ color: "black" }} >
            <SearchIconWrapper >
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              onClick={searchTags}
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchDiv>
          </Box>
    )

}

export default Search