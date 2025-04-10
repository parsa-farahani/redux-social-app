import { styled, TextField } from "@mui/material";


export const AddPostTitleTextField = styled(TextField)(({theme}) => ({
   '& .MuiInputBase-input, & .MuiFormLabel-root': {
      fontSize: `${theme.typography.h5.fontSize} !important`
   }
}));


export const AddPostContentTextField = styled(TextField)(({theme}) => ({
   '& .MuiInputBase-input': {
      fontSize: `${theme.typography.h6.fontSize} !important`
   },
   '& .MuiFormLabel-root': {
      fontSize: `${theme.typography.h5.fontSize} !important`
   }
}));