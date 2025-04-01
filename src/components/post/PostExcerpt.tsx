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
   Snackbar,
   Stack,
} from "@mui/material";
import { blue, green, pink, red } from "@mui/material/colors";
import { MdDangerous, MdMoreVert } from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { postReactions } from "../../constants/postReactions";
import MuiCard from "@mui/material/Card";
import zIndex from "@mui/material/styles/zIndex";
import { PostExcerptCard, PostReactionButtonGroup } from "./PostExcerpt.styles";
import {
   addPostReaction,
   removePostReaction,
   selectPostById,
   type Post,
} from "../../features/posts/postsSlice";
import PostAuthor from "./PostAuthor";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ErrorMsg from "../common/error/ErrorMsg";
import PostReactionButton from "./PostReactionButton";
import { selectAuthUsername } from "../../features/auth/authSlice";
import { useState } from "react";
import { AxiosError } from "axios";
import { addUserReaction, removeUserReaction, selectUserById, selectUserReactions, type User } from "../../features/users/usersSlice";

interface PostExcerptProps {
   postId: string;
   type?: "posts" | "user";
   authUsername: string | null;
   // authUser: User;
   authUserReaction: string | null;
}

const PostExcerpt = ({ postId, type = "posts", authUsername = null, authUserReaction }: PostExcerptProps) => {
// const PostExcerpt = ({ postId, type = "posts", authUser }: PostExcerptProps) => {
   // states
   const [reactionError, setReactionError] = useState<null | string>(null);
   const [showReactionErrorToast, setShowReactionErrorToast] = useState(false);

   // MUI
   const theme = useTheme();

   // rrd
   const navigate = useNavigate();

   // redux
   const dispatch = useAppDispatch();
   const post = useAppSelector((state) => selectPostById(state, postId));
   // const authUsername = useAppSelector(selectAuthUsername);
   // const authUser = useAppSelector(state => selectUserById(state, authUsername!));
   // const authUserReactions = useAppSelector(state => selectUserReactions(state, authUsername!))
   
   const isAuth = Boolean(authUsername) && (authUsername != null);


   const handleRemoveReaction = async (reactionName: string) => {
      if (!isAuth) {
         // If user hasn't logged in yet, we'll send him/her to '/login' page
         navigate("/login");
         return;
      }

      try {
   
         await dispatch(
            removeUserReaction(
               {
                  userId: authUsername,
                  postId: postId,
                  reactionName,
               }
            )
         )

      } catch (error) {
         console.error(error);
      }
   }

   const handleAddReaction = async (reactionName: string) => {  // We can also use 'extraReducers' to handle actions of other slices in a slice to write such logic, but I kept the logic here for now (because I need to control the order of requests), and maybe I move some of these logics to the 'extraReducers' of a slice!
      if (!isAuth) {
         // If user hasn't logged in yet, we'll send him/her to '/login' page
         navigate("/login");
         return;
      }


      if ( authUserReaction === reactionName ) {  // Avoiding reactions more than 'once' (just 1 like/dislike per user)
         handleRemoveReaction(reactionName);
         return;
      }



      const isOppositeReaction = (
         (authUserReaction === 'like' && reactionName === 'dislike')
         || (authUserReaction === 'dislike' && reactionName === 'like')
      );
      
      
      if (  // If user has changed his/her reaction from like <-> dislike, we should first 'remove' the opposite reaction
         isOppositeReaction   
      ) {
         const oppositeReactionName = (reactionName === 'like') ? 'dislike' : 'like';

         try {

            await dispatch(
               removeUserReaction(
                  {
                     userId: authUsername,
                     postId: postId,
                     reactionName: oppositeReactionName,
                  }
               )
            )

            await dispatch(
               addUserReaction(
                  {
                     userId: authUsername,
                     postId: postId,
                     reactionName,
                  }
               )
            )
   
         } catch (error) {
            console.error(error);
         }
      } else {

         try {
   
            await dispatch(
               addUserReaction(
                  {
                     userId: authUsername,
                     postId: postId,
                     reactionName,
                  }
               )
            )
   
         } catch (error) {
            console.error(error);
         }
      }
      
   };
   

   const handleCloseReactionErrorToast = () => {
      setShowReactionErrorToast(false);
   }

   if (!post) {
      return <ErrorMsg text="404 - Not Found the Post!" />;
   }

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
            title={type === "posts" && <PostAuthor userId={post.userId} />}
            subheader={
               <Typography
                  variant="body2"
                  component="time"
                  sx={{ color: "text.disabled" }}
               >
                  {new Date(post.date).toLocaleString()}
               </Typography>
            }
         />
         <CardContent>
            <Typography variant="h5" component="h1" gutterBottom>
               {post.title}
            </Typography>
            <Typography variant="body1" component="p">
               {post.content.length > 50
                  ? post.content.substring(0, 50).concat("...")
                  : post.content}
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
            <PostReactionButtonGroup variant="outlined">
               {Object.entries(postReactions).map(([reactionName, emoji]) => (
                  <PostReactionButton
                     key={reactionName}
                     onAddReaction={(e: React.MouseEvent<HTMLElement>) =>
                        handleAddReaction(reactionName)
                     }
                     content={
                        (isAuth && (authUserReaction === reactionName)) ? (
                           emoji.active
                        ) : (
                           emoji.normal
                        )
                     }
                     amount={post.reactions[reactionName]}
                  />
               ))}
            </PostReactionButtonGroup>
            <Snackbar
               anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
               open={showReactionErrorToast}
               autoHideDuration={3000}
               onClick={handleCloseReactionErrorToast}
               onClose={handleCloseReactionErrorToast}
               message={
                  <Stack direction="row" alignItems="center" spacing={1}>
                     <MdDangerous />
                     <Typography>{reactionError}</Typography>
                  </Stack>
               }
               sx={{
                  fontSize: "1.5rem !important",
                  "& .MuiPaper-root": {
                     fontSize: "1.2rem",
                     bgcolor: red[600],
                  },
               }}
            />
         </CardActions>
      </PostExcerptCard>
   );
};

export default PostExcerpt;
