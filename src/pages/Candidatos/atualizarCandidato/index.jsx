import React from "react";
import CandidatoPut from "./candidatoPut";

export default function Candidato() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 mb-8 items-center w-full">
          <div className="col-start-1 row-start-2">
            <CandidatoPut />
          </div>
        </div>
      </div>
    </div>
  );
}
