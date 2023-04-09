import { Navigate } from "react-router-dom";
import Profile from "../pages/Profile/Profile";

function isAuthenticated() {
  return localStorage.getItem("token") !== null;
}

function ProtectedRoute({
  children,
  userInfo,
  isNavDropDownOpen,
  checkIfNavDropDownIsOpen,
  signOutUser,
  closeNavDropDownOnFocus,
}) {
  const isLoggedIn = isAuthenticated();

  return isLoggedIn ? (
    <Profile
      userInfo={userInfo}
      isNavDropDownOpen={isNavDropDownOpen}
      checkIfNavDropDownIsOpen={checkIfNavDropDownIsOpen}
      signOutUser={signOutUser}
      closeNavDropDownOnFocus={closeNavDropDownOnFocus}
    />
  ) : (
    <Navigate to="/signin" />
  );
}

export default ProtectedRoute;
