// index.js
import React from "react";
import Navcliente from "../../layout/NavTCliente";

export default function Index() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center w-full">
          <h1 className="text-2xl font-bold mb-1">Gerenciamento do tutor</h1>
          <Navcliente />
        </div>
      </div>
    </div>
  );
}
