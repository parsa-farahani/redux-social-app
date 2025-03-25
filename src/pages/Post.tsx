import { Link, useNavigate } from "react-router-dom";
import {
   Alert,
   Avatar,
   Box,
   Button,
   ButtonGroup,
   Card,
   CardActionArea,
   CardActions,
   CardContent,
   CardHeader,
   Divider,
   IconButton,
   List,
   ListItem,
   Menu,
   MenuItem,
   Stack,
   Tooltip,
   Typography,
   useMediaQuery,
   useTheme,
} from "@mui/material";
import { lightBlue, pink, purple, red } from "@mui/material/colors";
import { FaUserLarge } from "react-icons/fa6";
import { MdMoreVert } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useRef, useState } from "react";
import type React from "react";
import { postReactions } from "../constants/postReactions";
import MainPageLayout from "../layouts/MainPageLayout";
import { BiCommentDetail, BiSolidCommentDetail } from "react-icons/bi";
import Comment from "../components/comment/Comment";

const post = {
   id: "1",
   title: "Post 1",
   content: "post 1 content lkdlan alsdlak",
   userId: "2",
   date: new Date().toISOString(),
   reactions: {
      like: 0,
      dislike: 0,
   },
};

const Post = () => {
   // MUI
   const theme = useTheme();
   const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
   const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] =
      useState<null | HTMLElement>(null);

   const handleOptionsMenu = (event: React.MouseEvent<HTMLElement>) => {
      setOptionsMenuAnchorEl(event.currentTarget);
   };

   const handleCloseOptionsMenu = () => {
      setOptionsMenuAnchorEl(null);
   };

   // rrd
   const navigate = useNavigate();

   return (
      <MainPageLayout>
         <Card elevation={0} sx={{ marginBottom: "1rem" }}>
            <CardActionArea onClick={() => navigate(`/users/${post.userId}`)}>
               <CardContent sx={{ padding: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                     <Avatar sx={{ bgcolor: pink[500], color: "#222" }}>
                        <FaUserLarge />
                     </Avatar>
                     <Box>
                        <Typography variant="body1" component="h2">
                           username
                        </Typography>
                        <Typography
                           variant="caption"
                           component="time"
                           dateTime={post.date}
                        >
                           {new Date(post.date).toLocaleString()}
                        </Typography>
                     </Box>
                  </Stack>
               </CardContent>
            </CardActionArea>
         </Card>
         <Box sx={{ padding: 1, marginBottom: "3rem" }}>
            <Stack direction="row">
               <Typography variant="h4" component="h1" sx={{ flexGrow: "1" }}>
                  {post.title}
               </Typography>
               <ButtonGroup
                  variant="outlined"
                  aria-label="Basic button group"
                  sx={{
                     marginRight: "1rem",
                     color: theme.palette.text.secondary,
                     "& > *": {
                        color: "inherit !important",
                        borderColor: "inherit !important",
                     },
                     "& *:first-of-type": {
                        borderRadius: "100vw 0 0 100vw !important",
                     },
                     "& *:last-of-type": {
                        borderRadius: "0 100vw 100vw 0 !important",
                     },
                  }}
               >
                  {Object.entries(postReactions).map(
                     ([reactionName, emoji]) => (
                        <Button
                           key={reactionName}
                           size="small"
                           sx={{
                              aspectRatio: 1 / 1,
                              flexShrink: 0,
                              flexGrow: 0,
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                           }}
                        >
                           <Typography
                              variant="h6"
                              component="span"
                              sx={{
                                 display: "inline-flex",
                                 alignItems: "center",
                              }}
                           >
                              {emoji.normal}
                           </Typography>
                        </Button>
                     ),
                  )}
               </ButtonGroup>
               <Box flexShrink={0}>
                  {isMdUp ? (
                     <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit">
                           <IconButton
                              size="medium"
                              sx={{ color: "text.secondary" }}
                           >
                              <MdModeEditOutline />
                           </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" >
                           <IconButton
                              size="medium"
                              sx={{ color: "text.secondary" }}
                           >
                              <MdDelete />
                           </IconButton>
                        </Tooltip>
                     </Stack>
                  ) : (
                     <Box>
                        <IconButton
                           size="medium"
                           aria-label="post options"
                           aria-controls="options-menu"
                           aria-haspopup="true"
                           onClick={handleOptionsMenu}
                        >
                           <MdMoreVert />
                        </IconButton>
                        <Menu
                           id="options-menu"
                           anchorEl={optionsMenuAnchorEl}
                           anchorOrigin={{
                              vertical: "top",
                              horizontal: "right",
                           }}
                           keepMounted
                           transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                           }}
                           open={Boolean(optionsMenuAnchorEl)}
                           onClose={handleCloseOptionsMenu}
                           elevation={2}
                        >
                           <MenuItem
                              onClick={handleCloseOptionsMenu}
                              sx={{ display: "flex" }}
                           >
                              <Typography
                                 sx={{ marginRight: ".75rem", flexGrow: 1 }}
                              >
                                 Edit
                              </Typography>
                              <MdModeEditOutline />
                           </MenuItem>
                           <MenuItem onClick={handleCloseOptionsMenu}>
                              <Typography
                                 sx={{ marginRight: ".75rem", flexGrow: 1 }}
                              >
                                 Delete
                              </Typography>
                              <MdDelete />
                           </MenuItem>
                        </Menu>
                     </Box>
                  )}
               </Box>
            </Stack>
            <Divider
               sx={{ borderColor: "text.disabled", marginBlock: "1rem" }}
            />
            <Typography variant="body1" component="p">
               {post.content}
            </Typography>
         </Box>
         <Card variant="elevation" elevation={1} sx={{ borderRadius: "1rem" }}>
            <CardContent sx={{ padding: "1.5rem" }}>
               <Typography variant="h5" component="h2">
                  Comments
               </Typography>
               <Divider
                  sx={{ borderColor: "text.disabled", marginBlock: "1rem" }}
               />
               <Stack direction="column" rowGap={2}>
                  <Comment />
                  <Comment />
               </Stack>
            </CardContent>
         </Card>
      </MainPageLayout>
   );
};

export default Post;
