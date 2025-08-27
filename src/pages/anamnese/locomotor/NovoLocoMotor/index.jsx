import React from "react";
import InputLocomotor from "./inputLocomotor";

export default function LocoMotor() {
    return (
        <div className="flex ">
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col mt-1 items-center">
                    <div className="col-start-1 row-start-2">
                        <InputLocomotor />
                    </div>
                </div>
            </div>
        </div>
    );
}