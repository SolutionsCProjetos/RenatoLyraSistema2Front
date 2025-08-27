import React from "react";
import NavConfig from "../layout/NavConfig";

export default function Config() {
    return (
        <div className="flex">

            {/* Container que ocupa o restante da largura */}
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col mt-2 items-center w-full">
                    <div className="col-start-1 row-start-2">
                        <h2 className="text-2xl ml-6">Configuração</h2>
                        <NavConfig />
                    </div>

                </div>
            </div>
        </div>
    );
}
