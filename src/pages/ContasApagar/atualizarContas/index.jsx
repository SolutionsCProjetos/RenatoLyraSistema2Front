import React from "react";
import ContasApagarPut from "./ContasPut";

function ContaPut() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center w-full">
          <div className="col-start-1 row-start-2 ">
            <ContasApagarPut />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContaPut;
