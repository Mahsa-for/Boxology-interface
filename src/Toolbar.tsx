import React from 'react';
import './Toolbar.css';

interface ToolbarProps {
  onOpen: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAbout: () => void;
}

export default function Toolbar({
  onOpen,
  onSave,
  onUndo,
  onRedo,
  onAbout,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <span onClick={onOpen}>Open</span>
        <span onClick={onSave}>Save</span>
        <span onClick={onUndo}>Undo</span>
        <span onClick={onRedo}>Redo</span>
        <span onClick={onAbout}>About</span>
      </div>
    </div>
  );
}
