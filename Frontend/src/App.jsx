import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Chat from "./components/Chat";
import Dashboard from "./components/Dashboard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path:"/signup",
      element:<Signup/>
    },
    {
      path:"/login",
      element:<Login/>
    },
    {
      path: "/chat",
      element: <Chat />
    },
    {
      path:"/admin/dashboard",
      element:<Dashboard/>
    }
  ]);

  return <>
  <RouterProvider router={router}/>
  </>;
}

export default App;
