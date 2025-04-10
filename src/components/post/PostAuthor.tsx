import { Skeleton, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUser, selectUserById } from "../../features/users/usersSlice";
import { useEffect, useState } from "react";
import ErrorMsg from "../common/error/ErrorMsg";
import { selectPostsStatus } from "../../features/posts/postsSlice";
import { red } from "@mui/material/colors";


interface PostAuthorProps {
   userId: string;
}


const PostAuthor = ({ userId }: PostAuthorProps) => {

   // states
   const [userFetchStatus, setUserFetchStatus] = useState('idle');
   const [userFetchError, setUserFetchError] = useState<string | null>(null);


   // redux
   const dispatch = useAppDispatch();
   const user = useAppSelector(state => selectUserById(state, userId));
   const { fetchPosts: postsFetchStatus } = useAppSelector(selectPostsStatus);

   // I check the 'state.posts.status.fetchPosts' (which is used in 'Posts' page to render 'PostExcerpt' components), to avoid the overlap between 'fetchPosts' and 'fetchUser' which causes the 'Netwrok Waterfalls' problem
   const isPendingFetchPosts = postsFetchStatus === 'pending';

   const isIdleFetchUser = userFetchStatus === 'idle';
   const isPendingFetchUser = userFetchStatus === 'pending';
   const isSuccessFetchUser = userFetchStatus === 'succeed';
   const isErrorFetchUser = userFetchStatus === 'failed';

   useEffect(() => {
      if (!isIdleFetchUser || userId == null || isPendingFetchPosts || (user )) return;
      let ignore = false;

      const fetchUserInEffect = async () => {

         setUserFetchStatus('pending');

         try {
            await dispatch(
               fetchUser(userId)
            )
            setUserFetchStatus('succeed');
            setUserFetchError(null);
         } catch (error) {
            console.error(error);
            setUserFetchStatus('failed');

            let errorMessage = "Failed to edit post";
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

            setUserFetchError(errorMessage);
         }
      }

      if (!ignore) {
         fetchUserInEffect()
      }

      return () => {
         ignore = true;
      }
   }, [dispatch, userId, isIdleFetchUser, isPendingFetchPosts, user])


   let userContent;
   if (isPendingFetchUser) {
      userContent = (
         <Skeleton variant="rounded" sx={{ display: 'inline-block' }} />
      )
   } else if (isSuccessFetchUser || user) {
      userContent = (
         <Typography>
            {
               user?.name ?? "Unknwonw Author"
            }
         </Typography>
      )
   } else if (isErrorFetchUser) {
      userContent = (
         <Typography sx={{ color: red[500], fontSize: '.9rem' }} >
            {
               userFetchError ?? 'Unknwon Error'
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
      <Stack sx={{ minWidth: '10%', width: 'fit-content' }} >
         {
            userContent
         } 
      </Stack>
   );
}
 
export default PostAuthor;