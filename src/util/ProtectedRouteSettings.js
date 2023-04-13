import Settings from "../pages/Settings/Settings";

function ProtectedRouteSettings({
  children,
  userInfo,
  isNavDropDownOpen,
  checkIfNavDropDownIsOpen,
  signOutUser,
  closeNavDropDownOnFocus,
  isLoggedIn,
  isPhotoCardOpen,
  checkIfPhotoCardIsOpen,
  profilePicture,
  handleProfilePictureChange,
  previewProfilePicture,
  updateNewName,
  updateNewBio,
  updateNewPhone,
  updateNewEmail,
  updateNewPassword,
  submitUpdateInfo,
}) {
  return (
    <Settings
      userInfo={userInfo}
      isNavDropDownOpen={isNavDropDownOpen}
      checkIfNavDropDownIsOpen={checkIfNavDropDownIsOpen}
      signOutUser={signOutUser}
      closeNavDropDownOnFocus={closeNavDropDownOnFocus}
      isPhotoCardOpen={isPhotoCardOpen}
      checkIfPhotoCardIsOpen={checkIfPhotoCardIsOpen}
      handleProfilePictureChange={handleProfilePictureChange}
      previewProfilePicture={previewProfilePicture}
      updateNewName={updateNewName}
      updateNewBio={updateNewBio}
      updateNewPhone={updateNewPhone}
      updateNewEmail={updateNewEmail}
      updateNewPassword={updateNewPassword}
      submitUpdateInfo={submitUpdateInfo}
    />
  );
}

export default ProtectedRouteSettings;
