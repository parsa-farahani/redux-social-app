import MainPageLayout from "../layouts/MainPageLayout";
import { useFormik } from "formik";
import { addPostSchema } from "../validations/addPostValidation";
import { Box, Button, styled, TextField, useTheme } from "@mui/material";



const AddPostTitleTextField = styled(TextField)(({theme}) => ({
   '& .MuiInputBase-input, & .MuiFormLabel-root': {
      fontSize: `${theme.typography.h5.fontSize} !important`
   }
}));

const AddPostContentTextField = styled(TextField)(({theme}) => ({
   '& .MuiInputBase-input': {
      fontSize: `${theme.typography.h6.fontSize} !important`
   },
   '& .MuiFormLabel-root': {
      fontSize: `${theme.typography.h5.fontSize} !important`
   }
}));


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
         console.log(values);
      },
   });

   // MUI
   const theme = useTheme();

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
               margin="normal"
               color="secondary"
               sx={{
                  '& textarea': {
                     height: '4lh !important'
                  }
               }}
            />
            <Box sx={{ marginTop: '1rem' }} >
               <Button variant="contained" type="submit" color="secondary" sx={{ fontSize: theme.typography.h6.fontSize }} >
                  Publish Post
               </Button>
            </Box>
         </form>
      </MainPageLayout>
   );
};

export default AddPost;
