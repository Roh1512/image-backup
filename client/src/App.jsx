import { Routes, Route } from "react-router-dom";
/* import Layout from "./components/layout/Layout"; */
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import LandingPage from "./pages/landingPage/LandingPage";
import Unauthorized from "./pages/unauthorized/Unauthorized";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import DashboardLayout from "./components/dashboardLayout/DashboardLayout";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ErrorElement from "./components/ErrorElement/ErrorElement";
import FilesLayout from "./components/FilesLayout/FilesLayout";
import Images from "./pages/Images/Images";
import ImageById from "./pages/Images/ImageById";
import LinkToFiles from "./components/LinkToFiles/LinkToFiles";
import Videos from "./pages/Videos/Videos";
import VideoById from "./pages/Videos/VideoById";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" errorElement={<ErrorElement />}>
          {/*Unprotected routes */}
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<Unauthorized />} />
          {/* <Route path="error" element={<ErrorElement />} /> */}
          {/*Protected Routes */}
          <Route element={<PersistLogin />} errorElement={<ErrorElement />}>
            <Route element={<RequireAuth />} errorElement={<ErrorElement />}>
              <Route
                path="dashboard"
                element={<DashboardLayout />}
                errorElement={<ErrorElement />}
              >
                <Route
                  path=""
                  element={<FilesLayout />}
                  errorElement={<ErrorElement />}
                >
                  <Route index element={<LinkToFiles />} />
                  <Route path="images" element={<Images />} />
                  <Route path="videos" element={<Videos />} />
                </Route>
                <Route path="images/:imageid" element={<ImageById />} />
                <Route path="videos/:videoid" element={<VideoById />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
