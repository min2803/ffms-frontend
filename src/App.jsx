// ── Auth Pages ──
import StartPage from "./pages/auth/StartPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import NotFoundPage from "./pages/auth/NotFoundPage";
// ── User Pages ──
import DashboardPage from "./pages/user/DashboardPage";
import HouseholdPage from "./pages/user/HouseholdPage";
import AddMemberPage from "./pages/user/AddMemberPage";
import EditHouseholdPage from "./pages/user/EditHouseholdPage";
import IncomePage from "./pages/user/IncomePage";
import PersonalExpensePage from "./pages/user/PersonalExpensePage";
import FamilyExpensePage from "./pages/user/FamilyExpensePage";
import BudgetPage from "./pages/user/BudgetPage";
import UtilitiesPage from "./pages/user/UtilitiesPage";
import SettingsPage from "./pages/user/SettingsPage";
import NotificationPage from "./pages/user/NotificationPage";
// ── Admin Pages ──
import DashboardAdminPage from "./pages/admin/DashboardAdminPage";
import SystemHealthPage from "./pages/admin/SystemHealthPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import HouseholdManagementPage from "./pages/admin/HouseholdManagementPage";
import { Navigate, Route, Routes } from "react-router-dom";
import ToastContainer from "./components/ui/ToastContainer";

function PrivateRoute({ element }) {
  const token = localStorage.getItem("accessToken");
  return token ? element : <Navigate to="/login" replace />;
}

function AdminRoute({ element }) {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole");
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/dashboard" replace />;
  return element;
}

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
        <Route path="/dashboard-admin" element={<AdminRoute element={<DashboardAdminPage />} />} />
        <Route path="/dashboard-admin/system-health" element={<AdminRoute element={<SystemHealthPage />} />} />
        <Route path="/dashboard-admin/users" element={<AdminRoute element={<UserManagementPage />} />} />
        <Route path="/dashboard-admin/households" element={<AdminRoute element={<HouseholdManagementPage />} />} />
        <Route path="/household" element={<PrivateRoute element={<HouseholdPage />} />} />
        <Route path="/household/add-member" element={<PrivateRoute element={<AddMemberPage />} />} />
        <Route path="/household/edit" element={<PrivateRoute element={<EditHouseholdPage />} />} />
        <Route path="/income" element={<PrivateRoute element={<IncomePage />} />} />
        <Route path="/expense" element={<Navigate to="/expense/personal" replace />} />
        <Route path="/expense/personal" element={<PrivateRoute element={<PersonalExpensePage />} />} />
        <Route path="/expense/family" element={<PrivateRoute element={<FamilyExpensePage />} />} />
        <Route path="/budget" element={<PrivateRoute element={<BudgetPage />} />} />
        <Route path="/utilities" element={<PrivateRoute element={<UtilitiesPage />} />} />
        <Route path="/settings" element={<PrivateRoute element={<SettingsPage />} />} />
        <Route path="/notifications" element={<PrivateRoute element={<NotificationPage />} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
