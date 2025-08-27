import DemandaInput from "./inputDemanda";

export default function Demanda() {
  return (
    <div className="flex ">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-1 items-center">
          <div className="col-start-1 row-start-2">
            <DemandaInput />
          </div>
        </div>
      </div>
    </div>
  );
}
