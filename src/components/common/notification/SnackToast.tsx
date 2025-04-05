import { Snackbar, Stack, Typography, type SnackbarCloseReason } from "@mui/material";
import { green, lightBlue, pink } from "@mui/material/colors";
import { MdCheck, MdDangerous, MdInfo } from "react-icons/md";


interface SnackToastProps {
   message: string;
   open: boolean;
   anchorOrigin?: { vertical: 'top' | 'bottom', horizontal: 'left' | 'center' | 'right' }
   duration?: number;
   variant?: 'error' | 'success' | 'info';
   onClick?: (e: React.MouseEvent<HTMLElement>) => void;
   onClose?: (event: Event | React.SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => void;
}

const SnackToast = ( { message, variant, open, onClick, onClose, anchorOrigin = { vertical: 'top', horizontal: 'center' } }: SnackToastProps ) => {


   const isError = variant === 'error';
   const isSuccess = variant === 'success';
   const isInfo = variant === 'info';


   return (
      <Snackbar
         open={open}
         autoHideDuration={3000}
         anchorOrigin={anchorOrigin}
         onClick={onClick}
         onClose={onClose}
         message={
            <Stack direction="row" alignItems="center" spacing={1.5}>
               {
                  (isError) ? (
                     <MdDangerous />   
                  ) : (isSuccess) ? (
                     <MdCheck />   
                  ) : (isInfo) ? (
                     <MdInfo />   
                  ) : null
               }
               <Typography sx={{ fontSize: '1.2rem' }} >
                  {
                     message
                  }
               </Typography>
            </Stack>
         }
         sx={{
            '& .MuiPaper-root': {
               fontSize: '1.2rem',
               bgcolor: (isError) ? (pink[600]) : (isSuccess) ? (green[500]) : (isInfo) ? (lightBlue[500]) : ('text.secondary'),
               color: 'background.primary',
            },
         }}
      />
   );
}
 
export default SnackToast;