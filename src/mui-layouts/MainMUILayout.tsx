import type React from "react";
import { ThemeProvider } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
// themes
import { lightTheme, darkTheme } from './theme';
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "../features/settings/settingsSlice";


interface MainMUILayoutProps {
   children: React.ReactNode;
}


const MainMUILayout = ( { children }: MainMUILayoutProps ) => {

   // Redux
   const isDarkMode = useSelector(selectIsDarkMode);

   
   // MUI data
   const ltrCache = createCache({
      key: 'mui',
   });

   const theme = isDarkMode ? darkTheme : lightTheme;   

   return (
      <CacheProvider value={ltrCache} >
         <ThemeProvider theme={theme} >
            {
               children
            }
         </ThemeProvider>
      </CacheProvider>
   );
}
 
export default MainMUILayout;