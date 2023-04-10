import Profile from "../pages/Profile/Profile";

function ProtectedRoute({
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

export default ProtectedRoute;
