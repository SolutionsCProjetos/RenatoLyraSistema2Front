import { useState } from "react";

function useMensagem() {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const showErrorMessage = (message) => {
    setErrorMessage(typeof message === 'string' ? message : JSON.stringify(message));
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const showWarningMessage = (message) => {
    setWarningMessage(typeof message === 'string' ? message : JSON.stringify(message));
    setTimeout(() => {
      setWarningMessage(null);
    }, 5000);
  };

  return {
    successMessage,
    errorMessage,
    warningMessage,
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage
  };
}

export default useMensagem;