import React from "react";
import InputRaca from "./inputRacas";

export default function InputRacas() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center w-full">
          <div className="col-start-1 row-start-2">
            <InputRaca />
          </div>
        </div>
      </div>
    </div>
  );
}
