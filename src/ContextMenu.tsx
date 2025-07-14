import React from 'react';

interface ContextMenuProps {
  contextMenu: { x: number; y: number } | null;
  containers: string[];
  onMove: (container: string | null) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ contextMenu, containers, onMove }) => {
  if (!contextMenu) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: contextMenu.x,
        top: contextMenu.y,
        background: '#fff',
        border: '1px solid #ccc',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 100,
        padding: 8,
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: 6 }}>Move to Container:</div>
      {containers.map(container => (
        <div
          key={container}
          style={{ cursor: 'pointer', padding: '4px 8px' }}
          onClick={() => onMove(container)}
        >
          {container}
        </div>
      ))}
      <div
        style={{ color: '#888', cursor: 'pointer', marginTop: 6 }}
        onClick={() => onMove(null)}
      >
        Cancel
      </div>
    </div>
  );
};

export default ContextMenu;