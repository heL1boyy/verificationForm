import "./App.css";
import Success from "./Success";
import VerificationForm from "./VerificationForm";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VerificationForm />} />

          <Route path="/success" element={<Success />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
