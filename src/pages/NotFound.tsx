import { Badge, Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const NAVIGATION_DELAY_MS = 5000;

const NotFound = () => {

   // states
   const [msToNavigate, setMsToNavigate] = useState(NAVIGATION_DELAY_MS);
   const secToNavigate = Math.ceil(msToNavigate / 1000);

   

   // rrd
   const navigate = useNavigate();

   // MUI
   const theme = useTheme();


   useEffect(() => {

      let updateNavTimeMsIntervalId: NodeJS.Timeout;
      updateNavigationTime();
      
      // Navigation Timeout -> '/'
      const navigateTimeout = setTimeout(() => {
         navigate('/', { replace: true });
         updateNavigationTime();
      }, NAVIGATION_DELAY_MS);


      // Function to update 'navigation timer value' (5, 4, 3, ...)
      function updateNavigationTime() {
         updateNavTimeMsIntervalId = setInterval(() => {
            setMsToNavigate(mtn => Math.max(0, mtn - 1000));
         }, 1000);
      }

      return () => {
         window.clearTimeout(navigateTimeout);
         window.clearInterval(updateNavTimeMsIntervalId);
      }
   }, [navigate]);
   
   
   return (
      <Box component="section" sx={{ height: `calc(100svh - ${theme.mixins.toolbar.minHeight}px)`, display: 'grid', placeContent: 'center' }} >
         <Stack direction='column' gap={4} sx={{ transform: 'translateY(-10vh)' }} >
            <Typography variant="h4" component="h1" textAlign="center" >
               🤔 Not Found the Page - 404
            </Typography>
            <Typography variant="h6" component="p" color="textDisabled">
               <Badge variant="dot" color="secondary" component="span" sx={{ marginInlineEnd: '.75rem' }} />
               You will be re-directed to the home page
               in
               <Chip
                  variant="outlined"
                  component="span"
                  label={secToNavigate}
                  sx={{ marginInline: '.75rem', fontSize: '1rem' }}
               />
                  Seconds
            </Typography>
         </Stack>
      </Box>
   );
}
 
export default NotFound;