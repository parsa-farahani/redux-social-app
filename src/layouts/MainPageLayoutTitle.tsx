import { Typography } from "@mui/material";
import { HeaderOffset } from "../components/header/Header.styles";
import { MainPageLayoutTitleCont, MainPageLayoutTitleLeftCorner, MainPageLayoutTitleRightCorner } from "./MainPageLayoutTitle.styles";

interface MainPageLayoutTitleProps {
   text: string;
};


const MainPageLayoutTitle = ({ text }: MainPageLayoutTitleProps) => {

   return (
      <Typography variant="h4" component="h1" sx={{ display: 'flex', marginBottom: '2rem' }} >
         <MainPageLayoutTitleCont
            component="span"
         >
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
