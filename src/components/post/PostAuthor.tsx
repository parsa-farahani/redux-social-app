import { Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUser, selectAllUsers, selectUserById } from "../../features/users/usersSlice";
import { useEffect } from "react";


interface PostAuthorProps {
   userId: string;
}


const PostAuthor = ({ userId }: PostAuthorProps) => {

   // redux
   const dispatch = useAppDispatch();
   const user = useAppSelector(state => selectUserById(state, userId));


   useEffect(() => {
      if (userId == null) return;
      let ignore = false;

      if (!ignore) {
         dispatch(
            fetchUser(userId)
         )
      }

      return () => {
         ignore = true;
      }
   }, [dispatch, userId])


   return (
      <Typography>
         {
            user?.name ?? 'Unknown User'
         }
      </Typography>
   );
}
 
export default PostAuthor;