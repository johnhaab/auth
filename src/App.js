import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./util/ProtectedRoute";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";

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
      name: "",
      email: "",
      password: "",
      password2: "",
      registerError: false,
      registerErrorMsg: [],
      userInfo: null,
      isNavDropDownOpen: false,
    };
  }

  // Function get ran in here every time the component mounts aka everytime the website loads.
  componentDidMount = async () => {
    this.setState({
      isLoaded: true,
    });
    this.getUserInfo();
    this.checkIfUserIsLoggedIn();
    //this.checkSessionToken();
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
      .post("http://localhost:5000/api/users/register", data, config)
      .then((response) => {
        // Handle success
        console.log(response.data);
        window.location.replace("http://localhost:3000/signin");
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
      .post("http://localhost:5000/api/users/login", data, config, {
        withCredentials: true,
      })
      .then(async (response) => {
        console.log("successfull login!");

        // This is the api call that fetches the users info from the backend.
        try {
          const response = await axios.get(
            "http://localhost:5000/api/users/profile",
            {
              withCredentials: true, // Include the session token cookie in the request
            }
          );

          const userProfile = response.data;
          console.log("loginUser", userProfile);
          this.setState({ userInfo: userProfile });
          this.setState({ isLoggedIn: true });
          window.location.replace("http://localhost:3000/profile");
        } catch (error) {
          console.error(error.response.data);
        }
      })

      .catch((error) => {
        console.log("error!" + error);
      });
  };

  // Function that signs the user out, it removes the token from localStorage
  // and then redirects the user to the signin page.
  signOutUser = async () => {
    console.log("signOutUser");
    await axios
      .get("http://localhost:5000/api/users/auth/logout", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        localStorage.removeItem("signedIn");
        window.location.replace("http://localhost:3000/signin");
      })
      .catch((error) => {});
  };

  checkSessionToken = async () => {
    const token = Cookies.get("sessionToken");
    const expirationTime = Cookies.get("sessionExpiration");

    if (token && expirationTime && Date.now() < Number(expirationTime)) {
      console.log("Token is valid");
      return true;
    } else {
      console.log("Token is invalid");
      this.setState({ isLoggedIn: false });
      Cookies.remove("sessionToken");
      localStorage.removeItem("signedIn");
      return false;
    }
  };

  // Function to check if the user is logged in, the way I am doing that
  // is by checking if the token is in localStorage and if it is, then
  // it makes a request to the database to get the user info and then
  // sets the state of userInfo to the response data.
  getUserInfo = async () => {
    // Fetch user info using token
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          withCredentials: true, // Include the session token cookie in the request
        }
      );

      const userProfile = response.data;
      console.log("getUserInfo", userProfile);
      this.setState({ userInfo: userProfile });
      this.setState({ isLoggedIn: true });
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
      const response = await axios.get("http://localhost:5000/api/users/auth", {
        withCredentials: true,
      });
      const { isAuthenticated } = response.data;
      console.log(isAuthenticated);

      if (isAuthenticated) {
        // The user has a valid session token in their cookies
        this.setState({ isLoggedIn: true });
        localStorage.setItem("signedIn", "true");
        await this.getUserInfo();
        console.log("user is logged in!");
        if (window.location.pathname !== "/profile") {
          window.location.replace("http://localhost:3000/profile");
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

  checkIfNavDropDownIsOpen = () => {
    if (this.state.isNavDropDownOpen === true) {
      this.setState({ isNavDropDownOpen: false });
    } else {
      this.setState({ isNavDropDownOpen: true });
    }
  };

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

  // Where the project is rendered, also deals with routing & loading screen
  // (should just make a loading component.) in here.
  render() {
    // Create a router with the routes I want to use.
    const router = createBrowserRouter([
      {
        path: "/",
        element: (
          <Register
            updateEmail={this.updateEmail}
            updatePass={this.updatePass}
            updatePass2={this.updatePass2}
            registerUserFunction={this.registerUser}
            registerError={this.state.registerError}
            registerErrorMsg={this.state.registerErrorMsg}
          />
        ),
      },
      {
        path: "/signin",
        element: (
          <Signin
            loginUser={this.loginUser}
            updateEmail={this.updateEmail}
            updatePass={this.updatePass}
          />
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute
            userInfo={this.state.userInfo}
            isNavDropDownOpen={this.state.isNavDropDownOpen}
            checkIfNavDropDownIsOpen={this.checkIfNavDropDownIsOpen}
            signOutUser={this.signOutUser}
            closeNavDropDownOnFocus={this.closeNavDropDownOnFocus}
            isLoggedIn={this.state.isLoggedIn}
            path="/profile"
          >
            <Profile />
          </ProtectedRoute>
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
