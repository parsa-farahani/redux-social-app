import { useNavigate, useParams } from "react-router-dom";
import {
   Box,
   Button,
   Divider,
   Stack,
   Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { postReactions } from "../constants/postReactions";
import MainPageLayout from "../layouts/MainPageLayout";
import {
   deletePost,
   editPost,
   fetchPost,
   fetchPostPending,
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
import { toast } from "react-toastify";
import PostComments from "../components/pages/Post/PostComments";
import PostAuthorBar from "../components/pages/Post/PostAuthorBar";
import { EditPostContentTextField, EditPostTitleTextField } from "./Post.styles";
import PostDeletionModal from "../components/pages/Post/PostDeletionModal";
import PostActions from "../components/pages/Post/PostActions";



const MemoizedPostActions = React.memo(PostActions);


const Post = () => {
   // MUI
   const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] =
      useState<null | HTMLElement>(null);

   const handleOptionsMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
      setOptionsMenuAnchorEl(event.currentTarget);
   }, []);

   const handleCloseOptionsMenu = useCallback(() => {
      setOptionsMenuAnchorEl(null);
   }, []);
   

   // rrd
   const navigate = useNavigate();
   const { postId } = useParams();

   // states
   // const [postFetchStatus, setPostFetchStatus] = useState("idle");
   // const [postFetchError, setPostFetchError] = useState<string | null>(null);
   const [isEditMode, setIsEditMode] = useState(false);

   const [isOpenDeletionModal, setIsOpenDeletionModal] = useState(false);

   // redux
   const dispatch = useAppDispatch();
   const post = useAppSelector((state) => selectPostById(state, postId!));
   const postAuthor = useAppSelector((state) =>
      selectUserById(state, post?.userId),
   );
   const { fetchPost: fetchPostStatus, editPost: postEditStatus, deletePost: postDeleteStatus } =
      useAppSelector(selectPostsStatus);

   const postFetchStatus = fetchPostStatus[postId!];

   const {
      fetchPost: fetchPostError,
      editPost: postEditError,
      deletePost: postDeleteError,
   } = useAppSelector(selectPostsError);

   const postFetchError = fetchPostError[postId!];

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

   const toggleEditMode = useCallback((newIsEditMode?: boolean) => {
      if (newIsEditMode != null) {
         setIsEditMode(newIsEditMode);
      } else {
         setIsEditMode((ie) => !ie);
      }
   }, []);


   const handleCancelEditPost = useCallback(() => {
      formik.values.title = post.title;
      formik.values.content = post.content;
      toggleEditMode();
      handleCloseOptionsMenu();
   }, [formik?.values, post?.title, post?.content, toggleEditMode, handleCloseOptionsMenu]);



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

   const handleOpenDeletionModal = useCallback(() => {
      setIsOpenDeletionModal(true);
   }, []);

   const handleCloseDeletionModal = () => {
      setIsOpenDeletionModal(false);
   };

   const refetchPost = () => {
      dispatch(
         fetchPostPending(postId!)
      );
   }

   useEffect(() => {
      if (postFetchStatus) return;
      let ignore = false;

      const fetchPostInEffect = async () => {
         try {
            await dispatch(
               fetchPostPending(postId!)
            );
         } catch (error) {
            console.error(error);


            let errorMessage = "Failed to Fetch post";
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
   }, [toggleEditMode]);


   let postsContent;
   if (isPendingFetchPost || isPendingDeletePost) {
      postsContent = (
         <Spinner
            text={isPendingFetchPost ? "Loading..." : "Deleting..."}
            variant="fixed"
         />
      );
   } else if (isSuccessFetchPost && post) {
      postsContent = (
         <>
            { /* this form works with formik to handle edit-post behavior */ }
            <form
               id="edit-post-form"
               noValidate
               onSubmit={formik.handleSubmit}
               style={{ display: "hidden" }}
            ></form>
            <PostAuthorBar user={postAuthor} postDate={post.date} />
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
                     <EditPostTitleTextField
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
                     />
                  )}
                  {!isEditMode && (
                     <PostReactionButtonGroup
                        variant="outlined"
                        sx={{ marginRight: "1rem" }}
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
                  
                  { /* post actions: edit, delete, ... */ }
                  <MemoizedPostActions isEditMode={isEditMode} isAuthUserPost={isAuthUserPost} isPendingEditPost={isPendingEditPost} onCancelEditPost={handleCancelEditPost} onToggleEditMode={toggleEditMode} onOpenDeletionModal={handleOpenDeletionModal} optionsMenuAnchorEl={optionsMenuAnchorEl} handleCloseOptionsMenu={handleCloseOptionsMenu} handleOptionsMenu={handleOptionsMenu}  />
               </Stack>
               <Divider
                  sx={{ borderColor: "text.disabled", marginBlock: "1rem" }}
               />
               {!isEditMode ? (
                  <pre>
                     <Typography variant="body1" component="p">
                        {
                           post.content
                        }
                     </Typography>
                  </pre>
               ) : (
                  <>
                     <EditPostContentTextField
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

                     />
                  </>
               )}
            </Box>
            {/* Deletion of the Post */}
            <PostDeletionModal isOpen={isOpenDeletionModal} onClose={handleCloseDeletionModal} onSubmit={handleSubmitDeletePost} />
            {/* Comments */}
            <Box component="section">
               <PostComments postId={postId!} />
            </Box>
         </>
      );
   } else if (isFailedFetchPost) {
      postsContent = (
         <Stack direction="column" spacing={1} >
            <Box >
               <ErrorMsg text={postFetchError?.toString() ?? "Unknown Erorr"} />
            </Box>
            <Button
               variant="contained"
               onClick={refetchPost}
               sx={{ width: 'fit-content', bgcolor: 'secondary.dark', borderRadius: '100vw' }}
            >
               Try Again
            </Button>
         </Stack>
      );
   } else {
      postsContent = <ErrorMsg text="404 - Not Fount the Post!" />;
   }

   return (
      <MainPageLayout>
         {
            postsContent
         }
      </MainPageLayout>
   );
};

export default Post;
