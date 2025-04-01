import {
   Avatar,
   CardActions,
   CardContent,
   CardHeader,
   IconButton,
   Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { MdMoreVert } from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { postReactions } from "../../constants/postReactions";
import { PostExcerptCard, PostReactionButtonGroup, ViewPostButton } from "./PostExcerpt.styles";
import {
   selectPostById,
} from "../../features/posts/postsSlice";
import PostAuthor from "./PostAuthor";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import PostReactionButton from "./PostReactionButton";
import { addUserReaction, removeUserReaction } from "../../features/users/usersSlice";
import { toast } from "react-toastify";


interface PostExcerptProps {
   postId: string;
   type?: "posts" | "user";
   authUsername: string | null;
   authUserReaction: string | null;
}



const PostExcerpt = ({ postId, type = "posts", authUsername = null, authUserReaction }: PostExcerptProps) => {

   // rrd
   const navigate = useNavigate();

   // redux
   const dispatch = useAppDispatch();
   const post = useAppSelector((state) => selectPostById(state, postId));

   
   const isAuth = Boolean(authUsername) && (authUsername != null);


   // + reactions
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

         let errorMessage = "Failed to edit post";
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

            let errorMessage = "Failed to edit post";
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

            let errorMessage = "Failed to edit post";
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
      }
      
   };
   



   if (!post) {
      return null;
   }


   return (
      <PostExcerptCard variant="elevation" elevation={4} component="article">
         <CardHeader
            avatar={
               (type === "posts") && (
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
            title={(type === "posts") && <PostAuthor userId={post.userId} />}
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
            <ViewPostButton
               size="medium"
               variant="outlined"
            >
               <Link to={`/posts/${post.id}`}>View Post</Link>
            </ViewPostButton>
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
         </CardActions>
      </PostExcerptCard>
   );
};

export default PostExcerpt;
