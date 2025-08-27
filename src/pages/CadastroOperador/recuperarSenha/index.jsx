import React from "react";
import PassPut from "./PasswordPut";

function Recuperar() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center w-full">
          <div className="col-start-1 row-start-2">
            <PassPut />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recuperar;
