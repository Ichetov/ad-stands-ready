import { createBrowserRouter } from "react-router";
import HomePage from "../App";




export const router = createBrowserRouter([
    {
    path: '/',
    element: <HomePage />
  },
])