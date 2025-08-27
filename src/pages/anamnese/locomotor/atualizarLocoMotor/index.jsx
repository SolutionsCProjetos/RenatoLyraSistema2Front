import React from "react";

import LocoMotorPut from "./LocoMotorPut";

export default function LocoMotor() {
    return (
                <div className="flex flex-col mt-1 mb-8 items-center w-full">
                    <div className="col-start-1 row-start-2">
                        <LocoMotorPut />
                    </div>
                </div>
    );
}