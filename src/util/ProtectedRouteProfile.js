import Profile from "../pages/Profile/Profile";
import { Navigate } from "react-router-dom";

function ProtectedRouteProfile({
  children,
  userInfo,
  isNavDropDownOpen,
  checkIfNavDropDownIsOpen,
  signOutUser,
  closeNavDropDownOnFocus,
  isLoggedIn,
}) {
  return (
    <Profile
      userInfo={userInfo}
      isNavDropDownOpen={isNavDropDownOpen}
      checkIfNavDropDownIsOpen={checkIfNavDropDownIsOpen}
      signOutUser={signOutUser}
      closeNavDropDownOnFocus={closeNavDropDownOnFocus}
    />
  );
}

export default ProtectedRouteProfile;
