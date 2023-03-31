import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register/Register";

import "./App.scss";
import Signin from "./pages/Signin/Signin";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      theme: "light",
    };
  }

  // Function to toggle between light and dark mode.
  toggleTheme = () => {
    if (this.state.theme === "light") {
      this.setState({ theme: "dark" });
    } else {
      this.setState({ theme: "light" });
    }
  };

  componentDidMount() {
    // WIP: Add a loading screen.
    this.setState({
      isLoaded: true,
    });
  }

  render() {
    // Create a router with the routes I want to use.
    const router = createBrowserRouter([
      // {
      //   path: "/",
      //   element: <Register />,
      // },
      {
        path: "/",
        element: <Signin />,
      },
    ]);

    // If the app is loaded, return the router. Else, return a loading screen.
    if (this.state.isLoaded === true) {
      return (
        <div className={`App ${this.state.theme}`}>
          <RouterProvider router={router} />
        </div>
      );
    } else {
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
