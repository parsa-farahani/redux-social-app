import type React from "react";
import { Box, Container, Fab, useTheme } from "@mui/material";
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from "react-router-dom";
import { MdLibraryAdd } from "react-icons/md";
import AddPostFab from "../components/pages/AddPost/AddPostFab";
import { useAppSelector } from "../app/hooks";
import { selectAuthUsername } from "../features/auth/authSlice";

interface PageContainerProps {
   children: React.ReactNode;
   title: string;
}


const PageContainer = ( { children, title }: PageContainerProps ) => {
   
   // rrd
   const location = useLocation();

   // redux
   const authUsername = useAppSelector(selectAuthUsername);

   
   return (
      <>
         <Helmet>
            <title>
               {
                  title
               }
            </title>
         </Helmet>
         <Box
            sx={{
               paddingBlock: '1rem',
            }}
         >
            {
               children
            }
         </Box>
         <Container maxWidth="xl" sx={{ position: 'fixed', bottom: '0', left: '50%', transform: 'translateX(-50%)' }}>
            {
               (!location.pathname.includes('/add-post') && authUsername) ? (
                  <AddPostFab />
               ) : (
                  null
               )
            }
         </Container>
      </>
   );
}
 
export default PageContainer;