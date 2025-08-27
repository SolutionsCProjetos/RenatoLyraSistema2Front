import React from "react";
import NeurologicoPut from "./NeurologicoPut";

export default function Neurologico() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center w-full">
          <div className="col-start-1 row-start-2">
            <NeurologicoPut />
          </div>
        </div>
      </div>
    </div>
  );
}
