import React from "react";
import ReactDOM from "react-dom/client";
// 1. Ubah import ini dari App ke OrderPage
import OrderPage from "./OrderPage"; 
import "./index.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 2. Ubah render ini dari App ke OrderPage */}
    <OrderPage />
  </React.StrictMode>
);
