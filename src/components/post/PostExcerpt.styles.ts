import { Button, ButtonGroup, Card, type CardProps, styled } from "@mui/material";

interface PostExcerptCardProps extends CardProps {
   component?: React.ElementType,
}

export const PostExcerptCard = styled(Card)<PostExcerptCardProps>(({ theme }) => ({
   position: 'relative',
   borderRadius: '.75rem',
   overflow: 'visible',

   '&::before': {
      content: '""',
      position: 'absolute',
      zIndex: '-1',
      inset: '20px',
      borderRadius: 'inherit',

      filter: 'blur(50px)',
   }
}));


export const StyledReactionButton = styled(Button)(({theme}) => ({
   // aspectRatio: 1 / 1,
   flexShrink: 0,
   flexGrow: 0,
   padding: '0.5rem .5rem',
   display: "flex",
   alignItems: "center",
}))


export const PostReactionButtonGroup = styled(ButtonGroup)(({theme}) => ({
   color: theme.palette.text.secondary,
   borderColor: theme.palette.text.disabled,
   "& > *": {
      color: "inherit !important",
      borderColor: "inherit !important",
   },
   "& > *:first-of-type": {
      borderRadius: "100vw 0 0 100vw !important",
   },
   "& > *:last-of-type": {
      borderRadius: "0 100vw 100vw 0 !important",
   },
}))