import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Features from "./Pages/Features";
import Contact from "./Pages/Contact";
import UserDashBoard from "./DashBoard/UserDashBoard";
import AdminDashBoard from "./DashBoard/AdminDashBoard";
import { ThemeProvider } from "./contexts/ThemeContext";

const Layout = () => {
  const location = useLocation();
  const hide = ["/login", "/register", "/AdminDashBoard", "/UserDashBoard"];
  
  const hideLayout = hide.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/AdminDashBoard" element={<AdminDashBoard />} />
        <Route path="/UserDashBoard" element={<UserDashBoard />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Layout/>
      </Router>
    </ThemeProvider>
  );
};

export default App;
