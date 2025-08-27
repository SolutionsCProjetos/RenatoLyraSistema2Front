import React from "react";
import InputComercio from "./inputComercio";

export default function IndexComercio() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center w-full">
          <div className="col-start-1 row-start-2">
            <InputComercio />
          </div>
        </div>
      </div>
    </div>
  );
}
