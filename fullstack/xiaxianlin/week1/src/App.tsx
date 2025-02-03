import Account from "./routes/account";
import Home from "./routes/home";
import Root from "./routes/root";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Task1 from "./routes/task1";
import { AppModel } from "./models/app_model";

export default function App() {
  return (
    <AppModel.Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<Home />} />
            <Route path="account" element={<Account />} />
            <Route path="task1" element={<Task1 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppModel.Provider>
  );
}
