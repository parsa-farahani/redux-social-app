import Header from "../components/header/Header";
import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";
import { HeaderOffset } from "../components/header/Header.styles";



const MainLayout = () => {

   return (
      <>
         <Header/>
         <HeaderOffset />
         <Container
            component="main"
            maxWidth="xl"   
         >
            <Outlet />
         </Container>
         <footer></footer>
      </>
   );
}
 
export default MainLayout;