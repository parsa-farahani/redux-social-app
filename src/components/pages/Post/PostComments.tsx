import { Box, Button, Card, CardContent, Divider, Stack, TextField, Typography } from "@mui/material";
import PostComment from "../../comment/PostComment";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useFormik } from "formik";
import { selectAuthUsername } from "../../../features/auth/authSlice";
import { addComment, fetchComments, selectAllComments, selectCommentsError, selectCommentsStatus, selectPostCommentsByPostId } from "../../../features/comments/commentsSlice";
import { useEffect } from "react";
import { addCommentSchema } from "../../../validations/addCommentValidation";
import { nanoid } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import Spinner from "../../loading/spinner/Spinner";
import ErrorMsg from "../../common/error/ErrorMsg";



interface PostCommentsProps {
   postId: string;
}


const PostComments = ( { postId }: PostCommentsProps ) => {

   // formik
   const formik = useFormik({
      initialValues: {
         content: "",
      },
      validationSchema: addCommentSchema,
      onSubmit: (values) => {
         handleSubmitComment(values);
      }
   })


   // redux
   const dispatch = useAppDispatch();
   const authUsername = useAppSelector(selectAuthUsername);
   const comments = useAppSelector(state => selectPostCommentsByPostId(state, postId));
   const { fetchComments: commentsFetchStatus, addComment: commentsAddStatus } = useAppSelector(selectCommentsStatus)
   const { fetchComments: commentsFetchError, addComment: commentsAddError } = useAppSelector(selectCommentsError)


   const isAuth = (authUsername != null) && (authUsername !== "");


   const isPendingFetchComments = commentsFetchStatus === 'pending';
   const isSuccessFetchComments = commentsFetchStatus === 'succeed';
   const isErrorFetchComments = commentsFetchStatus === 'failed';

   const isPendingAddComment = commentsAddStatus === 'pending';
   const isSuccessAddComment = commentsAddStatus === 'succeed';
   const isErrorAddComment = commentsAddStatus === 'failed';



   const handleSubmitComment = async (formikValues: { content: string }) => {
      
      if (!isAuth) {
         toast.info('Please login to submit your comment');
         return;
      }
      console.log('submit comment: ' + formikValues.content);
      
      try {
         await dispatch(
            addComment(
               {
                  id: nanoid(),
                  content: formikValues.content,
                  postId,
                  userId: authUsername!,
                  date: new Date().toISOString(),
               }
            )
         ).unwrap();
         formik.values.content = "";
         toast.success('The comment is submitted Successfully!');
      } catch (error) {
         console.error(error);

         let errorMessage = "Failed to add comment";
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


   // because we dont have any backend now, I have to fetch all of comments here
   useEffect(() => {
      if (commentsFetchStatus !== 'idle') return;
      let ignore = false;

      if (!ignore) {
         dispatch(
            fetchComments()
         )
      }

      return () => {
         ignore = true;
      }
   }, [dispatch, commentsFetchStatus])


   let commentsContent;
   if (isPendingFetchComments) {
      commentsContent = (
         <Spinner text="loading comments..." variant="block" />
      )
   } else if (isSuccessFetchComments) {
      commentsContent = (
         commentsContent = comments.map((comment) => (
            <PostComment key={comment.id} comment={comment} />
         ))
      )
   } else if (isErrorFetchComments) {
      commentsContent = (
         <ErrorMsg text="Failed to load comments." />
      )
   } else {
      commentsContent = null;
   }


   return (
      <Card
         variant="elevation"
         elevation={1}
         sx={{ borderRadius: "1rem" }}
      >
         <CardContent sx={{ padding: "1.5rem" }}>
            <Typography variant="h5" component="h2">
               Comments
            </Typography>
            <Divider
               sx={{ borderColor: "text.disabled", marginBlock: "1rem", marginBottom: '3rem' }}
            />

            <form onSubmit={formik.handleSubmit} >
               <TextField

                  name="content"
                  value={formik.values?.content}
                  helperText={formik.touched.content && formik.errors.content}
                  error={Boolean(formik.touched.content && formik.errors.content)}
                  onChange={formik.handleChange}
                  spellCheck={false}
                  margin="normal"
                  fullWidth
                  multiline
                  placeholder="Message..."
                  disabled={isPendingFetchComments || isPendingAddComment}
                  color="secondary"
                  slotProps={{
                     htmlInput: {
                        sx: {
                           minHeight: '3lh',
                           fontSize: '1.2rem',
                        }
                     }
                  }}
                  sx={{
                     marginBottom: '.75rem'
                  }}
               />
               <Button
                  color="secondary"
                  variant="contained"
                  type="submit"
                  disabled={isPendingAddComment}
                  sx={{
                     fontSize: '1.1rem'
                  }}
               >
                  {
                     (isPendingAddComment) ? (
                        "Sending..."
                     ) : (
                        "Send"
                     )
                  }
               </Button>
            </form>

            <Divider
               sx={{ borderColor: "text.disabled", marginBlock: "3rem" }}
            />
            <Stack direction="column" rowGap={2}>
               {
                  commentsContent
               }
            </Stack>
         </CardContent>
      </Card>
   );
}
 
export default PostComments;