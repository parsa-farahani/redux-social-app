import { Box, styled, TextField } from "@mui/material";


export const EditPostTitleTextField = styled(TextField)(({theme}) => ({
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
      paddingInline: theme.spacing(1),
      fontWeight: "700",
   },
}))

export const EditPostContentTextField = styled(TextField)(({theme}) => ({
   marginBlock: 0,
   marginRight: "1rem",
   ".MuiInputBase-root": {
      padding: 0,
      // background: 'none',
      fontSize: theme.typography.body1.fontSize,
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
      padding: theme.spacing(1),
      minHeight: '3lh'
      // paddingInline: 1,
   },
}))


