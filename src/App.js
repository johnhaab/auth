import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRouteProfile from "./util/ProtectedRouteProfile";
import ProtectedRouteSettings from "./util/ProtectedRouteSettings";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";

import "./App.scss";
import axios from "axios";
import Signin from "./pages/Signin/Signin";
import Cookies from "js-cookie";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isLoggedIn: false,
      theme: "light",
      data: [],
      error: null,
      loginError: false,
      registerError: false,
      registerErrorMsg: [],
      loginErrorMsg: [],
      userInfo: null,
      isNavDropDownOpen: false,
      uploadedProfilePicUrl: null,
      timeUntilCookieExpires: null,
      isPhotoCardOpen: false,
      previewProfilePicture: null,
      newName: null,
      newBio: null,
      newPhone: null,
      newEmail: null,
      newPassword: null,
    };
  }

  // Function get ran in here every time the component mounts aka everytime the website loads.
  componentDidMount = async () => {
    this.setState({
      isLoaded: true,
    });
    this.getUserInfo();
    this.checkIfUserIsLoggedIn();
  };

  handleProfilePictureChange = (input) => {
    this.setState({ previewProfilePicture: input });
    console.log(this.state.previewProfilePicture);
  };

  // Function that has two variables, one called data and one called config
  // data is an object that has the users name, email, password, and password2
  // and config is an object that has the headers set to "Content-Type":
  // "application/x-www-form-urlencoded", as per my db requirements. Then it
  // makes a post request to the backend and it recives a response. If the
  // response is successful, then it redirects the user to the signin page.
  registerUser = async () => {
    const data = {
      name: "No name yet...",
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post("http://209.192.200.84:5000/api/users/register", data, config)
      .then((response) => {
        // Handle success
        console.log(response.data);
        window.location.replace("http://209.192.200.84:3000/auth/signin");
      })
      .catch((error) => {
        // Handle failure
        const errorMessages = Object.values(error.response.data);
        this.setState({
          registerError: true,
          registerErrorMsg: errorMessages,
        });
        console.log(this.state.registerErrorMsg);
      });

    await console.log(this.state.registerErrorMsg);
  };

  // Function that checks if the user is logged in, the way I am doing that
  // making a variable called data and adding the users email and password
  // from the state and also adding a condfig variable that has the headers
  // set to "Content-Type": "application/x-www-form-urlencoded", as per my db
  // requirements. Then it makes a post request to the backend and it recives
  // a response. If the response is successful, then it sets the token in local
  // storage and then makes another backend call that retrives the users info.
  loginUser = async () => {
    const data = {
      email: this.state.email,
      password: this.state.password,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      withCredentials: true,
    };

    await axios
      .post("http://209.192.200.84:5000/api/users/login", data, config, {
        withCredentials: true,
      })
      .then(async (response) => {
        this.setState({ isLoggedIn: true });
        localStorage.setItem("signedIn", true);

        // This is the api call that fetches the users info from the backend.
        try {
          const response = await axios.get(
            "http://209.192.200.84:5000/api/users/profile",
            {
              withCredentials: true, // Include the session token cookie in the request
            }
          );

          const userProfile = response.data;
          this.setState({ userInfo: userProfile });
          window.location.replace("http://209.192.200.84:3000/auth/profile");
        } catch (error) {
          console.log(error);
        }
      })

      .catch((error) => {
        // Handle failure
        const errorMessages = Object.values(error.response.data);
        this.setState({
          loginError: true,
          loginErrorMsg: errorMessages,
        });
        console.log("123" + this.state.loginErrorMsg);
      });
  };

  // Function that signs the user out, it removes the token from localStorage
  // and then redirects the user to the signin page.
  signOutUser = async () => {
    console.log("signOutUser");
    await axios
      .get("http://209.192.200.84:5000/api/users/auth/logout", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        localStorage.removeItem("signedIn");
        window.location.replace("http://209.192.200.84:3000/auth/signin");
      })
      .catch((error) => {});
  };

  // Function that uploads a users image to my img-to-url backend for their profile picture.
  uploadProfilePic = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    await axios
      .post("http://209.192.200.84:3232/api/image-to-url/upload", formData)
      .then((response) => {
        console.log(response.data);
        this.setState({ uploadedProfilePicUrl: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Same shit
  uploadProfilePicLink = async (e) => {
    const input = e.target.value;

    this.setState({ uploadedProfilePicUrl: input });
  };

  // Function that checks if the user has a token and if the token is still valid.
  checkSessionToken = async () => {
    const token = Cookies.get("sessionToken");

    if (token) {
      const sessionTokenCookie = Cookies.getJSON("sessionToken"); // Get the sessionToken cookie as a JSON object
      const expirationTime = sessionTokenCookie.expires; // Get the expiration time from the cookie object

      if (expirationTime && Date.now() < new Date(expirationTime).getTime()) {
        const timeUntilExpiration =
          new Date(expirationTime).getTime() - Date.now();
      }
    }

    console.log("Token is invalid");
  };

  // Function to check if the user is logged in, the way I am doing that
  // is by checking if the token is in localStorage and if it is, then
  // it makes a request to the database to get the user info and then
  // sets the state of userInfo to the response data.
  getUserInfo = async () => {
    // Fetch user info using token
    try {
      const response = await axios.get(
        "http://209.192.200.84:5000/api/users/profile",
        {
          withCredentials: true, // Include the session token cookie in the request
        }
      );

      const userProfile = response.data;
      this.setState({ userInfo: userProfile });
      this.setState({ isLoggedIn: true });
      this.setState({
        previewProfilePicture: this.state.userInfo.profilePicture,
      });
      console.log(this.state.userInfo);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  // Function to check if the user is logged in, the way I am doing that
  // is checking if the user has a token or "session id" in thier local
  // storage and depending on if they do they get logged in and redirected
  // to /profile and can view their info if there is no token it will redirect
  // to / which is the register page.
  checkIfUserIsLoggedIn = async () => {
    console.log(this.state.userInfo);
    try {
      const response = await axios.get(
        "http://209.192.200.84:5000/api/users/auth",
        {
          withCredentials: true,
        }
      );
      const { isAuthenticated } = response.data;
      console.log(isAuthenticated);

      if (isAuthenticated) {
        // The user has a valid session token in their cookies
        this.setState({ isLoggedIn: true });
        localStorage.setItem("signedIn", "true");
        await this.getUserInfo();
        if (window.location.pathname === "/auth") {
          window.location.replace("http://209.192.200.84:3000/auth/profile");
          return;
        } else if (window.location.pathname === "/auth/settings") {
          console.log("on settings page already");
          return;
        } else if (window.location.pathname === "/auth/profile") {
          console.log("on profile page already");
          return;
        }
      } else {
        this.setState({ isLoggedIn: false });
        localStorage.removeItem("signedIn");
        console.log("failed to log in!");
        // The user does not have a valid session token in their cookies
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Same as the function above kinda.
  checkIfNavDropDownIsOpen = () => {
    if (this.state.isNavDropDownOpen === true) {
      this.setState({ isNavDropDownOpen: false });
    } else {
      this.setState({ isNavDropDownOpen: true });
    }
  };

  // Yeah
  closeNavDropDownOnFocus = () => {
    this.setState({ isNavDropDownOpen: false });
  };

  // Function(1/3) to take the email input from the register & and update the state
  // depending on what the user types in.
  updateEmail = (input) => {
    this.setState({ email: input });
  };

  // Function(2/3)
  updatePass = (input) => {
    this.setState({ password: input });
  };

  // Function(3/3)
  updatePass2 = (input) => {
    this.setState({ password2: input });
  };

  checkIfPhotoCardIsOpen = () => {
    if (this.state.isPhotoCardOpen === true) {
      this.setState({ isPhotoCardOpen: false });
    } else if (this.state.isPhotoCardOpen === false) {
      this.setState({ isPhotoCardOpen: true });
    }
  };

  updateNewName = (input) => {
    this.setState({ newName: input });
    console.log(this.state.newName + "testing");
  };

  updateNewBio = (input) => {
    this.setState({ newBio: input });
  };

  updateNewPhone = (input) => {
    this.setState({ newPhone: input });
  };

  updateNewEmail = (input) => {
    this.setState({ newEmail: input });
  };

  updateNewPassword = (input) => {
    this.setState({ newPassword: input });
  };

  submitUpdateInfo = async () => {
    // this function will update the users info in the database from the states of the inputs
    // and then it will update the state of the userInfo to the new info.
    try {
      const response = await axios.put(
        "http://209.192.200.84:5000/api/users/update",
        {
          newProfilePicture: this.state.previewProfilePicture,
          newName: this.state.newName,
          newBio: this.state.newBio,
          newPhone: this.state.newPhone,
          newEmail: this.state.newEmail,
          newPassword: this.state.newPassword,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      this.getUserInfo();
      window.location.replace("http://209.192.200.84:3000/auth/profile");
    } catch (error) {
      console.error(error.response.data);
    }
  };

  closeErrMsg = () => {
    console.log("clicked");
    this.setState({
      registerError: false,
      registerErrorMsg: [],
      loginError: false,
      loginErrorMsg: [],
    });
  };

  twitterAuth = async () => {
    window.open("http://209.192.200.84:5000/api/users/auth/twitter", "_self");
  };

  // Where the project is rendered, also deals with routing & loading screen
  // (should just make a loading component.) in here.
  render() {
    // Create a router with the routes I want to use.
    const router = createBrowserRouter([
      {
        path: "/auth",
        element: (
          <Register
            updateEmail={this.updateEmail}
            updatePass={this.updatePass}
            updatePass2={this.updatePass2}
            registerUserFunction={this.registerUser}
            registerError={this.state.registerError}
            registerErrorMsg={this.state.registerErrorMsg}
            closeErrMsg={this.closeErrMsg}
            twitterAuth={this.twitterAuth}
          />
        ),
      },
      {
        path: "/auth/signin",
        element: (
          <Signin
            loginUser={this.loginUser}
            updateEmail={this.updateEmail}
            updatePass={this.updatePass}
            twitterAuth={this.twitterAuth}
            loginError={this.state.loginError}
            closeErrMsg={this.closeErrMsg}
            loginErrorMsg={this.state.loginErrorMsg}
          />
        ),
      },
      {
        path: "/auth/profile",
        element: (
          <ProtectedRouteProfile
            userInfo={this.state.userInfo}
            isNavDropDownOpen={this.state.isNavDropDownOpen}
            checkIfNavDropDownIsOpen={this.checkIfNavDropDownIsOpen}
            signOutUser={this.signOutUser}
            closeNavDropDownOnFocus={this.closeNavDropDownOnFocus}
            isLoggedIn={this.state.isLoggedIn}
            path="/profile"
          >
            <Profile />
          </ProtectedRouteProfile>
        ),
      },
      {
        path: "/auth/settings",
        element: (
          <ProtectedRouteSettings
            userInfo={this.state.userInfo}
            isNavDropDownOpen={this.state.isNavDropDownOpen}
            checkIfNavDropDownIsOpen={this.checkIfNavDropDownIsOpen}
            signOutUser={this.signOutUser}
            closeNavDropDownOnFocus={this.closeNavDropDownOnFocus}
            isLoggedIn={this.state.isLoggedIn}
            isPhotoCardOpen={this.state.isPhotoCardOpen}
            checkIfPhotoCardIsOpen={this.checkIfPhotoCardIsOpen}
            handleProfilePictureChange={this.handleProfilePictureChange}
            previewProfilePicture={this.state.previewProfilePicture}
            updateNewName={this.updateNewName}
            updateNewBio={this.updateNewBio}
            updateNewPhone={this.updateNewPhone}
            updateNewEmail={this.updateNewEmail}
            updateNewPassword={this.updateNewPassword}
            submitUpdateInfo={this.submitUpdateInfo}
            path="/auth/settings"
          >
            <Settings
              userInfo={this.state.userInfo}
              isNavDropDownOpen={this.state.isNavDropDownOpen}
              checkIfNavDropDownIsOpen={this.checkIfNavDropDownIsOpen}
              signOutUser={this.signOutUser}
              closeNavDropDownOnFocus={this.closeNavDropDownOnFocus}
              isLoggedIn={this.state.isLoggedIn}
              isPhotoCardOpen={this.state.isPhotoCardOpen}
              checkIfPhotoCardIsOpen={this.checkIfPhotoCardIsOpen}
              handleProfilePictureChange={this.handleProfilePictureChange}
              previewProfilePicture={this.state.previewProfilePicture}
              updateNewName={this.updateNewName}
              updateNewBio={this.updateNewBio}
              updateNewPhone={this.updateNewPhone}
              updateNewEmail={this.updateNewEmail}
              updateNewPassword={this.updateNewPassword}
              submitUpdateInfo={this.submitUpdateInfo}
              path="/auth/settings"
            />
          </ProtectedRouteSettings>
        ),
      },
    ]);

    // If the app is loaded, return the router. Else, return a loading screen.
    if (this.state.isLoaded === true) {
      // returning content of the app with the theme in the class.
      return (
        <div className={`App ${this.state.theme}`}>
          <RouterProvider router={router} />
        </div>
      );
    } else {
      // returning a loading screen.
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <p style={{ paddingTop: "2rem" }}>Loading, please be paitent.</p>
        </div>
      );
    }
  }
}

export default App;
