import React from "react";
import InputList from "./inputPet";

export default function PetCad() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-6 items-center w-full">
          <div className="col-start-1 row-start-2">
            <InputList />
          </div>
        </div>
      </div>
    </div>
  );
}
