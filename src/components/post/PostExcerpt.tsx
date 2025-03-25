import {
   Avatar,
   Button,
   ButtonGroup,
   Card,
   type CardProps,
   CardActionArea,
   CardActions,
   cardClasses,
   CardContent,
   CardHeader,
   IconButton,
   styled,
   Typography,
   useTheme,
} from "@mui/material";
import { blue, green, pink, red } from "@mui/material/colors";
import { MdMoreVert } from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { postReactions } from "../../constants/postReactions";
import MuiCard from '@mui/material/Card';
import zIndex from "@mui/material/styles/zIndex";



interface PostExcerptProps {
   post: {
      id: string;
      title: string;
      content: string;
      userId: string;
      date: string;
   };
   type?: "posts" | "user";
}

interface PostExcerptCardProps extends CardProps {
   component?: React.ElementType,
}

const PostExcerptCard = styled(Card)<PostExcerptCardProps>(({ theme }) => ({
   position: 'relative',
   borderRadius: '.75rem',
   // border: `1px solid ${theme.palette.text.disabled}`,
   // background: `
   //    ${theme.palette.background.paper}
   //    linear-gradient(
   //       -20deg,
   //       #e91e6320,
   //       #2196F330
   //    )
   // `,
   // boxShadow: 'none',
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

const PostExcerpt = ({ post, type = "posts" }: PostExcerptProps) => {
   // MUI
   const theme = useTheme();

   return (
      <PostExcerptCard variant="elevation" elevation={4} component="article">
         <CardHeader
            avatar={
               type === "posts" && (
                  <Avatar sx={{ bgcolor: red[500], color: "#222" }}>
                     <FaUserLarge />
                  </Avatar>
               )
            }
            action={
               <IconButton aria-label="settings">
                  <MdMoreVert />
               </IconButton>
            }
            title={type === "posts" && "user name"}
            subheader={new Date(post.date).toLocaleString()}
         />
         <CardContent>
            <Typography variant="h5" component="h1" gutterBottom>
               {post.title}
            </Typography>
            <Typography variant="body1" component="p">
               {post.content.substring(0, 50).concat("...")}
            </Typography>
         </CardContent>
         <CardActions>
            <Button
               size="medium"
               variant="outlined"
               sx={{
                  marginRight: "auto",
                  borderRadius: "100vw",
                  color: "text.secondary",
                  borderColor: "text.secondary",
               }}
            >
               <Link to={`/posts/${post.id}`}>View Post</Link>
            </Button>
            <ButtonGroup
               variant="outlined"
               aria-label="Basic button group"
               sx={{
                  color: theme.palette.text.secondary,
                  borderColor: theme.palette.text.disabled,
                  "& > *": {
                     color: "inherit !important",
                     borderColor: "inherit !important",
                  },
                  "& *:first-of-type": {
                     borderRadius: "100vw 0 0 100vw !important",
                  },
                  "& *:last-of-type": {
                     borderRadius: "0 100vw 100vw 0 !important",
                  },
               }}
            >
               {Object.entries(postReactions).map(([reactionName, emoji]) => (
                  <Button
                     key={reactionName}
                     size="small"
                     sx={{
                        aspectRatio: 1 / 1,
                        flexShrink: 0,
                        flexGrow: 0,
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                     }}
                  >
                     <Typography
                        variant="h6"
                        component="span"
                        sx={{
                           display: "inline-flex",
                           alignItems: "center",
                        }}
                     >
                        {emoji.normal}
                     </Typography>
                  </Button>
               ))}
            </ButtonGroup>
         </CardActions>
      </PostExcerptCard>
   );
};

export default PostExcerpt;
