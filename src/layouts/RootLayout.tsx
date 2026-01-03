import React from "react";
import { Outlet } from "react-router-dom";

const RootLayout: React.FC = () => {
  return (
    <div className="bg-green-50 min-h-screen">
      <Outlet />
    </div>
  );
};

export default RootLayout;
