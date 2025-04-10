import { Typography } from "@mui/material";
import { StyledReactionButton } from "./PostExcerpt.styles";
import type React from "react";

interface PostReactionButtonProps {
   onAddReaction: (e: React.MouseEvent<HTMLElement>) => void;
   content: React.ReactNode;
   amount: number;
}

const PostReactionButton = ({ onAddReaction, content, amount }: PostReactionButtonProps) => {
   
   
   return (
      <StyledReactionButton size="small" onClick={onAddReaction} >
         <Typography
            variant="h6"
            component="span"
            sx={{
               display: "inline-flex",
               alignItems: "center",
            }}
         >
            {
               content
            }
         </Typography>
         <Typography
            variant="body1"
            component="span"
            sx={{ marginInlineStart: ".5rem" }}
         >
            {
               amount
            }
         </Typography>
      </StyledReactionButton>
   );
};

export default PostReactionButton;
