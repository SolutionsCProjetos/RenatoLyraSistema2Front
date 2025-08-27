import SolicitanteInput from "./inputSolicitante";

export default function Solicitante() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center">
          <div className="col-start-1 row-start-2">
            <SolicitanteInput />
          </div>
        </div>
      </div>
    </div>
  );
}
