import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const SIZE_PRESETS = {
  sm: '480px',
  md: '640px',
  lg: '880px',
  xl: '1060px'
};

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  icon: Icon, 
  children, 
  size = 'md', 
  maxWidth 
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resolvedMaxWidth = maxWidth || SIZE_PRESETS[size] || '640px';

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className={`modal-container modal-size-${size}`} 
        style={{ maxWidth: resolvedMaxWidth }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-header-left">
            {Icon && (
              <div className="modal-header-icon-box">
                <Icon size={18} />
              </div>
            )}
            <div>
              <h3 className="modal-title">{title}</h3>
              {subtitle && <p className="modal-subtitle">{subtitle}</p>}
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose} 
            title="Close dialog (Esc)"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}


