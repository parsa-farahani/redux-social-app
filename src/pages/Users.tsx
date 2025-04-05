import { useEffect } from "react";
import { Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import UserSkeleton from "../components/loading/skeleton/UserSkeleton";
import UserExcerpt from "../components/user/UserExcerpt";
import MainPageLayout from "../layouts/MainPageLayout";
import Grid from "@mui/material/Grid2";
import { randomNum } from "../utils/random/randomNum";
import { blue, deepOrange, green, pink, yellow } from "@mui/material/colors";
import { coloredAvatars, selectIsColoredAvatars } from "../features/settings/settingsSlice";
import { useGetUsersQuery } from "../api/apiSlice";
import Spinner from "../components/loading/spinner/Spinner";



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

   const {
      data: users = [],
      isLoading: isLoadingFetchUsers,
      isFetching: isFetchingFetchUsers,
      isSuccess: isSuccessFetchUsers,
   } = useGetUsersQuery();

   const isValidUsersData = isSuccessFetchUsers && Array.isArray(users) && users.length > 0;


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
   if (isLoadingFetchUsers) {
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
   } else if (isFetchingFetchUsers) {
      usersContent = (
         <Spinner variant="block" text="Loading users" />
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
