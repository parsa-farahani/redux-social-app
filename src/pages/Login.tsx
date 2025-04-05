import { Button, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import MainPageLayout from "../layouts/MainPageLayout";
import { type FormEvent, type ReactNode, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import SnackToast from "../components/common/notification/SnackToast";
import apiSlice, { useGetUsersQuery } from "../api/apiSlice";


const Login = () => {

   // states
   const [username, setUsername] = useState('');
   const [openFailureToast, setOpenFailureToast] = useState(false);

   // rrd
   const navigate = useNavigate();

   // redux
   const dispatch = useAppDispatch();

   const {
      data: users = [],
      refetch: refetchUsers,
      isFetching: isPendingFetchUsers,
      isSuccess: isSuccessFetchUsers,
      isError: isErrorFetchUsers,
   } = useGetUsersQuery();




   const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();
      if (!username) {
         handleShowFailureToast();
         return;
      }

      try {
         await dispatch(
            login(username)
         );
         dispatch(
            apiSlice.endpoints.getUser.initiate(username)
         )
         navigate('/posts');
      } catch (error) {
         console.error(error);
      }
   }

   const handleUsernameChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
      if (event.target == null || event.target?.value == null) return;
      setUsername(
         event.target.value
      )
   }

   const handleShowFailureToast = () => {
      setOpenFailureToast(true);
   }

   const handleCloseFailureToast = () => {
      setOpenFailureToast(false);
   }

   const handleRefetchUsers = () => {
      refetchUsers();
   }


   let usersContent; // Options of Select
   if (isPendingFetchUsers) {
      usersContent = (
         <MenuItem value="" >
            Loading Users...
         </MenuItem>
      )
   } else if (isSuccessFetchUsers) {
      usersContent = users.map(user => (
         <MenuItem key={user.id} value={user.id} >
            {
               user.name
            }
         </MenuItem>
      ));
   } else if (isErrorFetchUsers) {
      usersContent = (
         <MenuItem value="" onClick={handleRefetchUsers} >
            Loading Failed - Click to try again
         </MenuItem>
      )  
   }


   return (
      <MainPageLayout title="Login">
         <form onSubmit={handleSubmit}>
            <FormControl color="secondary" fullWidth sx={{marginTop: '4rem', marginBottom: '1rem'}}>
               <InputLabel
                  id="login-username-label"
               >
                  {
                     (isPendingFetchUsers) ? (
                        "Loading Users..."
                     ) : (
                        "Username"
                     )
                  }
               </InputLabel>
               <Select
                  labelId="login-username-label"
                  id="login-username"
                  value={username}
                  label="Username"
                  onChange={handleUsernameChange}
                  disabled={isPendingFetchUsers}  
                  sx={{
                     width: '100%',
                     borderRadius: '.5rem',
                     '& .MuiBackdrop-root': {
                        display: 'none'
                     },
                  }}
               >
                  {
                     usersContent
                  }
               </Select>
            </FormControl>
            <Button
               variant="contained"
               color="secondary"
               size="large"
               type="submit"
            >
               Login
            </Button>
         </form>
         <SnackToast
            message="Invalid Credentials"
            open={openFailureToast}
            variant='error'         
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            duration={3000}
            onClick={handleCloseFailureToast}
            onClose={handleCloseFailureToast}
         />
      </MainPageLayout>
   );
}
 
export default Login;