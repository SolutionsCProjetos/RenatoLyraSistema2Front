import React from "react";
import InputTegumenta from "./inputTegumenta";

export default function Tegumenta() {
    return (
        <div className="flex ">
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col mt-1 items-center">
                    <div className="col-start-1 row-start-2">
                        <InputTegumenta />
                    </div>
                </div>
            </div>
        </div>
    );
}