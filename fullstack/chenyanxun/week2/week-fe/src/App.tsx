import { RouterProvider } from "react-router-dom";
import routerConfig from "./router/index"
function App() {
  return (
    <RouterProvider router={routerConfig}></RouterProvider>
  );
}

export default App;
