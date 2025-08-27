import React from "react";
import PutComercio from "./uptadeComercio";

export default function UpdateComercio() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center w-full">
          <div className="col-start-1 row-start-2">
            <PutComercio />
          </div>
        </div>
      </div>
    </div>
  );
}
