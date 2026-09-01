import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "./PrivateRoute";
import Spinner from "../components/Spinner";

const Home = lazy(() => import("../pages/Home"));
const ExploreCars = lazy(() => import("../pages/ExploreCars"));
const CarDetails = lazy(() => import("../pages/CarDetails"));
const AddCar = lazy(() => import("../pages/AddCar"));
const MyAddedCars = lazy(() => import("../pages/MyAddedCars"));
const MyBookings = lazy(() => import("../pages/MyBookings"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const NotFound = lazy(() => import("../pages/NotFound"));

const SuspenseWrapper = ({ children }) => <Suspense fallback={<Spinner />}>{children}</Suspense>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <SuspenseWrapper><Home /></SuspenseWrapper> },
      { path: "/explore", element: <SuspenseWrapper><ExploreCars /></SuspenseWrapper> },
      { path: "/cars/:id", element: <SuspenseWrapper><CarDetails /></SuspenseWrapper> },
      { path: "/login", element: <SuspenseWrapper><Login /></SuspenseWrapper> },
      { path: "/register", element: <SuspenseWrapper><Register /></SuspenseWrapper> },
      { path: "/wishlist", element: <SuspenseWrapper><Wishlist /></SuspenseWrapper> },
      {
        path: "/add-car",
        element: (
          <PrivateRoute>
            <SuspenseWrapper><AddCar /></SuspenseWrapper>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-cars",
        element: (
          <PrivateRoute>
            <SuspenseWrapper><MyAddedCars /></SuspenseWrapper>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-bookings",
        element: (
          <PrivateRoute>
            <SuspenseWrapper><MyBookings /></SuspenseWrapper>
          </PrivateRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <PrivateRoute>
            <SuspenseWrapper><AdminDashboard /></SuspenseWrapper>
          </PrivateRoute>
        ),
      },
      {
        path: "/admin/login",
        element: <SuspenseWrapper><AdminLogin /></SuspenseWrapper>,
      },
    ],
  },
  { path: "*", element: <SuspenseWrapper><NotFound /></SuspenseWrapper> },
]);

export default router;
