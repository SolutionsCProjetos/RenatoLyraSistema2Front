import React from "react";
import HeaderVertical from "../../layout/Header";
import HeaderHorizontal from "../../layout/HeaderHorizontal";
import CandidatoPut from "./candidatoPut";

export default function Candidato() {
    return (
        <div className="flex ">
            {/* Header vertical (fixo à esquerda) */}
            <HeaderVertical />

            {/* Container que ocupa o restante da largura */}
            <div className="flex flex-col flex-grow">
                {/* Header horizontal que fica ao lado do Header vertical */}
                <HeaderHorizontal />
                <div className="flex flex-col mt-1 mb-8 items-center w-full">
                    <div className="col-start-1 row-start-2">
                        <CandidatoPut />
                    </div>
                </div>
            </div>
        </div>
    );
}