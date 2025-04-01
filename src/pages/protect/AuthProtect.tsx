import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUsername } from "../../features/auth/authSlice";
import type React from "react";


interface AuthProps {
   PageComponent: React.ReactNode;
}

const AuthProtect = ( { PageComponent, ...restProps }: AuthProps & React.ComponentProps<'div'> ) => {

   // redux
   const authUsername = useAppSelector(selectAuthUsername);


   if (authUsername == null) {
      return (
         <Navigate to="/login" />
      )
   }

   return (
      PageComponent 
   );
}
 
export default AuthProtect;