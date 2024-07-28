import React from "react";
import ProductTable from "./components/ProductTable";
import UserTable from "./components/UserTable";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Admin Dashboard</h1>
      <UserTable />
      <ProductTable />
    </div>
  );
}

export default App;
