import { useState } from "react";
import type React from "react";
import { styled, AppBar, Box, Button, FormGroup, IconButton, Menu, MenuItem, Toolbar, Typography, useTheme, useMediaQuery, Container } from "@mui/material";
import { MdAccountCircle } from 'react-icons/md';
import { IoIosMenu, IoMdMoon, IoMdThermometer } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectIsDarkMode, toggleDarkMode } from "../../features/settings/settingsSlice";
import { RiSunFill } from "react-icons/ri";
import { BsMoonStarsFill } from "react-icons/bs";
import { Link, NavLink } from "react-router-dom";
import asteroidImg from '../../assets/images/asteroid/asteroid-icon.svg';
import { HeaderNavLink } from "./Header.styles";


const navLinksData = [
   {
      title: 'Posts',
      href: '/posts',
   },
   {
      title: 'Users',
      href: '/users',
   },
   {
      title: 'Test',
      href: '/test',
   },
   {
      title: 'NotFound',
      href: '/not-found',
   },
   {
      title: 'Login',
      href: '/login',
   },
];






const Header = () => {

   const [auth, setAuth] = useState(true);
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

   // MUI
   const theme = useTheme();
   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));


   // Redux
   const dispatch = useAppDispatch();
   const isDarkMode = useAppSelector(selectIsDarkMode);


   const handleToggleDarkMode = () => {
      dispatch(
         toggleDarkMode()
      );
   }
   
   const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   return (
      <Box component="header" position="fixed" sx={{ inset: '0 0 auto 0' }}>
         <Box component="nav" sx={{ flexGrow: 1 }}>
            <AppBar elevation={0} enableColorOnDark position="static" sx={{ background: (theme.palette.mode === 'dark') ? '#111111aa' : '#eeeeeeaa', backdropFilter: 'blur(15px)', borderBottom: '1px solid transparent' }}>
               <Container
                  maxWidth="xl"
               >
               <Toolbar >
                  <Box sx={{ marginInlineEnd: '.75rem' }} >
                     <Link to="/" >
                        <img src={asteroidImg} alt="asteroid home" style={{ display: 'inline-block', width: '40px', height: '40px' }} />
                     </Link>
                  </Box>
                  {
                     (!isMdUp) && (
                        <IconButton
                           size="large"
                           edge="start"
                           color="inherit"
                           aria-label="menu"
                           sx={{ mr: 2 }}
                        >
                           <IoIosMenu />
                        </IconButton>
                     )
                  }
                  <Box sx={{ flexGrow: 1 }}>
                     {
                        navLinksData.map(navData => (
                           <HeaderNavLink key={navData.title} >
                              <NavLink to={navData.href} >
                                 { navData.title }
                              </NavLink>
                           </HeaderNavLink>
                        ))
                     }
                  </Box>
                  <IconButton
                     onClick={handleToggleDarkMode}
                     size="medium"
                     aria-label="toggle dark theme"
                     sx={{ mr: 1, color: 'text.disabled' }}
                  >
                     {
                        (isDarkMode) ? (
                           <RiSunFill />
                        ) : (
                           <BsMoonStarsFill />
                        )
                     }
                  </IconButton>
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
               </Container>
            </AppBar>
         </Box>
      </Box>
   );
};

export default Header;
