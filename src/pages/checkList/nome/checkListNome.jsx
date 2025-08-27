import React from "react";
import PropTypes from 'prop-types';

export default function CheckListNome({ types, descricao, placeholderInput, value, readOnly, onChange, menssagemError, inputComponent }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  } 

  return (
    <div className="flex items-center "> {/* Removido mb-0 */}
      <label className="block w-full">
        <span className="block text-sm font-medium text-slate-700 w-full">{descricao}</span>
        {inputComponent ? inputComponent : (
          <input
            type={types}
            placeholder={placeholderInput}
            value={value}
            readOnly={readOnly}  /* Utiliza readOnly aqui */
            onChange={onChange && !readOnly ? handleChange : undefined}  /* Adapta o onChange conforme readOnly */
            className="mt-1  block px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50
              disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500
              invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
          />
        )}
      </label>
    </div>
  );
}

CheckListNome.propTypes = {
  types: PropTypes.string.isRequired,
  descricao: PropTypes.string.isRequired,
  placeholderInput: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  readOnly: PropTypes.bool,  // Adiciona a propriedade readOnly como booleana
  onChange: PropTypes.func,  // Mantém onChange como opcional
  menssagemError: PropTypes.string,
  inputComponent: PropTypes.element,
};


