import type React from "react";
import { Box } from "@mui/material";
import MainPageLayoutTitle from "./MainPageLayoutTitle";


interface MainPageLayoutProps {
   title?: string;
   children?: React.ReactNode;
}

const MainPageLayout = ({ title, children=null }: MainPageLayoutProps) => {
   
   // MUI
   // const theme = useTheme();

   
   return (
      <Box component="section">
         {
            title && (
               <>
                  <MainPageLayoutTitle text={title} />
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
