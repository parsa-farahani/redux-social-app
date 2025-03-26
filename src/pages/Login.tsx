import { Box, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import MainPageLayout from "../layouts/MainPageLayout";
import { type ReactNode, useState } from "react";
import type React from "react";

const Login = () => {

   // states (temporary)
   const [username, setUsername] = useState<string>('');


   const handleUsernameChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
      if (event.target == null || event.target?.value == null) return;
      setUsername(
         event.target.value
      )
   }

   return (
      <MainPageLayout title="Login">
         <FormControl color="secondary" fullWidth sx={{marginTop: '4rem'}}>
            <InputLabel
               id="login-username-label"
            >
               Username
            </InputLabel>
            <Select
               labelId="login-username-label"
               id="demo-simple-select"
               value={username}
               label="Username"
               onChange={handleUsernameChange}
               
            >
               <MenuItem value="user-1" >
                  User 1
               </MenuItem>
               <MenuItem value="user-2" >
                  User 2
               </MenuItem>
               <MenuItem value="user-3" >
                  User 3
               </MenuItem>
            </Select>
         </FormControl>
      </MainPageLayout>
   );
}
 
export default Login;