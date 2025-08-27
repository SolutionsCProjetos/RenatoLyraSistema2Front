import React from "react";
import InputClient from "./inputClient";

export default function Cliente() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center">
          <div className="col-start-1 row-start-2">
            <InputClient />
          </div>
        </div>
      </div>
    </div>
  );
}
