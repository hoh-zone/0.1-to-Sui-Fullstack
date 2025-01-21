import { createBrowserRouter } from "react-router-dom";
import Index from "../pages/Index"
import User from "../pages/User"

const router = createBrowserRouter([
    {
        path: '/',
        element: <Index />
    },
    {
        path: "user",
        element: <User />
    }
])

export default router