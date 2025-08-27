import React from "react";
import PutRaca from "./uptadeRaca"

export default function updateRaca() {
    return (
        <div className="flex ">
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col mt-1 items-center w-full">
                    <div className="col-start-1 row-start-2">
                        <PutRaca />
                    </div>
                </div>
            </div>
        </div>
    )
}