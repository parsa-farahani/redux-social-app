import { Box, CircularProgress, Stack, useTheme } from "@mui/material";


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
         <Stack direction="row" justifyContent="center" alignItems="center" sx={{ minHeight: '140px', padding: '1rem' }} >
            <CircularProgress size={size} color="secondary" />
         </Stack>
      );
   } else if (variant === 'fixed') {
      spinnerContent = (
         <Stack alignItems="center" justifyContent="center" sx={{ background: (theme.palette.mode === 'dark') ? '#111111aa' : '#eeeeeeaa' , position: 'fixed', inset: '0' }} >
            <CircularProgress size={size} color="secondary" />
         </Stack>
      );
   } else {
      spinnerContent = (
         <CircularProgress size={size} color="secondary" />
      );
   }
   
   return (
      <Box sx={{ position: 'relative' }} >
         {
            spinnerContent
         }
      </Box>
   );
}
 
export default Spinner;