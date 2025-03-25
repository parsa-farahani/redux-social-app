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
                  <Route index element={<Navigate to="/posts" />} />
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
                           <AddPost />
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
            <Fab size="large" color="primary" aria-label="add" sx={{ bgcolor: "primary.light", fontSize: '1.2rem', position: 'absolute', left: '50%', bottom: '4rem', width: '70px', height: '70px' }}>
               <Link to='/add-post' style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '1.8rem' }} >
                  <MdLibraryAdd />
               </Link>
            </Fab>
         </MainMUILayout>
      </>
   );
};

export default App;
