import { Skeleton, Stack, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { useGetUserQuery } from "../../api/apiSlice";
import { getErrorMessage } from "../../utils/error/errorUtils";


interface PostAuthorProps {
   userId: string;
}


const PostAuthor = ({ userId }: PostAuthorProps) => {

   // redux
   const {
      data: user,
      isFetching: isPendingFetchUser,
      isSuccess: isSuccessFetchUser,
      isError: isErrorFetchUser,
      error: userFetchError,
   } = useGetUserQuery(userId);

   

   let userContent;
   if (isPendingFetchUser) {
      userContent = (
         <Skeleton variant="rounded" sx={{ display: 'inline-block' }} />
      )
   } else if (isSuccessFetchUser) {
      userContent = (
         <Typography variant="body1" component="p" >
            {
               user?.name
            }
         </Typography>
      )
   } else if (isErrorFetchUser) {
      userContent = (
         <Typography sx={{ color: red[500], fontSize: '.9rem' }} >
            {
               getErrorMessage(userFetchError) ?? 'Unknwon Error'
            }
         </Typography>
      )
   } else {
      userContent = (
         <Typography>
            Unknown User
         </Typography>
      )
   }

   return (
      <Stack sx={{ minWidth: '10%', width: 'fit-content', height: '24px', display: 'inline-flex' }} >
         {
            userContent
         } 
      </Stack>
   );
}
 
export default PostAuthor;