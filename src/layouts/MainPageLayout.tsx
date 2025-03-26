import type React from "react";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import { HeaderOffset } from "../components/header/Header.styles";
import { blue, cyan, green, pink, purple } from "@mui/material/colors";
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
