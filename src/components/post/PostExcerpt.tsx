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
   useUpdatePostReactionMutation,
} from "../../features/posts/postsSlice";
import PostAuthor from "./PostAuthor";
import { useAppSelector } from "../../app/hooks";
import PostReactionButton from "./PostReactionButton";
import { type User } from "../../features/users/usersSlice";
import { toast } from "react-toastify";
import { useUpdateUserReactionMutation } from "../../api/apiSlice";


interface PostExcerptProps {
   postId: string;
   type?: "posts" | "user";
   authUser: User | undefined,
}



const PostExcerpt = ({ postId, type = "posts", authUser }: PostExcerptProps) => {

   // rrd
   const navigate = useNavigate();

   // redux
   const post = useAppSelector((state) => selectPostById(state, postId));

   const [
      updateUserReaction,
   ] = useUpdateUserReactionMutation();

   const [
      updatePostReaction,
   ] = useUpdatePostReactionMutation();
   
   const isAuth = Boolean(authUser?.id) && (authUser != null);


   // + reactions
   const handleRemoveReaction = async (reactionName: string) => {
      if (!isAuth) {
         // If user hasn't logged in yet, we'll send him/her to '/login' page
         navigate("/login");
         return;
      }

      if (!authUser.reactions[postId]) return;  // already there is no such reacction, so there is nothing to remove!


      
      try {
   
         const newUserReactions = {
            ...authUser.reactions,
         };
         delete newUserReactions[postId];

         await updateUserReaction(
            {
               id: authUser.id,
               reactions: newUserReactions,
            }
         ).unwrap();
   

         const newPostReactions = { 
            ...post.reactions,
            [reactionName]: post.reactions[reactionName] - 1,
         };

         await updatePostReaction(
            {
               id: postId,
               reactions: newPostReactions,
            }
         ).unwrap();

      } catch (error) {
         console.error(error);

         let errorMessage = "Failed to add reaction";
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

      const authUserReaction = authUser.reactions[postId];


      if ( authUserReaction === reactionName ) {  // Avoiding reactions more than 'once' (just 1 like/dislike per user)
         handleRemoveReaction(reactionName);
         return;
      }



      // a draft from 'current user-reactions' to be updated
      const newUserReactions = {
         ...authUser.reactions,
      };
      
      // a draft from 'current post-reactions' to be updated
      const newPostReactions = {
         ...post.reactions,
      };


      const isOppositeReaction = (
         (authUserReaction === 'like' && reactionName === 'dislike')
         || (authUserReaction === 'dislike' && reactionName === 'like')
      );
      
      
      if (  // If user has changed his/her reaction from like <-> dislike, we should first 'remove' the opposite reaction
         isOppositeReaction   
      ) {
         const oppositeReactionName = (reactionName === 'like') ? 'dislike' : 'like';


         try {
            
            // delete newUserReactions[postId];
            newUserReactions[postId] = reactionName;
            await updateUserReaction(
               {
                  id: authUser.id,
                  reactions: newUserReactions,
               }
            ).unwrap();


            newPostReactions[oppositeReactionName] -= 1;
            newPostReactions[reactionName] += 1;
            await updatePostReaction(
               {
                  id: postId,
                  reactions: newPostReactions,
               }
            ).unwrap();
   
         } catch (error) {
            console.error(error);

            let errorMessage = "Failed to add reaction";
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
   
            newUserReactions[postId] = reactionName;
            await updateUserReaction(
               {
                  id: authUser.id,
                  reactions: newUserReactions,
               }
            ).unwrap();


            
            newPostReactions[reactionName] += 1;
            await updatePostReaction(
               {
                  id: postId,
                  reactions: newPostReactions,
               }
            ).unwrap();
   
         } catch (error) {
            console.error(error);

            let errorMessage = "Failed to add reaction";
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
            title={(type === "posts") && (post?.userId) && <PostAuthor userId={post.userId} />}
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
                        (isAuth && (authUser?.reactions[postId] === reactionName)) ? (
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
