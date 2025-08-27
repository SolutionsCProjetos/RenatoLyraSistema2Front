import React from "react";
import PutVacina from "./uptadeVacina"

export default function updateVacina() {
    return (
        <div className="flex ">
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col mt-1 items-center w-full">
                    <div className="col-start-1 row-start-2">
                        <PutVacina />
                    </div>
                </div>
            </div>
        </div>
    )
}