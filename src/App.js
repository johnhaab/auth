import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./util/ProtectedRoute";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";

import "./App.scss";
import axios from "axios";
import Signin from "./pages/Signin/Signin";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
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
    };
  }

  componentDidMount = async () => {
    this.setState({
      isLoaded: true,
    });
    this.getUserInfo();
    this.checkIfUserIsLoggedIn();
    // this.signOutUser();
  };

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
    };

    await axios
      .post("http://localhost:5000/api/users/login", data, config)
      .then(async (response) => {
        console.log("success!");
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        const badToken = response.data.token;
        const token = badToken.split(" ")[1];

        // This is the api call that fetches the users info from the backend.
        await axios;
        axios
          .get(`http://localhost:5000/api/users/profile?token=${token}`)
          .then((response) => {
            const {
              id,
              name,
              email,
              bio,
              password,
              phoneNumber,
              joinedDate,
              profilePicture,
            } = response.data;
            this.setState({
              userInfo: {
                id,
                name,
                email,
                bio,
                password,
                phoneNumber,
                joinedDate,
                profilePicture,
              },
            });
            window.location.replace("http://localhost:3000/profile");
          })
          .catch((error) => {
            console.log("Error fetching user info: " + error);
          });
        console.log(this.state.userInfo);
      })

      .catch((error) => {
        console.log("error!" + error);
        // Handle failure
        // const errorMessages = Object.values(error.response.data);
        // this.setState({
        //   registerError: true,
        //   registerErrorMsg: errorMessages,
        // });
        // console.log(this.state.registerErrorMsg);
      });
  };

  // Function that signs the user out, it removes the token from localStorage
  // and then redirects the user to the signin page.
  signOutUser = async () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      window.location.replace("http://localhost:3000/signin");
    }
  };

  // Function to check if the user is logged in, the way I am doing that
  // is by checking if the token is in localStorage and if it is, then
  // it makes a request to the database to get the user info and then
  // sets the state of userInfo to the response data.
  getUserInfo = async () => {
    const badToken = localStorage.getItem("token");
    const token = badToken.split(" ")[1];
    console.log("your token " + token);

    // Fetch user info using token
    await axios;
    axios
      .get(`http://localhost:5000/api/users/profile?token=${token}`)
      .then((response) => {
        const {
          id,
          name,
          email,
          bio,
          password,
          phoneNumber,
          joinedDate,
          profilePicture,
        } = response.data;
        this.setState({
          userInfo: {
            id,
            name,
            email,
            bio,
            password,
            phoneNumber,
            joinedDate,
            profilePicture,
          },
        });
        console.log("sucessfully fetched user info!");
      })
      .catch((error) => {
        console.log("Error fetching user info: " + error);
      });
  };

  // Function to check if the user is logged in, the way I am doing that
  // is checking if the user has a token or "session id" in thier local
  // storage and depending on if they do they get logged in and redirected
  // to /profile and can view their info if there is no token it will redirect
  // to / which is the register page.
  checkIfUserIsLoggedIn = () => {
    if ("token" in localStorage) {
      if (window.location.href !== "http://localhost:3000/profile") {
        window.location.replace("http://localhost:3000/profile");
      }
    } else {
      if (window.location.href !== "http://localhost:3000/") {
        window.location.replace("http://localhost:3000/");
      }
    }
  };

  // Function(1/3) to take the email input from the register & and update the state
  // depending on what the user types in.
  updateEmail = (input) => {
    this.setState({ email: input });
    console.log(input);
  };

  // Function(2/3)
  updatePass = (input) => {
    this.setState({ password: input });
    console.log(input);
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
          <ProtectedRoute userInfo={this.state.userInfo}>
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
