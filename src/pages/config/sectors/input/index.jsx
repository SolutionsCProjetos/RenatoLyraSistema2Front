import React from "react";
import InputSector from "./inputSectors";

export default function InputSectors() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center w-full">
          <div className="col-start-1 row-start-2">
            <InputSector />
          </div>
        </div>
      </div>
    </div>
  );
}
