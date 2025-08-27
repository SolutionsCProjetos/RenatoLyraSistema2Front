import React from "react";
import InputNeurologico from "./inputNeurologico";

export default function Neurologico() {
    return (
        <div className="flex ">
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col mt-1 items-center">
                    <div className="col-start-1 row-start-2">
                        <InputNeurologico />
                    </div>
                </div>
            </div>
        </div>
    );
}