import React from "react";
import InputUrinario from "./inputUrinario";

export default function Urinario() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center">
          <div className="col-start-1 row-start-2">
            <InputUrinario />
          </div>
        </div>
      </div>
    </div>
  );
}
