import MainPageLayout from "../layouts/MainPageLayout";
import { useFormik } from "formik";
import { addPostSchema } from "../validations/addPostValidation";
import { Box, Button, useTheme } from "@mui/material";
import { useAppSelector } from "../app/hooks";
import { useAddPostMutation } from "../features/posts/postsSlice";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { selectAuthUsername } from "../features/auth/authSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { AddPostContentTextField, AddPostTitleTextField } from "./AddPost.styles";





const AddPost = () => {

   // Formik
   const addPostInitValues = {
      title: "",
      content: "",
   };

   const formik = useFormik({
      initialValues: addPostInitValues,
      validationSchema: addPostSchema,
      onSubmit: (values) => {
         handleSubmitPost(values)
      },
   });

   // MUI
   const theme = useTheme();

   // rrd
   const navigate = useNavigate();

   // redux

   const [
      addPost,
      {
         isLoading: isPendingAddPost,
      }
   ] = useAddPostMutation();

   const authUsername = useAppSelector(selectAuthUsername);
   

   const canSubmit = (!isPendingAddPost);  // emptiness of inputs are handled by 'formik + yup'


   const handleSubmitPost = async (formikValues: { title: string; content: string }) => {
      if (authUsername == null) return;

      try {
         await addPost({
            id: nanoid(),
            title: formikValues.title,
            content: formikValues.content,
            userId: authUsername,
            date: new Date().toISOString(),
            reactions: {
               like: 0,
               dislike: 0,
            }
         }).unwrap();
         toast.success("The post is added successfully!");
         navigate(`/users/${authUsername}`);
      } catch (error) {
         console.error(error);

         let errorMessage = 'Failed to add post';
         if (error instanceof Error) {
           errorMessage = error.message;
         } else if (typeof error === 'object' && error !== null && 'message' in error) {
           errorMessage = String(error.message);
         } else if (typeof error === 'string') {
           errorMessage = error;
         }
         toast.error(errorMessage);
      }
   }


   useEffect(() => {
      if (authUsername == null) {
         navigate('/login');
      }
   }, [authUsername, navigate]);


   return (
      <MainPageLayout title="Add Post">
         <form noValidate onSubmit={formik.handleSubmit}>
            <AddPostTitleTextField
               type="text"
               name="title"
               value={formik.values?.title}
               helperText={formik.touched.title && formik.errors.title}
               error={Boolean(formik.touched.title && formik.errors.title)}
               onChange={formik.handleChange}
               fullWidth
               spellCheck={false}
               variant="standard"
               label="Title"
               margin="normal"
               color="secondary"
            />
            <AddPostContentTextField
               type="text"
               name="content"
               value={formik.values?.content}
               helperText={formik.touched.content && formik.errors.content}
               error={Boolean(formik.touched.content && formik.errors.content)}
               onChange={formik.handleChange}
               fullWidth
               variant="outlined"
               label="Content"
               multiline
               spellCheck={false}
               margin="normal"
               color="secondary"
               sx={{
                  '& textarea': {
                     height: '4lh !important'
                  }
               }}
            />
            <Box sx={{ marginTop: '1rem' }} >
               <Button variant="contained" type="submit" disabled={!canSubmit} color="secondary" sx={{ fontSize: theme.typography.h6.fontSize }} >
                  {
                     (isPendingAddPost) ? (
                        "Loading..."
                     ) : (
                        "Publish Post"
                     )
                  }
               </Button>
            </Box>
         </form>
      </MainPageLayout>
   );
};

export default AddPost;
