// index.js
import React from "react";
import HeaderHorizontal from "../../layout/HeaderHorizontal";

export default function Index() {
  return (
    <div className="flex">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl">Anamnese</h2>
          <NavAmenese />
        </div>
      </div>
    </div>
  );
}
