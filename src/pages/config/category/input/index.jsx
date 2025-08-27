import React from "react";
import InputCategorys from "./inputCategory";

function InputCategory() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center w-full">
          <div className="col-start-1 row-start-2">
            <InputCategorys />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputCategory;
