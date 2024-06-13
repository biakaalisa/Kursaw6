import "./App.css";
import "@fontsource/roboto/300.css";
import { useEffect } from "react";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Main from "./pages/main";
import EmployesCards from "./components/employees/employesCards";
import ProjectsCards from "./components/projects/projectsCards";
import Auth from "./pages/auth";
import Regist from "./pages/regist";
import Navigation from "./components/navigationPanel";
import AddEmployee from "./components/adds/addEmpl";
import AddProject from "./components/adds/addPr";
import Employee from "./components/employees/employee";
import Project from "./components/projects/project";
import Customer from "./components/customer/customer";
import MainWithoutRegist from "./pages/mainWithoutRegist";
import { logout, selectIsAuth } from "./store/slice";

function App() {
  const dispatch = useDispatch();
  const [cookies] = useCookies(["aboba"]);
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    if (cookies.aboba === undefined) {
      dispatch(logout());
    }
  }, [cookies, dispatch]);

  const Layout = () => {
    return (
      <div>
        <div style={{ marginLeft: "60px", marginTop: "80px" }}>
          <Outlet />
        </div>
        <Copyright />
      </div>
    );
  };

  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        sx={{ mt: 7 }}
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link
          color="inherit"
          href="https://www.youtube.com/watch?v=fq7k_gVV5x8&list=LL&index=56&t=7345s"
        >
          Valisa
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  const privateRoutes = [
    {
      path: "/",
      element: <Navigate to="/main" />,
    },
    {
      path: "/*",
      element: <Navigate to="/main" />,
    },
    {
      path: "/main",
      element: (
        <div>
          <Navigation />
          <Main isAuth={isAuth} />
        </div>
      ),
    },
    {
      path: "/employes",
      element: (
        <div>
          <Navigation />
          <EmployesCards />
        </div>
      ),
    },
    {
      path: "/addEmployee",
      element: (
        <div>
          <Navigation />
          <AddEmployee />
        </div>
      ),
    },
    {
      path: "/addCustomer",
      element: (
        <div>
          <Navigation />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <img
              src="https://i.pinimg.com/564x/40/70/35/407035348bde78b73f420cf076a08184.jpg"
              alt="Customer"
            />
          </Box>
        </div>
      ),
    },
    {
      path: "/projects",
      element: (
        <div>
          <Navigation />
          <ProjectsCards />
        </div>
      ),
    },
    {
      path: "/addProject",
      element: (
        <div>
          <Navigation />
          <AddProject />
        </div>
      ),
    },
    {
      path: "/customers",
      element: (
        <div>
          <Navigation />
          <Customer />
        </div>
      ),
    },
    {
      path: "/employee",
      element: (
        <div>
          <Navigation />
          <Employee />
        </div>
      ),
    },
    {
      path: "/project",
      element: (
        <div>
          <Navigation />
          <Project />
        </div>
      ),
    },
  ];

  const publicRoutes = [
    {
      path: "/*",
      element: <MainWithoutRegist />,
    },
    {
      path: "/",
      element: <MainWithoutRegist />,
    },
    {
      path: "/regist",
      element: <Regist />,
    },
    {
      path: "/auth",
      element: <Auth />,
    },
  ];

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: isAuth ? privateRoutes : publicRoutes,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
