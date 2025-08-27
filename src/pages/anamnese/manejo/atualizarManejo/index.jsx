import React from "react";
import ManejoPut from "./ManejoPut";

export default function Parceiro() {
    return (
        <div className="flex ">
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col mt-1 items-center w-full">
                    <div className="col-start-1 row-start-2">
                        <ManejoPut />
                    </div>
                </div>
            </div>
        </div>
    );
}