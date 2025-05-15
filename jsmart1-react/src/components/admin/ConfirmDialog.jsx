import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/admin/ConfirmDialog.css';

/**
 * A reusable confirmation dialog component
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the dialog
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {string} props.confirmText - Text for confirm button
 * @param {string} props.cancelText - Text for cancel button
 * @param {Function} props.onConfirm - Function to call when confirmed
 * @param {Function} props.onCancel - Function to call when canceled
 * @param {string} props.confirmIcon - FontAwesome icon for confirm button
 * @param {string} props.confirmButtonClass - CSS class for confirm button
 */
const ConfirmDialog = ({
  show,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmIcon = 'check',
  confirmButtonClass = 'btn-primary'
}) => {
  if (!show) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-dialog-header">
          <h3>{title}</h3>
          <button 
            type="button" 
            className="close-button" 
            onClick={onCancel}
            aria-label="Close"
          >
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
        
        <div className="confirm-dialog-body">
          <p>{message}</p>
        </div>
        
        <div className="confirm-dialog-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
          >
            <FontAwesomeIcon icon="times" /> {cancelText}
          </button>
          
          <button 
            type="button" 
            className={`btn ${confirmButtonClass}`} 
            onClick={onConfirm}
          >
            <FontAwesomeIcon icon={confirmIcon} /> {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
