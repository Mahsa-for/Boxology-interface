import React, { useState } from 'react';
import type { ShapeDefinition } from '../types';

interface Props {
  title: string;
  shapes: ShapeDefinition[];
}

export default function ShapeGroup({ title, shapes }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);

  const handleDragStart = (e: React.DragEvent, shape: ShapeDefinition) => {
    e.dataTransfer.setData('application/gojs-shape', JSON.stringify(shape));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const renderShapeStyle = (shape: ShapeDefinition): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: 60,
      height: 40,
      background: shape.color,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 11,
      border: '1px solid #999',
      cursor: 'grab',
    };

    switch (shape.shape) {
      case 'Ellipse':
        return { ...base, borderRadius: '50%' };
      case 'Diamond':
        return {
          ...base,
          transform: 'rotate(45deg)',
          width: 40,
          height: 40,
        };
      case 'Triangle':
      case 'TriangleDown':
        return {
          ...base,
          background: 'transparent',
          border: 'none',
          width: 0,
          height: 0,
          borderLeft: '30px solid transparent',
          borderRight: '30px solid transparent',
          borderTop: shape.shape === 'TriangleDown' ? 'none' : `40px solid ${shape.color}`,
          borderBottom: shape.shape === 'TriangleDown' ? `40px solid ${shape.color}` : 'none',
        };
      default:
        return base; // Rectangle, RoundedRectangle, etc.
    }
  };

  const getLabelStyle = (shape: ShapeDefinition): React.CSSProperties => {
    if (shape.shape.startsWith('Triangle')) {
      return { display: 'none' }; // text doesn't work inside CSS triangles
    }
    if (shape.shape === 'Diamond') {
      return {
        transform: 'rotate(-45deg)',
        color: '#000',
        fontWeight: 'bold',
      };
    }
    return { color: '#000', fontWeight: 'bold' };
  };

  return (
    <div style={{ marginBottom: 10, borderBottom: '1px solid #ccc' }}>
      <div
        style={{
          fontWeight: 'bold',
          padding: '8px 12px',
          backgroundColor: '#eee',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
        }}
        onClick={toggleCollapse}
      >
        <span>{title}</span>
        <span>{collapsed ? '▸' : '▾'}</span>
      </div>
      {!collapsed && (
        <div style={{ padding: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {shapes.map((shape) => (
            <div
              key={shape.id}
              draggable
              onDragStart={(e) => handleDragStart(e, shape)}
              style={renderShapeStyle(shape)}
              title={shape.label}
            >
              <span style={getLabelStyle(shape)}>{shape.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
