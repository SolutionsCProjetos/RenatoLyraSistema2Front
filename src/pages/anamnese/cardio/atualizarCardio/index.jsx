import React from "react";
import CardioPut from "./CardioPut";

export default function Cardio() {
    return (
        <div className="flex ">
            {/* Container que ocupa o restante da largura */}
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col mt-1 items-center w-full">
                    <div className="col-start-1 row-start-2">
                        <CardioPut />
                    </div>
                </div>
            </div>
        </div>
    );
}