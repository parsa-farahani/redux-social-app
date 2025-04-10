import { Avatar, Box, Card, CardActionArea, CardContent, Skeleton, Stack, Typography } from "@mui/material";
import { fetchUser, selectUserById, selectUsersError, selectUsersStatus, type User } from "../../../features/users/usersSlice";
import { FaUserLarge } from "react-icons/fa6";
import { pink } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from "react";
import { getErrorMessage } from "../../../utils/errorUtils/errorUtils";

interface PostAuthorBarProps {
   userId: string | undefined;
   postDate: string;
}

const PostAuthorBar = ( { userId, postDate }: PostAuthorBarProps ) => {
 

   // rrd
   const navigate = useNavigate();


   // Redux
   const dispatch = useAppDispatch();
   const user = useAppSelector((state) =>
      selectUserById(state, userId!),
   );
   const { fetchUser: userFetchStatus } = useAppSelector(selectUsersStatus);
   const { fetchUser: userFetchError } = useAppSelector(selectUsersError);

   const thisUserFetchStatus = userFetchStatus[userId!];

   const isPendingFetchUser = thisUserFetchStatus === 'pending';
   const isSuccessFetchUser = thisUserFetchStatus === 'succeed';
   const isFailedFetchUser = thisUserFetchStatus === 'failed';
   const isIdleFetchUser = thisUserFetchStatus === 'idle';

   useEffect(() => {
      if ((thisUserFetchStatus && !isIdleFetchUser) || userId == null) return;
         let ignore = false;
   
         const fetchUserInEffect = async () => {
   
            dispatch(
               fetchUser(userId)
            )

         }
   
         if (!ignore) {
            fetchUserInEffect()
         }
   
         return () => {
            ignore = true;
         }
   }, [dispatch, thisUserFetchStatus, isIdleFetchUser, userId])
   

   let usernameContent;
   if (isPendingFetchUser) {
      usernameContent = (
         <Skeleton variant="rounded" sx={{ height: '1lh', width: 'max(60px, 10%)' }} />
      )
   } else if (isSuccessFetchUser && user) {
      usernameContent = (
         <Typography variant="body1" component="h2">
            {user.name}
         </Typography>
      )
   } else if (isFailedFetchUser) {
      usernameContent = (
         <Typography variant="body1" component="h2">
            {
               getErrorMessage(userFetchError, 'Failed to fetch user')
            }
         </Typography>
      )
   } else {
      usernameContent = (
         <Typography variant="body1" component="h2">
            Unkwnon Author
         </Typography>
      )
   }
   

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
                     {
                        usernameContent
                     }
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