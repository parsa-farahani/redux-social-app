import type React from "react";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
// themes
import { lightTheme, darkTheme } from './theme';
import { selectIsDarkMode } from "../features/settings/settingsSlice";
import { useAppSelector } from "../app/hooks";


interface MainMUILayoutProps {
   children: React.ReactNode;
}


const MainMUILayout = ( { children }: MainMUILayoutProps ) => {

   // Redux
   const isDarkMode = useAppSelector(selectIsDarkMode);

   
   // MUI data
   const ltrCache = createCache({
      key: 'mui',
   });

   const theme = isDarkMode ? darkTheme : lightTheme;   

   return (
      <CacheProvider value={ltrCache} >
         <ThemeProvider theme={theme} >
            <CssBaseline />      
            {
               children
            }
         </ThemeProvider>
      </CacheProvider>
   );
}
 
export default MainMUILayout;