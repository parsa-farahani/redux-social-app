import { Box, IconButton, Menu, MenuItem, Stack, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { MdDelete, MdModeEditOutline, MdMoreVert } from "react-icons/md";
import Spinner from "../../loading/spinner/Spinner";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";


interface PostActionsProps {
   isEditMode: boolean;
   isAuthUserPost: boolean;
   isPendingEditPost: boolean;
   onToggleEditMode: (newIsEditMode?: boolean) => void;
   onCancelEditPost: () => void;
   onOpenDeletionModal: () => void;
   optionsMenuAnchorEl: null | HTMLElement;
   handleOptionsMenu: (event: React.MouseEvent<HTMLElement>) => void;
   handleCloseOptionsMenu: () => void;
}


const PostActions = ( { isEditMode, isAuthUserPost, isPendingEditPost, onToggleEditMode, onCancelEditPost, onOpenDeletionModal, optionsMenuAnchorEl, handleOptionsMenu, handleCloseOptionsMenu }: PostActionsProps ) => {

   // MUI
   const theme = useTheme();
   const isMdUp = useMediaQuery(theme.breakpoints.up('md'));


   return (
      <Box flexShrink={0}>
         {isMdUp && isAuthUserPost ? (
            <Stack direction="row" spacing={1}>
               {!isEditMode ? (
                  <React.Fragment key="1">
                     <Tooltip title="Edit">
                        <IconButton
                           size="medium"
                           onClick={() => onToggleEditMode(true)}
                           sx={{ color: "text.secondary" }}
                        >
                           <MdModeEditOutline />
                        </IconButton>
                     </Tooltip>
                     <Tooltip title="Delete">
                        <IconButton
                           size="medium"
                           onClick={onOpenDeletionModal}
                           sx={{ color: "text.secondary" }}
                        >
                           <MdDelete />
                        </IconButton>
                     </Tooltip>
                  </React.Fragment>
               ) : (
                  <React.Fragment key="2">
                     <Tooltip title="Save">
                        <IconButton
                           form="edit-post-form"
                           type="submit"
                           size="medium"
                           disabled={isPendingEditPost}
                           sx={{
                              color: "text.secondary",
                              ".MuiButtonBase-root": {
                                 aspectRatio: "1 / 1",
                                 flexShrink: "0",
                              },
                           }}
                        >
                           {isPendingEditPost ? (
                              <Spinner size="24px" />
                           ) : (
                              <IoMdCheckmark />
                           )}
                        </IconButton>
                     </Tooltip>
                     <Tooltip title="Cancel">
                        <IconButton
                           size="medium"
                           onClick={onCancelEditPost}
                           disabled={isPendingEditPost}
                           sx={{ color: "text.secondary" }}
                        >
                           <IoMdClose />
                        </IconButton>
                     </Tooltip>
                  </React.Fragment>
               )}
            </Stack>
         ) : isAuthUserPost ? (
            <Box>
               {!isEditMode ? (
                  <>
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
                           onClick={() => onToggleEditMode(true)}
                           sx={{ display: "flex" }}
                        >
                           <Typography
                              sx={{
                                 marginRight: ".75rem",
                                 flexGrow: 1,
                              }}
                           >
                              Edit
                           </Typography>
                           <MdModeEditOutline />
                        </MenuItem>
                        <MenuItem onClick={onOpenDeletionModal}>
                           <Typography
                              sx={{
                                 marginRight: ".75rem",
                                 flexGrow: 1,
                              }}
                           >
                              Delete
                           </Typography>
                           <MdDelete />
                        </MenuItem>
                     </Menu>
                  </>
               ) : (
                  <>
                     <Tooltip title="Save">
                        <IconButton
                           form="edit-post-form"
                           type="submit"
                           size="medium"
                           sx={{ color: "text.secondary" }}
                        >
                           <IoMdCheckmark />
                        </IconButton>
                     </Tooltip>
                     <Tooltip title="Cancel">
                        <IconButton
                           size="medium"
                           onClick={onCancelEditPost}
                           sx={{ color: "text.secondary" }}
                        >
                           <IoMdClose />
                        </IconButton>
                     </Tooltip>
                  </>
               )}
            </Box>
         ) : null}
      </Box>
   );
}
 
export default PostActions;