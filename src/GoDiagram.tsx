import React, { useLayoutEffect, useRef, useState } from 'react';
import * as go from 'gojs';
import RightSidebar from './components/RightSidebar'; // make sure this path is correct

interface GoDiagramProps {
  diagramRef: React.MutableRefObject<go.Diagram | null>;
}

export default function GoDiagram({ diagramRef }: GoDiagramProps) {
  const diagramDivRef = useRef<HTMLDivElement>(null);
  const [selectedData, setSelectedData] = useState<{
    key: number;
    label: string;
    color: string;
    stroke: string;
    shape: string;
  } | null>(null);

  const handleSidebarChange = (field: string, value: string) => {
    if (!selectedData || !diagramRef.current) return;

    const model = diagramRef.current.model;
    model.startTransaction('update');
    const nodeData = model.findNodeDataForKey(selectedData.key);
if (nodeData) {
  model.setDataProperty(nodeData, field, value);
}
    model.commitTransaction('update');
  };

  useLayoutEffect(() => {
    if (!diagramDivRef.current) return;

    const $ = go.GraphObject.make;

    if (diagramRef.current) {
      diagramRef.current.div = null;
      diagramRef.current.clear();
      diagramRef.current = null;
    }

    const diagram = $(go.Diagram, diagramDivRef.current, {
      'undoManager.isEnabled': true,
      allowDrop: true,
      grid: $(
        go.Panel,
        'Grid',
        { gridCellSize: new go.Size(20, 20) },
        $(go.Shape, 'LineH', { stroke: '#eee' }),
        $(go.Shape, 'LineV', { stroke: '#eee' })
      ),
    });

    diagram.toolManager.draggingTool.isGridSnapEnabled = true;
    diagram.toolManager.linkingTool.isEnabled = true;
    diagram.toolManager.relinkingTool.isEnabled = true;

    diagram.nodeTemplate = $(
      go.Node,
      'Auto',
      {
        locationSpot: go.Spot.Center,
        selectable: true,
        movable: true,
        resizable: false,
        cursor: 'move',
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(
        go.Shape,
        {
          strokeWidth: 1,
          stroke: '#999',
          portId: '',
          fromLinkable: true,
          toLinkable: true,
        },
        new go.Binding('fill', 'color'),
        new go.Binding('stroke', 'stroke'),
        new go.Binding('figure', 'shape')
      ),
      $(
        go.TextBlock,
        {
          margin: 8,
          font: 'bold 12px sans-serif',
          stroke: '#333',
        },
        new go.Binding('text', 'label').makeTwoWay()
      )
    );

    // Handle node selection
    diagram.addDiagramListener('ChangedSelection', () => {
      const node = diagram.selection.first();
      if (node instanceof go.Node) {
        const data = node.data;
        setSelectedData({
          key: data.key,
          label: data.label || '',
          color: data.color || '#ffffff',
          stroke: data.stroke || '#999999',
          shape: data.shape || 'Rectangle',
        });
      } else {
        setSelectedData(null);
      }
    });

    // Handle node double-click to edit
    diagram.addDiagramListener('ObjectDoubleClicked', (e) => {
      const node = e.subject.part;
      if (node instanceof go.Node) {
        const data = node.data;
        setSelectedData({
          key: data.key,
          label: data.label || '',
          color: data.color || '#ffffff',
          stroke: data.stroke || '#999999',
          shape: data.shape || 'Rectangle',
        });
      }
    });
    // Handle drag-and-drop from sidebar
    diagram.div?.addEventListener('dragover', (e) => e.preventDefault());
    diagram.div?.addEventListener('drop', (e) => {
      e.preventDefault();
      const data = e.dataTransfer?.getData('application/gojs-shape');
      if (!data) return;
      const shape = JSON.parse(data);
      const point = diagram.lastInput.documentPoint;

      diagram.model.addNodeData({
        key: Date.now(),
        label: shape.label,
        color: shape.color,
        stroke: shape.stroke || '#999999',
        shape: shape.shape,
        loc: go.Point.stringify(point),
      });
    });

    // Initial nodes and links
    diagram.model = new go.GraphLinksModel(
      [
        { key: 0, label: 'Start', color: '#f8cecc', stroke: '#b85450', shape: 'Rectangle', loc: '0 0' },
        { key: 1, label: 'Process', color: '#dae8fc', stroke: '#6c8ebf', shape: 'Rectangle', loc: '150 0' },
      ],
      [{ from: 0, to: 1 }]
    );

    diagramRef.current = diagram;

    return () => {
      if (diagramRef.current) {
        diagramRef.current.div = null;
        diagramRef.current.clear();
        diagramRef.current = null;
      }
    };
  }, [diagramRef]);
  

 return (
  <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
    {/* Canvas wrapper (scrollable area) */}
    <div
      ref={diagramDivRef}
      style={{
        flex: 1,
        overflow: 'auto',
        position: 'relative',
        height: '100vh',
        width: '100vh',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
      }}
    />

    {/* Inspector sidebar */}
    <div
      style={{
        width: 280,
        padding: '16px',
        backgroundColor: '#f9f9f9',
        borderLeft: '1px solid #ddd',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Selected Node</h3>

      {selectedData ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label>
            Label:
            <input
              type="text"
              value={selectedData.label}
              onChange={(e) => handleSidebarChange('label', e.target.value)}
              style={{ width: '100%', padding: 6, marginTop: 4 }}
            />
          </label>

          <label>
            Fill Color:
            <input
              type="color"
              value={selectedData.color}
              onChange={(e) => handleSidebarChange('color', e.target.value)}
              style={{ width: '100%', padding: 4, marginTop: 4 }}
            />
          </label>

          <label>
            Stroke Color:
            <input
              type="color"
              value={selectedData.stroke}
              onChange={(e) => handleSidebarChange('stroke', e.target.value)}
              style={{ width: '100%', padding: 4, marginTop: 4 }}
            />
          </label>

          <label>
            Shape:
            <select
              value={selectedData.shape}
              onChange={(e) => handleSidebarChange('shape', e.target.value)}
              style={{ width: '100%', padding: 6, marginTop: 4 }}
            >
              <option value="Rectangle">Rectangle</option>
              <option value="RoundedRectangle">Rounded Rectangle</option>
              <option value="Diamond">Diamond</option>
              <option value="Ellipse">Ellipse</option>
              <option value="Triangle">Triangle</option>
              <option value="TriangleDown">Triangle Down</option>
              <option value="Hexagon">Hexagon</option>
            </select>
          </label>
        </div>
      ) : (
        <p>No node selected</p>
      )}
    </div>
  </div>
  );
}
