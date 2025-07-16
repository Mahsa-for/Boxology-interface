
export const shapes: ShapeDefinition[] = [
  //Symbol and data
  { name: 'symbol', label: 'Symbol', shape: 'Rectangle', color: '#7edc8fff', stroke: '#000000', group: 'General' },
  { name: 'data', label: 'Data', shape: 'Rectangle', color: '#6495daff', stroke: '#000000', group: 'General' },
  { name: 'datasymbol', label: 'Data/Symbol', shape: 'Rectangle', color: '#1094a2ff', stroke: '#000000', group: 'General' },
  //Actor
  { name: 'actor', label: 'Actor', shape: 'Triangle', color: '#ffaa00ff', stroke: '#000000', group: 'General' },
  //Model
  { name: 'model', label: 'Model', shape: 'Diamond', color: '#4dbdfdff', stroke: '#000000', group: 'General' },
  //Process
  { name: 'transform', label: 'Transform', shape: 'RoundedRectangle', borderRadius: '45px', color: '#f8cecc', stroke: '#000000ff', group: 'General' },
  { name: 'infer:deduce', label: 'Infer:deduce', shape: 'RoundedRectangle', borderRadius: '45px', color: '#8f6967ff', stroke: '#000000', group: 'General' },
  { name: 'generate:train', label: 'Generate:train', shape: 'RoundedRectangle', borderRadius: '45px', color: '#f598bfff', stroke: '#000000', group: 'General' },
  { name: 'generate:engineer', label: 'Generate:engineer', shape: 'RoundedRectangle', color: '#f598bfff', stroke: '#000000', group: 'General' },
  //Text
  { name: 'comment', label: 'Comment', shape: 'Rectangle', color: '#f5f5f5', stroke: '#000000', group: 'Annotation' },
];

export type GoShape =
  | 'Rectangle'
  | 'RoundedRectangle'
  | 'Diamond'
  | 'Ellipse'
  | 'Triangle'
  | 'TriangleDown'
  | 'Hexagon';

export interface ShapeDefinition {
  name: string;
  label: string;
  shape: GoShape;
  color: string;
  stroke: string;
  group: string;
  borderRadius?: '45px';
}

