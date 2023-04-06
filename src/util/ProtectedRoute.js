import { Navigate } from "react-router-dom";
import Profile from "../pages/Profile/Profile";

function isAuthenticated() {
  return localStorage.getItem("token") !== null;
}

function ProtectedRoute({ children, userInfo }) {
  const isLoggedIn = isAuthenticated();

  return isLoggedIn ? (
    <Profile userInfo={userInfo} />
  ) : (
    <Navigate to="/signin" />
  );
}

export default ProtectedRoute;
