import React from "react";
import img1 from "./data/success1.jpg";

export default function BasicAlerts() {
  return (
    <div className="flex justify-center items-center h-screen bg-[#efefef]">
      <div className="relative">
        <div className="w-96 h-96 bg-[#efefef]">
          <img
            src={img1}
            alt="Success"
            className="w-full h-full object-cover "
          />
        </div>
        <p className="text-center mb-4 text-3xl uppercase text-green-400">
          Success
        </p>
      </div>
    </div>
  );
}
