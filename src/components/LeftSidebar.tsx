import React, { useState } from 'react';
import { shapes } from '../data/shape';
import type { ShapeDefinition } from '../types';
import ShapeGroup from './ShapeGroup';

interface ShapeGroupMap {
  [group: string]: ShapeDefinition[];
}

function groupShapesByCategory(shapes: ShapeDefinition[]): ShapeGroupMap {
  return shapes.reduce((acc, shape) => {
    acc[shape.group] = acc[shape.group] || [];
    acc[shape.group].push(shape);
    return acc;
  }, {} as ShapeGroupMap);
}

interface LeftSidebarProps {
  containers: string[];
  onAddContainer: () => void;
  customContainerShapes: { [key: string]: any[] };
}

export default function Sidebar({ containers, onAddContainer, customContainerShapes }: LeftSidebarProps) {
  const [customGroups, setCustomGroups] = useState<string[]>([]);

  const addGroup = () => {
    const name = prompt('Enter name for new shape group:');
    if (name) setCustomGroups([...customGroups, name]);
  };

  const addContainer = () => {
    const name = prompt('Container name?');
    if (name && !containers.includes(name)) {
      onAddContainer();
    }
  };

  const grouped = groupShapesByCategory(shapes);

  return (
    <div
      style={{
        width: 240,
        background: '#f9f9f9',
        padding: 10,
        overflowY: 'auto',
        height: '100%',
        borderRight: '1px solid #ddd',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 10,
          alignItems: 'center',
          fontWeight: 'bold',
        }}
      >
        <span>Sidebar</span>
        <button onClick={addGroup} style={{ cursor: 'pointer' }}>
          ＋
        </button>
      </div>

      {/* Render static groups */}
      {Object.entries(grouped).map(([group, groupShapes]) => (
        <ShapeGroup key={group} title={group} shapes={groupShapes} />
      ))}

      {/* Render custom groups (empty for now) */}
      {customGroups.map((group) => (
        <ShapeGroup key={group} title={group} shapes={[]} />
      ))}

      <button onClick={addContainer}>＋</button>
      {containers.map((c) => (
        <div key={c}>
          <div style={{ fontWeight: 'bold' }}>{c}</div>
          {(customContainerShapes[c] || []).map((shape, idx) => (
            <div key={idx}>{shape.label}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
