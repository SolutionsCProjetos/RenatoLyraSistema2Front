import React from 'react';

const InputComGrau = ({ value, onChange, className }) => {
  const handleChange = (e) => {
    let val = e.target.value;

    // Remove o símbolo de grau caso já exista para evitar duplicação
    val = val.replace(/°/g, '');

    // Adiciona o símbolo de grau ao final do valor
    if (val) {
      val = `${val}°`;
    }

    onChange(val);
  };

  return (
    <input 
      type="text" 
      value={value} 
      onChange={handleChange} 
      className={className} 
    />
  );
};

export default InputComGrau;
