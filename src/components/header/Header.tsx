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
   Tooltip,
} from "@mui/material";
import { MdAccountCircle, MdArticle, MdDangerous, MdLogin, MdLogout } from "react-icons/md";
import { IoIosMenu, IoMdMoon, IoMdThermometer } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
   selectIsDarkMode,
   toggleDarkMode,
} from "../../features/settings/settingsSlice";
import { RiSunFill } from "react-icons/ri";
import { BsGear, BsMoonStarsFill } from "react-icons/bs";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { HeaderNavLink } from "./Header.styles";
import { FaInbox } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { logout, selectAuthUsername } from "../../features/auth/authSlice";
import { selectUserById } from "../../features/users/usersSlice";
import { toast } from "react-toastify";
import { BiError, BiLogIn, BiUser } from "react-icons/bi";
import HeaderLogoLink from "./HeaderLogoLink";

const navLinksData = [
   {
      title: "Posts",
      href: "/posts",
      icon: <MdArticle/>,
   },
   {
      title: "Users",
      href: "/users",
      icon: <BiUser/>,
   },
   {
      title: "Login",
      href: "/login",
      icon: <BiLogIn/>,
   },
   {
      title: "NotFound",
      href: "/not-found",
      icon: <MdDangerous />,
   },
   {
      title: "ErrorTest",
      href: "/error-test",
      icon: <BiError />,
   },
];


const Header = () => {
   // states
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

   // MUI
   const theme = useTheme();
   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

   // rrd
   const location = useLocation();
   const navigate = useNavigate();

   // Redux
   const dispatch = useAppDispatch();
   const isDarkMode = useAppSelector(selectIsDarkMode);
   const authUsername = useAppSelector(selectAuthUsername);
   // const user = useAppSelector(state => selectUserById(state, authUsername));

   
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


   const navigateToLogin = () => {
      navigate('/login');
   }

   const handleGoToMyPosts = () => {
      handleClose();
      navigate(`/users/${authUsername}`);
   }

   const handleLogout = async () => {
      handleClose();

      try {
         await dispatch(logout());
         // show notification...
         toast.info('You have logged out successfully')
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <Box
         component="header"
         position="fixed"
         sx={{ inset: "0 0 auto 0", zIndex: 100 }}
      >
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
                  <Toolbar disableGutters>
                     <HeaderLogoLink isMdUp={isMdUp} />
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
                                          <ListItem
                                             key={navData.title}
                                             disablePadding
                                             onClick={() =>
                                                navigate(navData.href)
                                             }
                                          >
                                             <ListItemButton>
                                                <ListItemIcon>
                                                   {
                                                      navData.icon
                                                   }
                                                </ListItemIcon>
                                                <ListItemText
                                                   primary={navData.title}
                                                />
                                             </ListItemButton>
                                          </ListItem>
                                       ))}
                                    </List>
                                 </Box>
                              </Drawer>
                           </>
                        ) : (
                           navLinksData.map((navData) => {

                              if (navData.href === '/login') {
                                 if (authUsername) {
                                    return null;
                                 }
                              }

                              return (
                                 <HeaderNavLink key={navData.title}>
                                    <NavLink end to={navData.href}>
                                       {navData.title}
                                    </NavLink>
                                 </HeaderNavLink>
                              )
                           })
                        )}
                     </Box>
                     <Tooltip title="Change theme" >
                        <IconButton
                           onClick={handleToggleDarkMode}
                           size="medium"
                           aria-label="toggle dark theme"
                           sx={{ mr: 1, color: "text.secondary" }}
                        >
                           {isDarkMode ? <RiSunFill /> : <BsMoonStarsFill />}
                        </IconButton>
                     </Tooltip>
                     {authUsername ? (
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
                              elevation={2}
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
                              <MenuItem sx={{ cursor: 'default', '&:hover': {background:'none !important', filter: 'none'} }} disableRipple >
                                 username: {" "}
                                 { authUsername }
                              </MenuItem>
                              <MenuItem onClick={handleGoToMyPosts}>
                                 My Posts
                              </MenuItem>
                              <MenuItem onClick={handleLogout}>Logout</MenuItem>
                           </Menu>
                        </div>
                     ) : (location.pathname !== '/login') ? (
                        <Tooltip title="login" >
                           <IconButton
                              size="medium"
                              aria-label="logout"
                              aria-haspopup="true"
                              onClick={navigateToLogin}
                              sx={{
                                 color: "text.secondary",
                              }}
                           >
                              <MdLogin />
                           </IconButton>
                        </Tooltip>
                     ) : null
                     }
                  </Toolbar>
               </Container>
            </AppBar>
         </Box>
      </Box>
   );
};

export default Header;
