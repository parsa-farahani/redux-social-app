import { Avatar, Stack, Typography } from "@mui/material";
import { type User } from "../../../features/users/usersSlice";
import { FaUserLarge } from "react-icons/fa6";
import { pink } from "@mui/material/colors";



interface UserInfoProps {
   user: User;
   userPostsTotal: number;
}

const UserInfo = ( { user, userPostsTotal }: UserInfoProps ) => {
   return (
      <Stack direction="row" justifyContent="stretch" spacing={2} sx={{ marginBlock: '1.5rem' }} >
         <Avatar alt={user.name} sx={{ width: '60px', height: '60px', bgcolor: pink[400], fontSize: '1.5rem', color: "#222", marginLeft: 'auto', marginRight: 'auto' }}>
            <FaUserLarge />
         </Avatar>
         <Stack direction="column" alignItems="flex-start" justifyContent="center" >
            <Typography variant="h5" component="h1" >
               {
                  user.name
               }
            </Typography>
            <Typography  variant="body1" component="p" sx={{ color: 'text.secondary' }} >
               {
                  userPostsTotal ?? 0
               }
               {" "}
               posts
            </Typography>
         </Stack>
      </Stack>
   );
}
 
export default UserInfo;