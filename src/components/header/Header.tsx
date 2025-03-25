import { useState } from "react";
import type React from "react";
import {
   styled,
   AppBar,
   Box,
   Button,
   FormGroup,
   IconButton,
   Menu,
   MenuItem,
   Toolbar,
   Typography,
   useTheme,
   useMediaQuery,
   Container,
   Drawer,
   List,
   ListItem,
   ListItemButton,
   ListItemIcon,
   Divider,
   ListItemText,
} from "@mui/material";
import { MdAccountCircle } from "react-icons/md";
import { IoIosMenu, IoMdMoon, IoMdThermometer } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
   selectIsDarkMode,
   toggleDarkMode,
} from "../../features/settings/settingsSlice";
import { RiSunFill } from "react-icons/ri";
import { BsMoonStarsFill } from "react-icons/bs";
import { Link, NavLink, useNavigate } from "react-router-dom";
import asteroidImg from "../../assets/images/asteroid/asteroid-icon.svg";
import { HeaderNavLink } from "./Header.styles";
import { FaInbox } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

const navLinksData = [
   {
      title: "Posts",
      href: "/posts",
   },
   {
      title: "Users",
      href: "/users",
   },
   {
      title: "NotFound",
      href: "/not-found",
   },
   {
      title: "Login",
      href: "/login",
   },
   {
      title: "Test",
      href: "/test",
   },
   {
      title: "ErrorTest",
      href: "/error-test",
   },
];

const Header = () => {
   // states
   const [auth, setAuth] = useState(true);
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

   // MUI
   const theme = useTheme();
   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

   // rrd
   const navigate = useNavigate();

   // Redux
   const dispatch = useAppDispatch();
   const isDarkMode = useAppSelector(selectIsDarkMode);

   const handleToggleDarkMode = () => {
      dispatch(toggleDarkMode());
   };

   const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const toggleDrawer = (newOpen: boolean) => {
      setIsDrawerOpen(newOpen);
   };

   return (
      <Box component="header" position="fixed" sx={{ inset: "0 0 auto 0", zIndex: 100, }}>
         <Box component="nav" sx={{ flexGrow: 1 }}>
            <AppBar
               elevation={0}
               enableColorOnDark
               position="static"
               sx={{

                  background:
                     theme.palette.mode === "dark" ? "#111111aa" : "#eeeeeeaa",
                  backdropFilter: "blur(15px)",
                  borderBottom: "1px solid transparent",
               }}
            >
               <Container maxWidth="xl">
                  <Toolbar>
                     <Box sx={{ marginInlineEnd: ".75rem" }}>
                        <Link to="/">
                           <img
                              src={asteroidImg}
                              alt="asteroid home"
                              style={{
                                 display: "inline-block",
                                 width: "40px",
                                 height: "40px",
                              }}
                           />
                        </Link>
                     </Box>
                     <Box sx={{ flexGrow: 1 }}>
                        {!isMdUp ? (
                           <>
                              <IconButton
                                 size="large"
                                 edge="start"
                                 color="inherit"
                                 aria-label="menu"
                                 sx={{ mr: 2 }}
                                 onClick={() => toggleDrawer(true)}
                              >
                                 <IoIosMenu />
                              </IconButton>
                              <Drawer
                                 elevation={1}
                                 open={isDrawerOpen}
                                 onClose={() => toggleDrawer(false)}
                              >
                                 <Box
                                    sx={{ width: 250 }}
                                    role="presentation"
                                    onClick={() => toggleDrawer(false)}
                                 >
                                    <List>
                                       {navLinksData.map((navData) => (
                                          <>
                                             <ListItem
                                                key={navData.title}
                                                disablePadding
                                                onClick={() => navigate(navData.href)}
                                             >
                                                <ListItemButton>
                                                   <ListItemIcon>
                                                      <FaInbox />
                                                   </ListItemIcon>
                                                   <ListItemText
                                                      primary={navData.title}
                                                   />
                                                </ListItemButton>
                                             </ListItem>
                                          </>
                                       ))}
                                    </List>
                                 </Box>
                              </Drawer>
                           </>
                        ) : (
                           navLinksData.map((navData) => (
                              <HeaderNavLink key={navData.title}>
                                 <NavLink end to={navData.href}>
                                    {navData.title}
                                 </NavLink>
                              </HeaderNavLink>
                           ))
                        )}
                     </Box>
                     <IconButton
                        onClick={handleToggleDarkMode}
                        size="medium"
                        aria-label="toggle dark theme"
                        sx={{ mr: 1, color: "text.secondary" }}
                     >
                        {isDarkMode ? <RiSunFill /> : <BsMoonStarsFill />}
                     </IconButton>
                     {auth && (
                        <div>
                           <IconButton
                              size="large"
                              aria-label="account of current user"
                              aria-controls="menu-appbar"
                              aria-haspopup="true"
                              onClick={handleMenu}
                              sx={{
                                 color: "text.secondary",
                              }}
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
                              <MenuItem onClick={handleClose}>
                                 My account
                              </MenuItem>
                           </Menu>
                        </div>
                     )}
                  </Toolbar>
               </Container>
            </AppBar>
         </Box>
      </Box>
   );
};

export default Header;
