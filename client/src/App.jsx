import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import Layout from "./components/Layout/Layout";

import Home from "./pages/home/Home";
import Login from "./pages/LoginPage/LoginPage";
import Signup from "./pages/Signup/Signup";
import RequireAuth from "./components/RequireAuth";
import NotFound from "./components/NotFound/NotFound";
import PrivateLayout from "./components/Layout/PrivateLayout";
import Profile from "./pages/Profile/Profile";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Images from "./pages/Images/Images";
import Videos from "./pages/Videos/Videos";
import FileById from "./pages/ImageById/FileById";

const homeRoutes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/home" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
      <Route path="/" element={<RequireAuth />}>
        <Route element={<PrivateLayout />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Images />} />
            <Route path="videos" element={<Videos />} />
          </Route>
          <Route path="profile" element={<Profile />} />
          <Route path="file/:fileId" element={<FileById />} />
        </Route>
      </Route>
      <Route element={<Layout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  )
);

const App = () => {
  return <RouterProvider router={homeRoutes} />;
};

export default App;
