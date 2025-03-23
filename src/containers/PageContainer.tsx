import type React from "react";
import { Box, useTheme } from "@mui/material";
import { Helmet } from 'react-helmet-async';

interface PageContainerProps {
   children: React.ReactNode;
   title: string;
}


const PageContainer = ( { children, title }: PageContainerProps ) => {
   
   
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
      </>
   );
}
 
export default PageContainer;