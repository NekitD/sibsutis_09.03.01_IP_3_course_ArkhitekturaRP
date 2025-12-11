import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from "./Application.js";
import Name from "./MyName.jsx";

export default function Rou() {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/name" element={<Name />} />
          </Routes>
        </BrowserRouter>
      );
}
