import { Avatar, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";
import { purple } from "@mui/material/colors";
import { FaUserLarge } from "react-icons/fa6";
import { type Comment } from "../../features/comments/commentsSlice";
import { useNavigate } from "react-router-dom";
import { useGetUserQuery } from "../../api/apiSlice";


interface CommentProps {
   comment: Comment;
}

const PostComment = ( { comment }: CommentProps ) => {


   // rrd
   const navigate = useNavigate();

   // redux
   const {
      data: commentAuthor,
   } = useGetUserQuery(comment?.userId);



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
