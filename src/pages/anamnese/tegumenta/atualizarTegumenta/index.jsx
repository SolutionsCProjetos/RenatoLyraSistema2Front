import React from "react";
import TegumentaPut from "./TegumentaPut";

export default function PutTegumenta() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1  items-center w-full">
          <div className="col-start-1 row-start-2">
            <TegumentaPut />
          </div>
        </div>
      </div>
    </div>
  );
}
