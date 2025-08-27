import React from "react";
import AtividadeForm from "./inputOperacao";

function Produto() {
    return (
        <div className="flex">
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col mt-20 items-center w-full">
                    <div className="col-start-1 row-start-2 ">
                        <AtividadeForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Produto;