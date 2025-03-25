import UserSkeleton from "../components/loading/skeleton/UserSkeleton";
import UserExcerpt from "../components/user/UserExcerpt";
import MainPageLayout from "../layouts/MainPageLayout";
import Grid from "@mui/material/Grid2";


const fakeUsers = [
   {
      id: '1',
      name: 'User 1',
   },
   {
      id: '2',
      name: 'User 2',
   },
   {
      id: '3',
      name: 'User 3',
   },
   {
      id: '4',
      name: 'User 4',
   },
   {
      id: '5',
      name: 'User 5',
   },
   {
      id: '6',
      name: 'User 6',
   },
   {
      id: '7',
      name: 'User 7',
   },
];



const Users = () => {
   return (
      <MainPageLayout title="All Users">
         <Grid container spacing={2}>
            {
               [1, 2, 3, 4, 5, 6, 7].map((e, i) => (
                  <Grid key={e} size={{ xs: 12, sm: 6, md: 3, xl: 2 }}>
                     <UserSkeleton />
                  </Grid>
               ))
            }
            {fakeUsers.map((user) => (
               <Grid key={user.id} size={{ xs: 12, sm: 6, md: 3, xl: 2 }}>
                  <UserExcerpt user={user} />
               </Grid>
            ))}
         </Grid>
      </MainPageLayout>
   );
};

export default Users;
