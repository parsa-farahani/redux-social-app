import { Box, styled } from "@mui/material";

export const PostDeletionModalInner = styled(Box)(({theme}) => ({
   position: "absolute",
   top: "50%",
   left: "50%",
   transform: "translate(-50%, -50%)",
   width: "95vw",
   maxWidth: "400px",
   padding: theme.spacing(4),
   paddingTop: "3rem",
   backgroundColor: theme.palette.background.paper,
   borderRadius: ".5rem",
   border: "2px solid #000",
   boxShadow: theme.shadows[24],
}))