import { Avatar, Box, Card, CardActionArea, CardContent, Skeleton, Stack, Typography } from "@mui/material";
import { FaUserLarge } from "react-icons/fa6";
import { pink, red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useGetUserQuery } from "../../../api/apiSlice";

interface PostAuthorBarProps {
   userId: string;
   postDate: string;
}

const PostAuthorBar = ( { userId, postDate }: PostAuthorBarProps ) => {
 

   // rrd
   const navigate = useNavigate();

   // redux
   const {
      data: user,
      isFetching,
      isSuccess,
      isError,
   } = useGetUserQuery(userId);

 
   let authorContent;
   if (isFetching) {
      authorContent = (
         <Skeleton variant="rounded" sx={{ width: 'max(8ch, 10%)', height: '1lh' }} />
      )
   } else if (isSuccess) {
      authorContent = (
         <Typography variant="body1" component="h2">
            {user?.name ?? "Unknown Author"}
         </Typography>
      )
   } else if (isError) {
      authorContent = (
         <Typography variant="body1" component="p" sx={{ color: red[300] }}>
            Failed to fetch
         </Typography>
      )
   }


   return (
      <Card elevation={0} sx={{ marginBottom: "1rem" }}>
         <CardActionArea
            onClick={() => navigate(`/users/${userId}`)}
         >
            <CardContent sx={{ padding: 1 }}>
               <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: pink[500], color: "#222" }}>
                     <FaUserLarge />
                  </Avatar>
                  <Box>
                     <Box sx={{ height: '24px' }} >
                        {
                           authorContent
                        }
                     </Box>
                     <Typography
                        variant="caption"
                        component="time"
                        dateTime={postDate}
                        sx={{ color: "text.disabled" }}
                     >
                        {new Date(postDate).toLocaleString()}
                     </Typography>
                  </Box>
               </Stack>
            </CardContent>
         </CardActionArea>
      </Card>
   );
}
 
export default PostAuthorBar;