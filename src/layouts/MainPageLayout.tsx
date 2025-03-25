import type React from "react";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import { HeaderOffset } from "../components/header/Header.styles";
import { blue, green, pink, purple } from "@mui/material/colors";


interface MainPageLayoutProps {
   title?: string;
   children?: React.ReactNode;
}

const MainPageLayout = ({ title, children=null }: MainPageLayoutProps) => {
   
   // MUI
   const theme = useTheme();

   console.log(theme.mixins.toolbar)
   
   return (
      <Box component="section">
         {
            title && (
               <>
                  <Typography 
                     variant="h4"
                     component="h1"
                     gutterBottom
                  >
                     <Box
                        component="span"
                        sx={{
                           position: 'absolute',
                           zIndex: 99,
                           left: '50%',
                           transform: 'translateX(-50%)',
                           top: `calc(${theme.mixins.toolbar.minHeight}px + 10px)`,
                           padding: '.5rem 1.5rem',
                           borderRadius: '.5rem',
                           borderTopLeftRadius: '0',
                           borderTopRightRadius: '0',
                           overflow: 'visible',
                           '&::before': {
                              content: '""',
                              position: 'absolute',
                              zIndex: -1,
                              inset: '-2px',
                              borderRadius: 'inherit',
                              background: `
                                 linear-gradient(
                                    to top,
                                    ${pink[700]},
                                    15%,
                                    ${blue[500]},
                                    70%,
                                    transparent 80%,
                                    transparent
                                 )
                              `,
                           },
                           '&::after': {
                              content: '""',
                              position: 'absolute',
                              zIndex: -1,
                              inset: 0,
                              borderRadius: 'inherit',
                              background: theme.palette.background.default,
                           }
                        }}
                     >
                        <Box component="span" sx={{ position: 'absolute', right: '100%', width: '60px', height: '60px', borderRadius: '.5rem', 

                           '&::before': {
                              content: '""',
                              position: 'absolute',
                              inset: 0,
                              borderRadius: 'inherit',
                              background: `
                                 linear-gradient(
                                 -150deg,
                                    ${blue[800]},
                                    10%,
                                    transparent 20%,
                                    transparent
                                 )
                              ` 
                           },
                           '&::after': {
                              content: '""',
                              position: 'absolute',
                              inset: '1px',
                              borderRadius: 'inherit',
                              background: theme.palette.background.default
                           },
                         }} ></Box>
                        {
                           title
                        }
                        <Box component="span" sx={{ position: 'absolute', left: '100%', width: '60px', height: '60px', borderRadius: '.5rem', 

                           '&::before': {
                              content: '""',
                              position: 'absolute',
                              inset: 0,
                              borderRadius: 'inherit',
                              background: `
                                 linear-gradient(
                                    150deg,
                                    ${blue[800]},
                                    10%,
                                    transparent 20%,
                                    transparent
                                 )
                              ` 
                           },
                           '&::after': {
                              content: '""',
                              position: 'absolute',
                              inset: '1px',
                              borderRadius: 'inherit',
                              background: theme.palette.background.default
                           },
                         }} ></Box>
                     </Box>
                     <HeaderOffset />
                  </Typography>
                  {/* <Divider sx={{ marginBlock: "1rem" }} /> */}
               </>
            )
         }
         {
            children
         }
      </Box>
   );
};

export default MainPageLayout;
