// components/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  // Use navigate with a callback to ensure clean URL transitions
  const handleGoBack = () => {
    const currentUrl = window.location.href;

    // Remove trailing question mark if exists
    if (currentUrl.endsWith('?')) {
      navigate(currentUrl.slice(0, -1), { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      className="bg-orange-400 py-1 px-16 mt-4 mx-1.5 rounded hover:bg-orange-500 duration-300"
      onClick={handleGoBack}
    >
      <p className="block text-sm font-medium text-slate-100">Voltar</p>
    </button>
  );
};

export default BackButton;
