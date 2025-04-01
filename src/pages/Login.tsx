import { Box, Button, FormControl, InputLabel, MenuItem, NativeSelect, Select, Snackbar, Stack, Typography, type SelectChangeEvent } from "@mui/material";
import MainPageLayout from "../layouts/MainPageLayout";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { fetchUsers, selectAllUsers, selectUsersStatus } from "../features/users/usersSlice";
import SnackToast from "../components/common/notification/SnackToast";


const Login = () => {

   // states
   const [username, setUsername] = useState('');
   const [openFailureToast, setOpenFailureToast] = useState(false);

   // rrd
   const navigate = useNavigate();

   // redux
   const dispatch = useAppDispatch();
   const users = useAppSelector(selectAllUsers) ?? [];
   const { fetchUsers: usersFetchStatus } = useAppSelector(selectUsersStatus)
   const isLoadingUsers = usersFetchStatus === 'pending';


   useEffect(() => {
      if (usersFetchStatus !== 'idle') return;
      let ignore = false;
      
      if (!ignore) {
         dispatch(
            fetchUsers()
         )
      }

      return () => {
         ignore = true;
      }
   }, [dispatch, usersFetchStatus])


   const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();
      if (!username) {
         handleShowFailureToast();
         return;
      }

      try {
         await dispatch(
            login(username)
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
      dispatch(
         fetchUsers()
      )
   }


   let usersContent; // Options of Select
   if (usersFetchStatus === 'pending') {
      usersContent = (
         <MenuItem value="" >
            Loading Users...
         </MenuItem>
      )
   } else if (usersFetchStatus === 'succeed') {
      usersContent = users.map(user => (
         <MenuItem key={user.id} value={user.id} >
            {
               user.name
            }
         </MenuItem>
      ));
   } else if (usersFetchStatus === 'failed') {
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
                     (isLoadingUsers) ? (
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
                  disabled={isLoadingUsers}  
                  sx={{
                     width: '100%',
                     borderRadius: '5px',
                     '& .MuiBackdrop-root': {
                        display: 'none'
                     },
                     '& .MuiList-root': {
                        marginTop: '1rem',
                     }
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