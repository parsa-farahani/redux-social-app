import { useEffect } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import UserSkeleton from "../components/loading/skeleton/UserSkeleton";
import UserExcerpt from "../components/user/UserExcerpt";
import { fetchUsers, selectAllUsers, selectUsersError, selectUsersStatus } from "../features/users/usersSlice";
import MainPageLayout from "../layouts/MainPageLayout";
import Grid from "@mui/material/Grid2";
import { randomNum } from "../utils/random/randomNum";
import { blue, deepOrange, green, pink, yellow } from "@mui/material/colors";
import { coloredAvatars, selectIsColoredAvatars } from "../features/settings/settingsSlice";
import ErrorMsg from "../components/common/error/ErrorMsg";



const avatarColorsValues: { [index: number]: string } = {
   1: green[500],
   2: yellow[500],
   3: blue[500],
   4: pink[500],
   5: deepOrange[500],
};

const avatarColors: string[] = [];


const Users = () => {

   // state

   // redux
   const dispatch = useAppDispatch();
   const isColoredAvatars = useAppSelector(selectIsColoredAvatars);
   const users = useAppSelector(selectAllUsers) ?? [];
   const { fetchUsers: usersFetchStatus } = useAppSelector(selectUsersStatus);
   const { fetchUsers: usersFetchError } = useAppSelector(selectUsersError);
   
   const isIdleFetchUsers = usersFetchStatus === 'idle';
   const isPendingFetchingUsers = usersFetchStatus === 'pending';
   const isSuccessFetchUsers = usersFetchStatus === 'succeed';
   const isFailedFetchUsers = usersFetchStatus === 'failed';
   const isValidUsersData = isSuccessFetchUsers && Array.isArray(users) && users.length > 0;


   const refetchUsers = () => {
      if (isPendingFetchingUsers) return;
      dispatch(
         fetchUsers()
      )
   }

   // fetch users
   useEffect(() => {
      if (!isIdleFetchUsers) return;
      let ignore = false;

      if (!ignore) {
         dispatch(
            fetchUsers()
         )
      }

      return () => {
         ignore = true;
      }
   }, [dispatch, isIdleFetchUsers])


   // creating avatar-colors
   useEffect(() => {
      if (!isSuccessFetchUsers || isColoredAvatars) return;

      for (let i = 0; i < users.length; i++) {
         const randomIndex = randomNum(1, 5);
         avatarColors.push( avatarColorsValues[randomIndex] );
      }

      dispatch(
         coloredAvatars()
      )
   }, [dispatch, isColoredAvatars, isSuccessFetchUsers, users.length])


   let usersContent;
   if (isPendingFetchingUsers) {
      usersContent = (
         <Grid container spacing={2}>
            {
               [1, 2, 3, 4, 5, 6, 7].map((e) => (
                  <Grid key={e} size={{ xs: 12, sm: 6, md: 3, xl: 2 }}>
                     <UserSkeleton />
                  </Grid>
               ))
            }
         </Grid>
      )
   } else if (isValidUsersData) {
      usersContent = (
         <Grid container spacing={2}>
            {
               users.map((user, i) => (
                  <Grid key={user.id} size={{ xs: 12, sm: 6, md: 3, xl: 2 }}>
                     <UserExcerpt user={user} avatarColor={avatarColors[i]} />
                  </Grid>
               ))
            }
         </Grid>
      )
   } else if (isFailedFetchUsers) {
      usersContent = (
         <Stack direction="column" spacing={1} >
            <Box >
               <ErrorMsg text={usersFetchError ?? 'Failed to Fetch Users - Unknown Error'} />
            </Box>
            <Button
               variant="contained"
               onClick={refetchUsers}
               sx={{ width: 'fit-content', bgcolor: 'secondary.dark', borderRadius: '100vw' }}
            >
               Try Again
            </Button>
         </Stack>
      )
   } else {
      usersContent = (
         <Typography>
            🔍 There is no any user yet...
         </Typography>
      )
   }

   return (
      <MainPageLayout title="Users">
         {
            usersContent
         }
      </MainPageLayout>
   );
};

export default Users;
