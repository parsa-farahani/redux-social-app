import { Alert, Button, Card, CardContent, Divider, Stack, TextField, Typography } from "@mui/material";
import PostComment from "../../comment/PostComment";
import { useAppSelector } from "../../../app/hooks";
import { useFormik } from "formik";
import { selectAuthUsername } from "../../../features/auth/authSlice";
import { type Comment } from "../../../features/comments/commentsSlice";
import { useMemo } from "react";
import { addCommentSchema } from "../../../validations/addCommentValidation";
import { createSelector, nanoid } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import Spinner from "../../loading/spinner/Spinner";
import ErrorMsg from "../../common/error/ErrorMsg";
import { useAddCommentMutation, useGetCommentsQuery } from "../../../api/apiSlice";



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
   const authUsername = useAppSelector(selectAuthUsername);


   const isAuth = (authUsername != null) && (authUsername !== "");


   const selectPostComments = useMemo(() => {
      const emptyArray: Comment[] = [];

      return createSelector(
         (res) => res.data,
         (res, postId) => postId,
         (data: Comment[], postId: string) => data?.filter((comment: Comment) => comment.postId === postId) ?? emptyArray
      )
   }, [])

   const {
      comments,
      isFetching: isPendingFetchComments,
      isSuccess: isSuccessFetchComments,
      isError: isErrorFetchComments,
      error: commentsFetchError,
   } = useGetCommentsQuery(undefined, {
      selectFromResult: result => ({
         ...result,
         comments: selectPostComments(result, postId)
      })
   });

   const [
      addComment,
      {
         isLoading: isPendingAddComment,
         isSuccess: isSuccessAddComment,
         isError: isErrorAddComment,
         error: commentsAddError
      }
   ] = useAddCommentMutation();


   const handleSubmitComment = async (formikValues: { content: string }) => {
      
      if (!isAuth) {
         toast.info('Please login to submit your comment');
         return;
      }
      
      try {
         await addComment(
            {
               id: nanoid(),
               content: formikValues.content,
               postId,
               userId: authUsername!,
               date: new Date().toISOString(),
            }
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



   let commentsContent;
   if (isPendingFetchComments) {
      commentsContent = (
         <Spinner text="loading comments..." variant="block" />
      )
   } else if (isSuccessFetchComments) {
      if (comments?.length > 0) {
         commentsContent = (
            commentsContent = comments.map((comment) => (
               <PostComment key={comment.id} comment={comment} />
            ))
         )
      } else {
         commentsContent = (
            <Alert severity="info" variant="outlined" >
               No comments yet...
            </Alert>
         )
      }
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