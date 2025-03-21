
// style
import { Navigate, Route, Routes } from "react-router-dom"
import "./assets/style/App.css"
import MainMUILayout from "./mui-layouts/MainMUILayout"
import MainLayout from "./layouts/MainLayout"
import Posts from "./pages/Posts"



const App = () => {
  return (
    <MainMUILayout>
      <MainLayout>
        <Routes>
          <Route path="" element={<Navigate to="/posts" />} />
          <Route path="/posts" element={<Posts />} />
        </Routes>
      </MainLayout>
    </MainMUILayout>      
  )
}

export default App
