// index.js
import React from "react";
import NavPets from "../../layout/NavPets";

export default function Index() {
    return (
        <div className="flex">
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col items-center w-full">
                    <h1 className="text-2xl font-bold mb-1">Gerenciamento dos pets</h1>
                    <NavPets />
                </div>
            </div>
        </div>
    );
}
