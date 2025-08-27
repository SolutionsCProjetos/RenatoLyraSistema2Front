import React from "react";
import CadastroPut from "./ReceberPut";

function Receberput() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-2 items-center w-full">
          <div className="col-start-1 row-start-2">
            <CadastroPut />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Receberput;
