import React from 'react';

interface ErrorMessageProps {
  error?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error = 'unknown error.' }) => (
  <p className="text-center my-4">Error: {error}</p>
);

export default ErrorMessage;
