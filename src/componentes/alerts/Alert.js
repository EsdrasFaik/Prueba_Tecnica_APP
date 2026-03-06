import React from "react";

const Alert = ({ title, subtitle, message, type = "bg-danger", onClose }) => {
  return (
    <div className={`toast ${type} fade show`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="toast-header">
        <strong className="mr-auto">{title}</strong>
        <small>{subtitle}</small>
        <button 
          data-dismiss="toast" 
          type="button" 
          className="ml-2 mb-1 close" 
          aria-label="Close"
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

export default Alert;
