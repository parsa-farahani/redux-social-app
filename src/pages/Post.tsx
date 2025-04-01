import { Link, useNavigate, useParams } from "react-router-dom";
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
   FormControl,
   IconButton,
   List,
   ListItem,
   Menu,
   MenuItem,
   Modal,
   Stack,
   TextField,
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
import { useEffect, useRef, useState } from "react";
import React from "react";
import { postReactions } from "../constants/postReactions";
import MainPageLayout from "../layouts/MainPageLayout";
import { BiCommentDetail, BiSolidCommentDetail } from "react-icons/bi";
import Comment from "../components/comment/PostComment";
import {
   deletePost,
   editPost,
   fetchPost,
   selectPostById,
   selectPostsError,
   selectPostsStatus,
} from "../features/posts/postsSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Spinner from "../components/loading/spinner/Spinner";
import ErrorMsg from "../components/common/error/ErrorMsg";
import { PostReactionButtonGroup } from "../components/post/PostExcerpt.styles";
import PostReactionButton from "../components/post/PostReactionButton";
import {
   addUserReaction,
   removeUserReaction,
   selectUserById,
   selectUserReactionByPostId,
} from "../features/users/usersSlice";
import { selectAuthUsername } from "../features/auth/authSlice";
import { useFormik } from "formik";
import { addPostSchema } from "../validations/addPostValidation";
import { FaCheck } from "react-icons/fa";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import PostComments from "../components/pages/Post/PostComments";

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
   const { postId } = useParams();

   // states
   const [postFetchStatus, setPostFetchStatus] = useState("idle");
   const [isEditMode, setIsEditMode] = useState(false);

   const [isOpenDeletionModal, setIsOpenDeletionModal] = useState(false);

   // redux
   const dispatch = useAppDispatch();
   const post = useAppSelector((state) => selectPostById(state, postId!));
   const postAuthor = useAppSelector((state) =>
      selectUserById(state, post?.userId),
   );
   const { editPost: postEditStatus, deletePost: postDeleteStatus } =
      useAppSelector(selectPostsStatus);
   const {
      fetchPost: postFetchError,
      editPost: postEditError,
      deletePost: postDeleteError,
   } = useAppSelector(selectPostsError);
   const authUsername = useAppSelector(selectAuthUsername);
   const authUserReaction =
      useAppSelector((state) =>
         selectUserReactionByPostId(state, authUsername, postId),
      ) ?? null;

   const isAuth = Boolean(authUsername) && authUsername != null;
   const isAuthUserPost = isAuth && authUsername === post?.userId;

   const isSuccessFetchPost = postFetchStatus === "succeed";
   const isPendingFetchPost = postFetchStatus === "pending";
   const isFailedFetchPost = postFetchStatus === "failed";

   const isSuccessEditPost = postEditStatus === "succeed";
   const isPendingEditPost = postEditStatus === "pending";
   const isFailedEditPost = postEditStatus === "failed";

   const isSuccessDeletePost = postDeleteStatus === "succeed";
   const isPendingDeletePost = postDeleteStatus === "pending";
   const isFailedDeletePost = postDeleteStatus === "failed";

   // reaction
   const handleRemoveReaction = async (reactionName: string) => {
      if (!isAuth) {
         // If user hasn't logged in yet, we'll send him/her to '/login' page
         navigate("/login");
         return;
      }

      try {
         await dispatch(
            removeUserReaction({
               userId: authUsername,
               postId: postId!,
               reactionName,
            }),
         );
      } catch (error) {
         console.error(error);
      }
   };

   const handleAddReaction = async (reactionName: string) => {
      // We can also use 'extraReducers' to handle actions of other slices in a slice to write such logic, but I kept the logic here for now (because I need to control the order of requests), and maybe I move some of these logics to the 'extraReducers' of a slice!
      if (!isAuth) {
         // If user hasn't logged in yet, we'll send him/her to '/login' page
         navigate("/login");
         return;
      }

      if (authUserReaction === reactionName) {
         // Avoiding reactions more than 'once' (just 1 like/dislike per user)
         handleRemoveReaction(reactionName);
         return;
      }

      const isOppositeReaction =
         (authUserReaction === "like" && reactionName === "dislike") ||
         (authUserReaction === "dislike" && reactionName === "like");

      if (
         // If user has changed his/her reaction from like <-> dislike, we should first 'remove' the opposite reaction
         isOppositeReaction
      ) {
         const oppositeReactionName =
            reactionName === "like" ? "dislike" : "like";

         try {
            await dispatch(
               removeUserReaction({
                  userId: authUsername,
                  postId: postId!,
                  reactionName: oppositeReactionName,
               }),
            );

            await dispatch(
               addUserReaction({
                  userId: authUsername,
                  postId: postId!,
                  reactionName,
               }),
            );
         } catch (error) {
            console.error(error);
         }
      } else {
         try {
            await dispatch(
               addUserReaction({
                  userId: authUsername,
                  postId: postId!,
                  reactionName,
               }),
            );
         } catch (error) {
            console.error(error);
         }
      }
   };

   // edit
   const formik = useFormik({
      initialValues: {
         title: post?.title ?? "",
         content: post?.content ?? "",
      },
      validationSchema: addPostSchema,
      onSubmit: (values) => {
         handleSubmitEditPost(values);
      },
   });

   const handleSubmitEditPost = async (formikValues: {
      title: string;
      content: string;
   }) => {
      try {
         await dispatch(
            editPost({
               id: postId!,
               title: formikValues.title,
               content: formikValues.content,
               userId: post.userId,
               reactions: {
                  ...post.reactions,
               },
               date: post.date,
            }),
         ).unwrap();

         toast.success("Saved successfully!");

         toggleEditMode();
      } catch (error) {
         console.error(error);

         let errorMessage = "Failed to edit post";
         if (error instanceof Error) {
            errorMessage = error.message;
         } else if (
            typeof error === "object" &&
            error !== null &&
            "message" in error
         ) {
            errorMessage = String(error.message);
         } else if (typeof error === "string") {
            errorMessage = error;
         }
         toast.error(errorMessage);
      }
   };

   const handleCancelEditPost = () => {
      formik.values.title = post.title;
      formik.values.content = post.content;
      toggleEditMode();
      handleCloseOptionsMenu();
   };

   const toggleEditMode = (newIsEditMode?: boolean) => {
      if (newIsEditMode != null) {
         setIsEditMode(newIsEditMode);
      } else {
         setIsEditMode((ie) => !ie);
      }
   };

   // delete
   const handleSubmitDeletePost = async () => {
      try {
         await dispatch(deletePost(postId!)).unwrap();

         toast.success("Deleted successfully!");

         navigate(`/posts`);
      } catch (error) {
         console.error(error);

         let errorMessage = "Failed to add post";
         if (error instanceof Error) {
            errorMessage = error.message;
         } else if (
            typeof error === "object" &&
            error !== null &&
            "message" in error
         ) {
            errorMessage = String(error.message);
         } else if (typeof error === "string") {
            errorMessage = error;
         }
         toast.error(errorMessage);
      }
   };

   const handleOpenDeletionModal = () => {
      setIsOpenDeletionModal(true);
   };

   const handleCloseDeletionModal = () => {
      setIsOpenDeletionModal(false);
   };

   useEffect(() => {
      if (postFetchStatus !== "idle") return;
      let ignore = false;

      const fetchPostInEffect = async () => {
         console.log("fetch single post");
         setPostFetchStatus("pending");
         try {
            await dispatch(fetchPost(postId!)).unwrap();
            setPostFetchStatus("succeed");
         } catch (error) {
            setPostFetchStatus("failed");
         }
      };

      if (!ignore) {
         fetchPostInEffect();
      }

      return () => {
         ignore = true;
      };
   }, [dispatch, postId, postFetchStatus]);

   // Disabling the 'editMode' when we leave this page
   useEffect(() => {
      return () => {
         toggleEditMode(false);
      };
   }, []);

   let postsContent;
   if (isSuccessDeletePost) {
      postsContent = <ErrorMsg text="This post is deleted..." />;
   } else if (isPendingFetchPost || isPendingDeletePost) {
      postsContent = (
         <Spinner
            text={isPendingFetchPost ? "Loading..." : "Deleting..."}
            variant="fixed"
         />
      );
   } else if (isSuccessFetchPost) {
      postsContent = (
         <>
            <form
               id="edit-post-form"
               noValidate
               onSubmit={formik.handleSubmit}
               style={{ display: "hidden" }}
            ></form>
            <Card elevation={0} sx={{ marginBottom: "1rem" }}>
               <CardActionArea
                  onClick={() => navigate(`/users/${post.userId}`)}
               >
                  <CardContent sx={{ padding: 1 }}>
                     <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: pink[500], color: "#222" }}>
                           <FaUserLarge />
                        </Avatar>
                        <Box>
                           <Typography variant="body1" component="h2">
                              {postAuthor?.name ?? "Unknown Author"}
                           </Typography>
                           <Typography
                              variant="caption"
                              component="time"
                              dateTime={post.date}
                              sx={{ color: "text.disabled" }}
                           >
                              {new Date(post.date).toLocaleString()}
                           </Typography>
                        </Box>
                     </Stack>
                  </CardContent>
               </CardActionArea>
            </Card>
            <Box sx={{ minHeight: "60vh", padding: 1, marginBottom: "3rem" }}>
               <Stack direction="row" alignItems="center">
                  {!isEditMode ? (
                     <Typography
                        variant="h4"
                        component="h1"
                        sx={{ flexGrow: "1" }}
                     >
                        {post.title}
                     </Typography>
                  ) : (
                     <TextField
                        type="text"
                        name="title"
                        value={formik.values?.title}
                        helperText={formik.touched.title && formik.errors.title}
                        error={Boolean(
                           formik.touched.title && formik.errors.title,
                        )}
                        onChange={formik.handleChange}
                        fullWidth
                        spellCheck={false}
                        variant="filled"
                        margin="normal"
                        // label="Title"
                        color="secondary"
                        slotProps={{
                           htmlInput: {
                              form: "edit-post-form",
                           },
                        }}
                        disabled={isPendingEditPost}
                        sx={{
                           marginBlock: 0,
                           marginRight: "1rem",
                           ".MuiInputBase-root": {
                              // background: 'none',
                              // padding: 0,
                              fontSize: theme.typography.h4.fontSize,
                              borderRadius: ".5rem",
                              overflow: "clip",
                              "&::before": {
                                 border: 0,
                                 "&:hover": {
                                    border: 0,
                                 },
                              },
                           },
                           ".MuiInputBase-input": {
                              padding: 0,
                              paddingInline: 1,
                              fontWeight: "700",
                           },
                        }}
                     />
                  )}
                  {!isEditMode && (
                     <PostReactionButtonGroup
                        variant="outlined"
                        sx={{ marginRight: "1rem", height: "40px" }}
                     >
                        {Object.entries(postReactions).map(
                           ([reactionName, emoji]) => (
                              <PostReactionButton
                                 key={reactionName}
                                 onAddReaction={(
                                    e: React.MouseEvent<HTMLElement>,
                                 ) => handleAddReaction(reactionName)}
                                 content={
                                    isAuth && authUserReaction === reactionName
                                       ? emoji.active
                                       : emoji.normal
                                 }
                                 amount={post.reactions[reactionName]}
                              />
                           ),
                        )}
                     </PostReactionButtonGroup>
                  )}
                  <Box flexShrink={0}>
                     {isMdUp && isAuthUserPost ? (
                        <Stack direction="row" spacing={1}>
                           {!isEditMode ? (
                              <React.Fragment key="1">
                                 <Tooltip title="Edit">
                                    <IconButton
                                       size="medium"
                                       onClick={() => toggleEditMode(true)}
                                       sx={{ color: "text.secondary" }}
                                    >
                                       <MdModeEditOutline />
                                    </IconButton>
                                 </Tooltip>
                                 <Tooltip title="Delete">
                                    <IconButton
                                       size="medium"
                                       onClick={handleOpenDeletionModal}
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
                                       onClick={handleCancelEditPost}
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
                                       onClick={() => toggleEditMode(true)}
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
                                    <MenuItem onClick={handleOpenDeletionModal}>
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
                                       onClick={handleCancelEditPost}
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
               </Stack>
               <Divider
                  sx={{ borderColor: "text.disabled", marginBlock: "1rem" }}
               />
               {!isEditMode ? (
                  <Typography variant="body1" component="p">
                     {post.content}
                  </Typography>
               ) : (
                  <>
                     <TextField
                        type="text"
                        name="content"
                        value={formik.values?.content}
                        helperText={
                           formik.touched.content && formik.errors.content
                        }
                        error={Boolean(
                           formik.touched.content && formik.errors.content,
                        )}
                        onChange={formik.handleChange}
                        fullWidth
                        spellCheck={false}
                        variant="filled"
                        margin="normal"
                        // label="Content"
                        color="secondary"
                        multiline
                        slotProps={{
                           htmlInput: {
                              form: "edit-post-form",
                           },
                        }}
                        disabled={isPendingEditPost}
                        sx={{
                           marginBlock: 0,
                           marginRight: "1rem",
                           ".MuiInputBase-root": {
                              padding: 0,
                              // background: 'none',
                              fontSize: theme.typography.body1.fontSize,
                              borderRadius: ".5rem",
                              overflow: "clip",
                           },
                           ".MuiInputBase-input": {
                              padding: 1,
                              // paddingInline: 1,
                           },
                        }}
                     />
                  </>
               )}
               {/* Deletion of the Post */}
               <Modal
                  open={isOpenDeletionModal}
                  onClose={handleCloseDeletionModal}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
               >
                  <Box
                     sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "95vw",
                        maxWidth: "400px",
                        p: 4,
                        paddingTop: "3rem",
                        bgcolor: "background.paper",
                        borderRadius: ".5rem",
                        border: "2px solid #000",
                        boxShadow: 24,
                     }}
                  >
                     <IconButton
                        onClick={handleCloseDeletionModal}
                        size="small"
                        sx={{
                           position: "absolute",
                           right: "1rem",
                           top: "1rem",
                        }}
                     >
                        <IoMdClose />
                     </IconButton>
                     <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ marginBottom: "2rem" }}
                     >
                        Are you sure to delete this post? 🤔
                     </Typography>
                     <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}
                     >
                        <Button
                           variant="outlined"
                           onClick={handleCloseDeletionModal}
                           color="secondary"
                           sx={{ flex: 1, borderRadius: "100vw" }}
                        >
                           No
                        </Button>
                        <Button
                           variant="outlined"
                           onClick={handleSubmitDeletePost}
                           color="secondary"
                           sx={{ flex: 1, borderRadius: "100vw" }}
                        >
                           Yes
                        </Button>
                     </Stack>
                  </Box>
               </Modal>
            </Box>
            {/* Comments */}
            <Box component="section">
               <PostComments postId={postId!} />
            </Box>
         </>
      );
   } else if (isFailedFetchPost) {
      postsContent = (
         <ErrorMsg text={postFetchError?.toString() ?? "Unknown Erorr"} />
      );
   } else {
      postsContent = <ErrorMsg text="404 - Not Fount the Post!" />;
   }

   return <MainPageLayout>{postsContent}</MainPageLayout>;
};

export default Post;
