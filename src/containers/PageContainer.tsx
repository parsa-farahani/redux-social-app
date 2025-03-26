import React from "react";
import { Box, Fab, useTheme } from "@mui/material";
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from "react-router-dom";
import { MdLibraryAdd } from "react-icons/md";

interface PageContainerProps {
   children: React.ReactNode;
   title: string;
}

let AddPostFab = React.memo(
   () => {

      return (
         <Fab size="large" color="primary" aria-label="add" sx={{ bgcolor: "primary.light", fontSize: '1.2rem', position: 'fixed', zIndex: 99, left: '50%', bottom: '4rem', width: '70px', height: '70px' }}>
            <Link to='/add-post' style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '1.8rem' }} >
               <MdLibraryAdd />
            </Link>
         </Fab>
      )
   }
)

const PageContainer = ( { children, title }: PageContainerProps ) => {
   
   // rrd
   const location = useLocation();

   
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
         {
            (!location.pathname.includes('/add-post')) ? (
               <AddPostFab />
            ) : (
               null
            )
         }
      </>
   );
}
 
export default PageContainer;