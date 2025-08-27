import React from 'react';
import { NumericFormat } from 'react-number-format';

const InputComSinal = ({ value, onChange }) => {
  const handleChange = (values) => {
    let val = values.value;

    // Adiciona o sinal "+" automaticamente se o valor for positivo e não começar com um sinal
    if (val && !val.startsWith('-')) {
      val = `+${val}`;
    }

    onChange(val);
  };

  return (
    <NumericFormat
      value={value}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2} // Define duas casas decimais
      fixedDecimalScale={true} // Mantém duas casas decimais mesmo que zeros finais sejam removidos
      allowNegative={true} // Permite valores negativos
      onValueChange={handleChange}
      displayType="input" // Exibe como um input
      prefix={value && !value.startsWith('-') ? '+' : ''} // Adiciona prefixo "+" se necessário
    />
  );
};

export default InputComSinal;
