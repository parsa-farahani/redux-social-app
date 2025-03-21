import React, { useState } from "react";
import { AppBar, Box, FormGroup, IconButton, Menu, MenuItem, Toolbar, Typography, useTheme } from "@mui/material";
import { MdAccountCircle } from 'react-icons/md';
import { IoIosMenu } from 'react-icons/io';


const Header = () => {

   const [auth, setAuth] = useState(true);
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

   const theme = useTheme();

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAuth(event.target.checked);
   };

   const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   return (
      <header>
         <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ bgcolor: 'background.paper' }}>
               <Toolbar>
                  <IconButton
                     size="large"
                     edge="start"
                     color="inherit"
                     aria-label="menu"
                     sx={{ mr: 2 }}
                  >
                     <IoIosMenu />
                  </IconButton>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                     Photos
                  </Typography>
                  {
                     auth && (
                        <div>
                           <IconButton
                              size="large"
                              aria-label="account of current user"
                              aria-controls="menu-appbar"
                              aria-haspopup="true"
                              color="inherit"
                              onClick={handleMenu}
                           >
                              <MdAccountCircle />
                           </IconButton>
                           <Menu
                              id="menu-appbar"
                              anchorEl={anchorEl}
                              anchorOrigin={{
                                 vertical: "top",
                                 horizontal: "right",
                              }}
                              keepMounted
                              transformOrigin={{
                                 vertical: "top",
                                 horizontal: "right",
                              }}
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
                           >
                              <MenuItem onClick={handleClose}>Profile</MenuItem>
                              <MenuItem onClick={handleClose}>My account</MenuItem>
                           </Menu>
                        </div>
                     )
                  }
               </Toolbar>
            </AppBar>
         </Box>
      </header>
   );
};

export default Header;
