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
    if (localStorage.getItem("token")) {
      this.getUserInfo();
    }
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
        console.log(this.state.userInfo);
        console.log("1");
      })
      .catch((error) => {
        console.log("Error fetching user info: " + error);
      });
  };

  // Function to get data from the Backend.
  getData = () => {};

  updateEmail = (input) => {
    this.setState({ email: input });
    console.log(input);
  };

  updatePass = (input) => {
    this.setState({ password: input });
    console.log(input);
  };

  updatePass2 = (input) => {
    this.setState({ password2: input });
  };

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
