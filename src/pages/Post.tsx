import { useNavigate, useParams } from "react-router-dom";
import {
   Box,
   Divider,
   Skeleton,
   Stack,
   Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import { postReactions } from "../constants/postReactions";
import MainPageLayout from "../layouts/MainPageLayout";
import {
   useDeletePostMutation,
   useEditPostMutation,
   useGetPostQuery,
   useUpdatePostReactionMutation,
} from "../features/posts/postsSlice";
import { useAppSelector } from "../app/hooks";
import Spinner from "../components/loading/spinner/Spinner";
import ErrorMsg from "../components/common/error/ErrorMsg";
import { PostReactionButtonGroup } from "../components/post/PostExcerpt.styles";
import PostReactionButton from "../components/post/PostReactionButton";
import { selectAuthUsername } from "../features/auth/authSlice";
import { useFormik } from "formik";
import { addPostSchema } from "../validations/addPostValidation";
import { toast } from "react-toastify";
import PostComments from "../components/pages/Post/PostComments";
import PostAuthorBar from "../components/pages/Post/PostAuthorBar";
import { EditPostContentTextField, EditPostTitleTextField } from "./Post.styles";
import PostDeletionModal from "../components/pages/Post/PostDeletionModal";
import PostActions from "../components/pages/Post/PostActions";
import { useGetUserQuery, useUpdateUserReactionMutation } from "../api/apiSlice";
import { getErrorMessage } from "../utils/error/errorUtils";
import { skipToken } from "@reduxjs/toolkit/query";



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
   const [isEditMode, setIsEditMode] = useState(false);
   const [isOpenDeletionModal, setIsOpenDeletionModal] = useState(false);

   // redux
   const {
      data: post,
      isFetching: isPendingFetchPost,
      isSuccess: isSuccessFetchPost,
      isError: isFailedFetchPost,
      error: postFetchError,
   } = useGetPostQuery(postId!);


   const [
      editPost,
      {
         isLoading: isPendingEditPost,
         isSuccess: isSuccessEditPost,
         isError: isFailedEditPost,
         error: postEditError,
      }
   ] = useEditPostMutation();

   const [
      deletePost,
      {
         isLoading: isPendingDeletePost,
         isSuccess: isSuccessDeletePost,
         isError: isFailedDeletePost,
         error: postDeleteError,
      }
   ] = useDeletePostMutation();


   const authUsername = useAppSelector(selectAuthUsername);
   const {
      data: authUser,
   } = useGetUserQuery(authUsername ?? skipToken, {
      skip: !authUsername
   })


   const [
      updateUserReaction,
   ] = useUpdateUserReactionMutation();

   const [
      updatePostReaction,
   ] = useUpdatePostReactionMutation();
   

   const isAuth = Boolean(authUser?.id) && (authUser != null);
   const isAuthUserPost = (post?.userId === authUsername);
   const authUserReaction = authUser?.reactions[postId!];


  // + reactions
  const handleRemoveReaction = async (reactionName: string) => {
      if (!isAuth) {
         // If user hasn't logged in yet, we'll send him/her to '/login' page
         navigate("/login");
         return;
      }

      if (!authUser.reactions[postId!] || !post) return;  // already there is no such reacction, so there is nothing to remove!


      
      try {

         const newUserReactions = {
            ...authUser.reactions,
         };
         delete newUserReactions[postId!];

         await updateUserReaction(
            {
               id: authUser.id,
               reactions: newUserReactions,
            }
         ).unwrap();


         const newPostReactions = {  
            ...post.reactions,
            [reactionName]: post.reactions[reactionName] - 1,
         };

         await updatePostReaction(
            {
               id: postId!,
               reactions: newPostReactions,
            }
         ).unwrap();

      } catch (error) {
         console.error(error);

         let errorMessage = "Failed to add reaction";
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
   }

   const handleAddReaction = async (reactionName: string) => {  // We can also use 'extraReducers' to handle actions of other slices in a slice to write such logic, but I kept the logic here for now (because I need to control the order of requests), and maybe I move some of these logics to the 'extraReducers' of a slice!
      if (!isAuth) {
         // If user hasn't logged in yet, we'll send him/her to '/login' page
         navigate("/login");
         return;
      }

      const authUserReaction = authUser.reactions[postId!];


      if ( authUserReaction === reactionName ) {  // Avoiding reactions more than 'once' (just 1 like/dislike per user)
         handleRemoveReaction(reactionName);
         return;
      }

      if (!post) return;



      // a draft from 'current user-reactions' to be updated
      const newUserReactions = {
         ...authUser.reactions,
      };
      
      // a draft from 'current post-reactions' to be updated
      const newPostReactions = {
         ...post.reactions,
      };


      const isOppositeReaction = (
         (authUserReaction === 'like' && reactionName === 'dislike')
         || (authUserReaction === 'dislike' && reactionName === 'like')
      );
      
      
      if (  // If user has changed his/her reaction from like <-> dislike, we should first 'remove' the opposite reaction
         isOppositeReaction   
      ) {
         const oppositeReactionName = (reactionName === 'like') ? 'dislike' : 'like';


         try {
            
            // delete newUserReactions[postId];
            newUserReactions[postId!] = reactionName;
            await updateUserReaction(
               {
                  id: authUser.id,
                  reactions: newUserReactions,
               }
            ).unwrap();


            newPostReactions[oppositeReactionName] -= 1;
            newPostReactions[reactionName] += 1;
            await updatePostReaction(
               {
                  id: postId!,
                  reactions: newPostReactions,
               }
            ).unwrap();

         } catch (error) {
            console.error(error);

            let errorMessage = "Failed to add reaction";
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
      } else {

         try {

            newUserReactions[postId!] = reactionName;
            await updateUserReaction(
               {
                  id: authUser.id,
                  reactions: newUserReactions,
               }
            ).unwrap();


            
            newPostReactions[reactionName] += 1;
            await updatePostReaction(
               {
                  id: postId!,
                  reactions: newPostReactions,
               }
            ).unwrap();

         } catch (error) {
            console.error(error);

            let errorMessage = "Failed to add reaction";
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
      }
   };

   // edit
   const formik = useFormik({
      enableReinitialize: true,
      initialValues: {
         title: post?.title ?? '',
         content: post?.content ?? '',
      },
      validationSchema: addPostSchema,
      onSubmit: (values) => {
         if (!values || values.title == null || values.content == null ) return;
         handleSubmitEditPost(values as { title: string; content: string });
      },
   });


   const handleSubmitEditPost = async (formikValues: {
      title: string;
      content: string;
   }) => {
      if (!post || !formikValues.title || !formikValues.content) return;

      try {
         await editPost({
            id: postId!,
            title: formikValues.title,
            content: formikValues.content,
            userId: post.userId,
            reactions: {
               ...post.reactions,
            },
            date: post.date,
         }).unwrap();

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
      if (!post) return;

      formik.values.title = post.title;
      formik.values.content = post.content;
      toggleEditMode();
      handleCloseOptionsMenu();
   }, [formik?.values, post, toggleEditMode, handleCloseOptionsMenu]);



   // delete
   const handleSubmitDeletePost = async () => {
      try {
         await deletePost(postId!).unwrap();

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

  

   // Disabling the 'editMode' when we leave this page
   useEffect(() => {
      return () => {
         toggleEditMode(false);
      };
   }, [toggleEditMode]);


   let postsContent;
   if (!isPendingFetchPost && !post) {
      postsContent = <ErrorMsg text="404 - Not Found the Post" />;
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
            { /* this form works with formik to handle edit-post behavior */ }
            <form
               id="edit-post-form"
               noValidate
               onSubmit={formik.handleSubmit}
               style={{ display: "hidden" }}
            ></form>
            {
               (post?.userId) ? (
                  <PostAuthorBar userId={post.userId} postDate={post.date} />
               ) : (
                  <Skeleton variant="rounded" sx={{ height: '50px' }} />
               )
            }
            <Box sx={{ minHeight: "60vh", padding: 1, marginBottom: "3rem" }}>
               <Stack direction="row" alignItems="center">
                  {(isEditMode && post?.title) ? (
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
                  ) : (
                     <Typography
                        variant="h4"
                        component="h1"
                        sx={{ flexGrow: "1" }}
                     >
                        {post.title}
                     </Typography>
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
                  {
                     (post?.title && post?.content) ? (
                        <PostActions isEditMode={isEditMode} isAuthUserPost={isAuthUserPost} isPendingEditPost={isPendingEditPost} onCancelEditPost={handleCancelEditPost} onToggleEditMode={toggleEditMode} onOpenDeletionModal={handleOpenDeletionModal} optionsMenuAnchorEl={optionsMenuAnchorEl} handleCloseOptionsMenu={handleCloseOptionsMenu} handleOptionsMenu={handleOptionsMenu}  />
                     ) : null
                  }
               </Stack>
               <Divider
                  sx={{ borderColor: "text.disabled", marginBlock: "1rem" }}
               />
               {(isEditMode && post?.content) ? (
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
               ) : (
                  <pre>
                     <Typography variant="body1" component="p">
                        {
                           post.content
                        }
                     </Typography>
                  </pre>
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
         <ErrorMsg text={`Failed to load the post: ${getErrorMessage(postFetchError) ?? "Unknown Erorr"}`} />
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
