import React from "react";
import InputGastro from "./inputGastro";

export default function Gastro() {
    return (
        <div className="flex ">
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col mt-1 items-center">
                    <div className="col-start-1 row-start-2">
                        <InputGastro />
                    </div>
                </div>
            </div>
        </div>
    );
}