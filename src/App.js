import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register/Register";
import Signin from "./pages/Signin/Signin";
import Profile from "./pages/Profile/Profile";

import "./App.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      theme: "light",
      data: [],
      error: null,
    };
  }

  componentDidMount = async () => {
    // Get data from the backend.
    await this.getData();
  };

  // Function to toggle between light and dark mode.
  toggleTheme = () => {
    if (this.state.theme === "light") {
      this.setState({ theme: "dark" });
    } else {
      this.setState({ theme: "light" });
    }
  };

  // Function to get data from the Backend.
  getData = () => {
    console.log("Getting data from the backend");
    return fetch("http://localhost:5000/user")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ data: data[0] });
        console.log(this.state.data);
        // Clear loading screen after needed info is loaded.
        this.setState({
          isLoaded: true,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: err });
      });
  };

  render() {
    // Create a router with the routes I want to use.
    const router = createBrowserRouter([
      // {
      //   path: "/",
      //   element: <Register />,
      // },
      // {
      //   path: "/",
      //   element: <Signin />,
      // },
      {
        path: "/",
        element: <Profile user={this.state.data} />,
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
