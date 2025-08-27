import React from "react";
import UrinarioPut from "./UrinarioPut";

export default function PutUrinario() {
    return (

        <div className="flex ">
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col mt-1 items-center w-full">
                    <div className="col-start-1 row-start-2">
                        <UrinarioPut />
                    </div>
                </div>
            </div>
        </div>
    );
}