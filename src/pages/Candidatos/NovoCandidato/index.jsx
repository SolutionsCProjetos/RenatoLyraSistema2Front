import React from "react";
import CandidatoInput from "./inputCandidato";

export default function Candidato() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center">
          <div className="col-start-1 row-start-2">
            <CandidatoInput />
          </div>
        </div>
      </div>
    </div>
  );
}
