import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Contract from "./pages/Contract";
import NaviBar from "./components/navi-bar";
import SignContract from "@/pages/SignContract.tsx";
import UploadRecord from "@/pages/UploadRecord.tsx";
import AuditRecord from "@/pages/AuditRecord.tsx";

function App() {
    return (
        <Router>
            <div className="bg-background">
                <NaviBar/>
                <Routes>
                    <Route path="/createContract" element={<Contract/>}/>
                    <Route path="/signContract" element={<SignContract/>}/>
                    <Route path="/uploadRecord" element={<UploadRecord/>}/>
                    <Route path="/auditRecord" element={<AuditRecord/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
