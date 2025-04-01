import { Avatar, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";
import { purple } from "@mui/material/colors";
import { FaUserLarge } from "react-icons/fa6";
import { type Comment } from "../../features/comments/commentsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUser, selectUserById } from "../../features/users/usersSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface CommentProps {
   comment: Comment;
}

const PostComment = ( { comment }: CommentProps ) => {

   // states
   const [userFetchStatus, setUserFetchStatus] = useState('idle');

   // rrd
   const navigate = useNavigate();

   // redux
   const dispatch = useAppDispatch();
   const commentAuthor = useAppSelector(state => selectUserById(state, comment.userId))



   useEffect(() => {
      if (userFetchStatus !== 'idle') return;
      let ignore = false;

      if (!ignore) {
         dispatch(
            fetchUser(comment.userId)
         )
      }

      return () => {
         ignore = true;
      }
   }, [dispatch, userFetchStatus, comment?.userId])


   const navigateToUserPage = () => {
      if (!comment?.userId) return;
      navigate(`/users/${comment?.userId}`);
   }


   return (
      <Card
         variant="elevation"
         elevation={1}
         sx={{
            border: "1px solid transparent",
            borderColor: "text.disabled",
            borderRadius: '.5rem',
         }}
      >
         <CardActionArea
            onClick={navigateToUserPage}
         >
            <CardHeader
               avatar={
                  <Avatar sx={{ bgcolor: purple[400], color: "#222" }}>
                     <FaUserLarge />
                  </Avatar>
               }
               title={
                  commentAuthor?.name ?? 'Unknown Author'
               }
               subheader={
                  <Typography variant="caption" component="time" dateTime={comment?.date} sx={{ color: 'text.disabled' }} >
                     {
                        new Date(comment?.date).toLocaleString()
                     }
                  </Typography>
               }
            />
         </CardActionArea>
         <CardContent>
            <Typography>
               {
                  comment?.content
               }
            </Typography>
         </CardContent>
      </Card>
   );
};

export default PostComment;
