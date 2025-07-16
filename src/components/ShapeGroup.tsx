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
      background: shape.color,
      display: 'flex', // Fixed: was 'relative'
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 10,
      fontWeight: 'bold',
      border: `2px solid ${shape.stroke || '#999'}`,
      cursor: 'grab',
      position: 'relative',
      color: '#000',
      userSelect: 'none',
    };

    switch (shape.shape) {
      case 'Circle':
      case 'Ellipse':
        return { 
          ...base, 
          borderRadius: '50%',
          width: 50,
          height: 50
        };
        
      case 'RoundedRectangle':
        return { 
          ...base,
          width: 80,
          height: 50, 
          borderRadius: '45px' // Changed from '8px' to '22px' for 45-degree angle effect
        };
        
      case 'Diamond':
        return {
          ...base,
          transform: 'rotate(45deg)',
          width: 45,
          height: 45,
        };
        
      case 'Triangle':
        return {
          width: '5px',
          height: '15px',
          borderLeft: '35px solid transparent', // Increased from 25px
          borderRight: '35px solid transparent', // Increased from 25px
          borderBottom: `60px solid ${shape.color}`, // Increased from 40px
          cursor: 'grab',
          position: 'relative',
          background: 'transparent',
        };
        
      case 'TriangleDown':
        return {
          width: 0,
          height: 0,
          borderLeft: '25px solid transparent',
          borderRight: '25px solid transparent',
          borderTop: `40px solid ${shape.color}`,
          cursor: 'grab',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        };
        
      case 'Hexagon':
        return {
          ...base,
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          width: 60,
        };
        
      case 'Pentagon':
        return {
          ...base,
          clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
          width: 50,
          height: 50,
        };
        
      case 'Star':
        return {
          ...base,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          width: 50,
          height: 50,
        };

      case 'Rectangle':
        return {
          ...base,
          width: 80,
          height: 50,
        };

      default:
        return base; // Rectangle and others
    }
  };

  const getLabelStyle = (shape: ShapeDefinition): React.CSSProperties => {
    if (shape.shape === 'Triangle' || shape.shape === 'TriangleDown') {
      return { 
        position: 'absolute',
        bottom: '-25px', // Move label further down
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '9px',
        fontWeight: 'bold',
        color: '#000',
        whiteSpace: 'nowrap',
      };
    }
    
    if (shape.shape === 'Diamond') {
      return {
        transform: 'rotate(-45deg)',
        color: '#000',
        fontWeight: 'bold',
        fontSize: '8px',
        textAlign: 'center',
      };
    }
    
    return { 
      color: '#000', 
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: '9px',
      lineHeight: '1.2',
    };
  };

  const renderShape = (shape: ShapeDefinition) => {
    const isTriangle = shape.shape === 'Triangle' || shape.shape === 'TriangleDown';
    
    return (
      <div
        key={shape.name || shape.label}
        draggable
        onDragStart={(e) => handleDragStart(e, shape)}
        style={{
          position: 'relative',
          margin: '5px',
          padding: isTriangle ? '10px' : '0', // Reduce padding
          minWidth: isTriangle ? '90px' : 'auto', // Increase width
          minHeight: isTriangle ? '80px' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // Center the triangle
        }}
        title={shape.label}
      >
        <div style={renderShapeStyle(shape)}>
          {!isTriangle && (
            <span style={getLabelStyle(shape)}>{shape.label}</span>
          )}
        </div>
        {isTriangle && (
          <span style={{
            position: 'absolute',
            top: '50px', // Adjust this to center text vertically in triangle
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '7px',
            fontWeight: 'bold',
            color: '#000', // black text for better contrast
            whiteSpace: 'nowrap',
            textAlign: 'center',
            pointerEvents: 'none',
          }}>{shape.label}</span>
        )}
      </div>
    );
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
          userSelect: 'none',
        }}
        onClick={toggleCollapse}
      >
        <span>{title}</span>
        <span>{collapsed ? '▸' : '▾'}</span>
      </div>
      {!collapsed && (
        <div style={{ 
          padding: 10, 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 5,
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
        }}>
          {shapes.map((shape) => renderShape(shape))}
        </div>
      )}
    </div>
  );
}
