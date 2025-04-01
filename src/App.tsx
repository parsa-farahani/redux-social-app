// style
import { Link, Navigate, Route, Routes, useNavigation } from "react-router-dom";
import "./assets/style/App.css";
import MainMUILayout from "./mui-layouts/MainMUILayout";
import MainLayout from "./layouts/MainLayout";
import {
   Posts,
   Post,
   Users,
   User,
   AddPost,
   EditPost,
   Login,
   Test,
   NotFound,
} from "./pages";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { Fab, useMediaQuery, useTheme } from "@mui/material";
import { setDarkMode, setLightMode } from "./features/settings/settingsSlice";
import PageContainer from "./containers/PageContainer";
import { title } from "process";
import ErrorTest from "./pages/ErrorTest";
import { IoMdAdd } from "react-icons/io";
import { MdLibraryAdd } from "react-icons/md";
import AuthProtect from "./pages/protect/AuthProtect";
import SnackToast from "./components/common/notification/SnackToast";
import { Bounce, ToastContainer, toast } from 'react-toastify';



const App = () => {


   // MUI
   const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

   // Redux
   const dispatch = useAppDispatch();

   // * changing the dark/light theme based on 'User Preference'
   useEffect(() => {
      if (prefersDark) {
         dispatch(setDarkMode());
      } else {
         dispatch(setLightMode());
      }
   }, [dispatch, prefersDark]);

   
   return (
      <>
         <MainMUILayout>
            <Routes>
               <Route path="/" element={<MainLayout />}>
                  <Route index element={<Navigate to="/login" />} />
                  <Route
                     path="/error-test"
                     element={
                        <PageContainer title="Error Test Page">
                           <ErrorTest />
                        </PageContainer>
                     }
                  />
                  <Route
                     path="/test"
                     element={
                        <PageContainer title="Test Page">
                           <Test />
                        </PageContainer>
                     }
                  />
                  <Route
                     path="/login"
                     element={
                        <PageContainer title="Asteroid - login">
                           <Login />
                        </PageContainer>
                     }
                  />
                  <Route
                     path="/posts"
                     element={
                        <PageContainer title="Asteroid - all posts">
                           <Posts />
                        </PageContainer>
                     }
                  />
                  <Route
                     path="/posts/:postId"
                     element={
                        <PageContainer title="Asteroid - post">
                           <Post />
                        </PageContainer>
                     }
                  />
                  <Route
                     path="/add-post"
                     element={
                        <PageContainer title="Asteroid - add post">
                           <AuthProtect PageComponent={<AddPost />} />
                        </PageContainer>
                     }
                  />
                  <Route
                     path="/edit-post/:postId"
                     element={
                        <PageContainer title="Asteroid - edit post">
                           <EditPost />
                        </PageContainer>
                     }
                  />
                  <Route
                     path="/users"
                     element={
                        <PageContainer title="Asteroid - all users">
                           <Users />
                        </PageContainer>
                     }
                  />
                  <Route
                     path="/users/:userId"
                     element={
                        <PageContainer title="Asteroid - user">
                           <User />
                        </PageContainer>
                     }
                  />
                  <Route
                     path="/not-found"
                     element={
                        <PageContainer title="Asteroid - 404: not found">
                           <NotFound />
                        </PageContainer>
                     }
                  />
                  <Route path="*" element={<Navigate to="/not-found" />} />
               </Route>
            </Routes>
            <ToastContainer
               position="top-right"
               autoClose={3000}
               newestOnTop={true}
               closeOnClick={true}
               pauseOnFocusLoss
               draggable
               pauseOnHover
               theme="colored"
               transition={Bounce}
            />
         </MainMUILayout>
      </>
   );
};

export default App;
