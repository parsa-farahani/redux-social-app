import { Box, BoxProps, Typography, useTheme } from "@mui/material";
import { HeaderOffset } from "../components/header/Header.styles";
import { blue, cyan, deepPurple, green, indigo, pink, purple, teal } from "@mui/material/colors";
import { MainPageLayoutTitleCont, MainPageLayoutTitleLeftCorner, MainPageLayoutTitleRightCorner } from "./MainPageLayoutTitle.styles";

interface MainPageLayoutTitleProps {
   text: string;
};


const MainPageLayoutTitle = ({ text }: MainPageLayoutTitleProps) => {

   return (
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex' }} >
         <MainPageLayoutTitleCont
            component="span"
         >
            {/* <MainPageLayoutTitleTopMask
               component="span"
            /> */}
            <MainPageLayoutTitleLeftCorner
               component="span"
            />
            {
               text
            }
            <MainPageLayoutTitleRightCorner
               component="span"
            />
         </MainPageLayoutTitleCont>
         <HeaderOffset />
      </Typography>
   );
};

export default MainPageLayoutTitle;
