import { Avatar, Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";
import { FaUserLarge } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { type User } from "../../features/users/usersSlice";

interface UserExcerptProps {
   user: User,
   avatarColor?: string
}



const UserExcerpt = ({user, avatarColor = pink[500]}: UserExcerptProps) => {


   // rrd
   const navigate = useNavigate();


   return (
      <Card>
         <CardActionArea onClick={() => navigate(`/users/${user.id}`)} >
            <CardContent>
               <Stack
                  direction="column"
                  alignItems="center"
               >
                  <Avatar
                     sx={{ marginBottom: '1rem', bgcolor: avatarColor, color: "#222" }}
                  >
                     {
                        user.name[0] || <FaUserLarge />
                     }
                  </Avatar>
                  <Typography>
                     {
                        user.name
                     }
                  </Typography>
               </Stack>
            </CardContent>
         </CardActionArea>
      </Card>
   );
}
 
export default UserExcerpt;