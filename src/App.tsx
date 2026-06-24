import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Users from "./pages/Users/Users";
import Students from "./pages/Students/Students";
import Batches from "./pages/Batches/Batches";
import Staff from "./pages/Staff/Staff";
import ClassStudents from "./pages/Classes/ClassStudents";
import Reports from "./pages/Reports/Reports";

export default function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Dashboard Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index path="/" element={<Home />} />

                {/* Tuition Centre Management */}
                <Route path="/users" element={<Users />} />
                <Route path="/batches" element={<Batches />} />
                <Route path="/students" element={<Students />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/classes/:classNumber" element={<ClassStudents />} />
                <Route path="/reports" element={<Reports />} />

                <Route path="/profile" element={<UserProfiles />} />
              </Route>
            </Route>

            {/* Auth Layout */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
