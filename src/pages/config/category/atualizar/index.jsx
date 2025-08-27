import React from "react";
import PutCategorys from "./uptadeCategorys";

export default function updateCategorys() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center w-full">
          <div className="col-start-1 row-start-2">
            <PutCategorys />
          </div>
        </div>
      </div>
    </div>
  );
}
