import React from "react";
import InputVacinas from "./inputVacina";

export default function InputVacina() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center w-full">
          <div className="col-start-1 row-start-2">
            <InputVacinas />
          </div>
        </div>
      </div>
    </div>
  );
}
