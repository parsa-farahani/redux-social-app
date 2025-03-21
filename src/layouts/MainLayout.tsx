import React, { useState } from "react";
import Header from "../components/header/Header";


interface MainLayoutProps {
   children: React.ReactNode;
}

const MainLayout = ( { children }: MainLayoutProps ) => {

   return (
      <>
         <Header/>
         <main>
            {
               children
            }
         </main>
         <footer></footer>
      </>
   );
}
 
export default MainLayout;