//file: src/Components/Header.js
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

const changeRouteHome = () => {
  window.location = '/';
}

const changeRouteMyAlbums = () => {
  window.location = '/';
}

const changeRouteUpload = () => {
  window.location = '/upload';
}

const changeRouteSearch = () => {
  window.location = '/search';
}


export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };


  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose} style={{ color: "black", fontFamily: 'Raleway' }}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose} style={{ color: "black", fontFamily: 'Raleway' }}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );



  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: "black" }}>
        <Toolbar>
          <img src="test.png" alt="logo" style={{ maxWidth: 150, marginRight: '10px' }} onClick={changeRouteHome} />
          <Box sx={{ display: { xs: 'none', sm: 'block' }, marginLeft: '20px' }}>

            <Typography
              key="My Albums"
              onClick={changeRouteMyAlbums}
              sx={{ color: 'white', fontFamily: 'Halimum', fontSize: 18 }}
            >
              My Albums
            </Typography>

          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, marginLeft: '20px' }}>

            <Typography
              key="Upload"
              onClick={changeRouteUpload}
              sx={{ color: 'white', fontFamily: 'Raleway', fontSize: 18 }}
            >
              Upload Image
            </Typography>

          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'block' }, marginLeft: '20px' }}>

            <Typography
              key="Search"
              onClick={changeRouteSearch}
              sx={{ color: 'white', fontFamily: 'Raleway', fontSize: 18 }}
            >
              Search
            </Typography>

          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {/* <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              style={{ color: "white" }}
            >
              <AccountCircle />
            </IconButton>
          </Box> */}


        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
