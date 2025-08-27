import React from "react";
import InputExame from "./inputExame";

export default function Parceiro() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center">
          <div className="col-start-1 row-start-2">
            <InputExame />
          </div>
        </div>
      </div>
    </div>
  );
}
