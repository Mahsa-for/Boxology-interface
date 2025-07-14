import React from 'react';
import './Toolbar.css';

interface ToolbarProps {
  onOpen: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAbout: () => void;
  onValidate: () => void;
}

export default function Toolbar({
  onOpen,
  onSave,
  onUndo,
  onRedo,
  onAbout,
  onValidate,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <span onClick={onOpen}>Open</span>
        <span onClick={onSave}>Save</span>
        <span onClick={onUndo}>Undo</span>
        <span onClick={onRedo}>Redo</span>
        <span onClick={onAbout}>About</span>
        <button
          style={{
            marginLeft: 10,
            padding: '5px 10px',
            border: '1px solid #000',
            background: '#4CAF50',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          onClick={onValidate}
        >
          Validate Pattern
        </button>
      </div>
    </div>
  );
}
