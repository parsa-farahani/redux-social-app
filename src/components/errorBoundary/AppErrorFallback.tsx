import { Box, Typography } from "@mui/material";
import { type FallbackProps } from "react-error-boundary";
// styles
import '../../assets/style/appErrorBoundary.css';


const AppErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {

   const handleReloadPage = () => {
      window.location.replace("/");
   }

   return (
      <main className="page">
         <div className="error">
            <h1 className="error-title">
               ⚠️ Oops, An Error Occured!
            </h1>
            <p className="error-text">
               Please try again later 😅 🙏
            </p>
            <button className="reload-button" type="button" onClick={handleReloadPage} >
               <span>
                  Reload
               </span>
               <span className="reload-button-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2 12a9 9 0 0 0 9 9c2.39 0 4.68-.94 6.4-2.6l-1.5-1.5A6.7 6.7 0 0 1 11 19c-6.24 0-9.36-7.54-4.95-11.95S18 5.77 18 12h-3l4 4h.1l3.9-4h-3a9 9 0 0 0-18 0"/></svg>
               </span>
            </button>
         </div>
      </main>
   )
}
 
export default AppErrorFallback;