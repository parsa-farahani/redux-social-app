import { Box, CircularProgress, Stack, Typography, useTheme } from "@mui/material";


interface SpinnerProps {
   text?: string;
   variant?:'block' | 'fixed';
   size?: string | number;
}

const Spinner = ( { text, variant, size = "50px" }: SpinnerProps ) => {

   // MUI
   const theme = useTheme();

   let spinnerContent;
   if (variant === 'block') {
      spinnerContent = (
         <Stack direction="column" justifyContent="center" alignItems="center" sx={{ minHeight: '140px', padding: '1rem' }} >
            <CircularProgress size={size} color="secondary" />
            <Typography variant="h6" sx={{ fontWeight: '500', marginTop: '1rem' }} >
               {
                  text
               }
            </Typography>
         </Stack>
      );
   } else if (variant === 'fixed') {
      spinnerContent = (
         <Stack direction="column" alignItems="center" justifyContent="center" spacing={1} sx={{ background: (theme.palette.mode === 'dark') ? '#111111aa' : '#eeeeeeaa' , position: 'fixed', inset: '0' }} >
            <CircularProgress size={size} color="secondary" />
            <Typography variant="h6" sx={{ fontWeight: '500', marginTop: '1rem' }} >
               {
                  text
               }
            </Typography>
         </Stack>
      );
   } else {
      spinnerContent = (
         <>
            <CircularProgress size={size} color="secondary" />
            {/* <Typography variant="h6" sx={{ fontWeight: '500', marginTop: '1rem' }} >
               {
                  text
               }
            </Typography> */}
         </>
      );
   }
   
   return (
      <Box component="span" sx={{ position: 'relative', flexShrink: '0' }} >
         {
            spinnerContent
         }
      </Box>
   );
}
 
export default Spinner;