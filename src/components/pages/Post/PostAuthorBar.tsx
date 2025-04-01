import { Avatar, Box, Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import { type User } from "../../../features/users/usersSlice";
import { FaUserLarge } from "react-icons/fa6";
import { pink } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

interface PostAuthorBarProps {
   user: User;
   postDate: string;
}

const PostAuthorBar = ( { user, postDate }: PostAuthorBarProps ) => {
 

   // rrd
   const navigate = useNavigate();
 

   return (
      <Card elevation={0} sx={{ marginBottom: "1rem" }}>
         <CardActionArea
            onClick={() => navigate(`/users/${user?.id}`)}
         >
            <CardContent sx={{ padding: 1 }}>
               <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: pink[500], color: "#222" }}>
                     <FaUserLarge />
                  </Avatar>
                  <Box>
                     <Typography variant="body1" component="h2">
                        {user?.name ?? "Unknown Author"}
                     </Typography>
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