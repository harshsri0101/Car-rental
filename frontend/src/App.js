import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";

import Home from "./pages/Home";
import Cars from "./pages/Cars";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";

import AuthPage from "./pages/AuthPage";
import AdminLogin from "./pages/AdminLogin";

import AdminDashboard from "./pages/admin/AdminDashboard"; // ✅ सिर्फ एक बार
import AddCar from "./pages/admin/AddCar";
import AllBookings from "./pages/admin/AllBooking";
import AdminCars from "./pages/admin/AdminCars";

// ✅ Get user from localStorage
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

// 🔐 CLIENT PROTECTED ROUTE
const ClientRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = getUser();

  if (!token) return <Navigate to="/login" replace />;
  if (user?.role === "admin") return <Navigate to="/admin" replace />;

  return children;
};

// 🔐 ADMIN PROTECTED ROUTE
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const user = getUser();

  if (!token) return <Navigate to="/admin/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/login" replace />;

  return children;
};

// 🔥 LAYOUT
const Layout = ({ children }) => {
  const location = useLocation();
  const user = getUser();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/admin/login";

  const isAdmin = user?.role === "admin";

  return (
    <>
      {!hideNavbar && (isAdmin ? <AdminNavbar /> : <Navbar />)}
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* ✅ CLIENT AUTH */}
          <Route path="/login" element={<AuthPage />} />

          {/* ✅ ADMIN AUTH */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 🟢 CLIENT ROUTES */}
          <Route path="/" element={<ClientRoute><Home /></ClientRoute>} />
          <Route path="/cars" element={<ClientRoute><Cars /></ClientRoute>} />
          <Route path="/booking" element={<ClientRoute><Booking /></ClientRoute>} />
          <Route path="/my-bookings" element={<ClientRoute><MyBookings /></ClientRoute>} />

          {/* 🔴 ADMIN ROUTES */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/cars" element={<AdminRoute><AdminCars /></AdminRoute>} />
          <Route path="/admin/add-car" element={<AdminRoute><AddCar /></AdminRoute>} />
          <Route path="/admin/bookings" element={<AdminRoute><AllBookings /></AdminRoute>} />

          {/* 🔁 DEFAULT */}
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;