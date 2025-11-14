import React from "react";
import ReactDOM from "react-dom/client";
import OrderPage from "./OrderPage.jsx";

import "./index.css";
// ...

import "./index.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 2. Ubah render ini dari App ke OrderPage */}
    <OrderPage />
  </React.StrictMode>
);


