import { Alert } from "@mui/material";

interface ErrorMsgProps {
   text: string;
}

const ErrorMsg = ({ text }: ErrorMsgProps) => {
   return (
      <Alert variant="outlined" severity="error" sx={{ marginBottom: '1rem' }} >
         {
            text
         }
      </Alert>
   );
}
 
export default ErrorMsg;