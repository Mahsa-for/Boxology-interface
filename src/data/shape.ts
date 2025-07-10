import type { ShapeDefinition } from '../types';

export const shapes: ShapeDefinition[] = [
  { id: 's1', label: 'Process', shape: 'Rectangle', color: '#dae8fc', group: 'General' },
  { id: 's2', label: 'Decision', shape: 'Diamond', color: '#fff2cc', group: 'General' },
  { id: 's3', label: 'Start', shape: 'TriangleDown', color: '#f8cecc', group: 'General' },
  { id: 's4', label: 'End', shape: 'Ellipse', color: '#e1d5e7', group: 'General' },
  { id: 's5', label: 'Comment', shape: 'RoundedRectangle', color: '#f5f5f5', group: 'Annotation' },
];

export type GoShape =
  | 'Rectangle'
  | 'RoundedRectangle'
  | 'Diamond'
  | 'Ellipse'
  | 'Triangle'
  | 'TriangleDown'
  | 'Hexagon';

