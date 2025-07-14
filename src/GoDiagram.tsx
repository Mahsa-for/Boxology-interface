import React, { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import * as go from 'gojs';
import ContextMenu from './ContextMenu'; // <-- Import the external component

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface GoDiagramProps {
  diagramRef: React.RefObject<go.Diagram | null>;
  setSelectedData: Dispatch<SetStateAction<any>>;
  setContextMenu: Dispatch<SetStateAction<ContextMenuPosition | null>>;
  containers: string[]; // <-- Add containers prop
}

const GoDiagram: React.FC<GoDiagramProps> = ({
  diagramRef,
  setSelectedData,
  setContextMenu,
  containers // <-- Use containers from props
}) => {
  const diagramDivRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setLocalContextMenu] = React.useState<ContextMenuPosition | null>(null);
  const [selectedData, setLocalSelectedData] = React.useState<any>(null);

  const handleSidebarChange = (field: string, value: string) => {
    if (!diagramRef.current || !selectedData) return;

    const model = diagramRef.current.model;
    model.startTransaction('update');
    const nodeData = model.findNodeDataForKey(selectedData.key);
    if (nodeData) {
      model.setDataProperty(nodeData, field, value);
    }
    model.commitTransaction('update');
  };

  useEffect(() => {
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
        contextClick: (e, obj) => {
          const node = obj.part;
          if (node instanceof go.Node) {
            setSelectedData(node.data);
            setContextMenu({ x: diagram.lastInput.viewPoint.x, y: diagram.lastInput.viewPoint.y });
          }
        },
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
    >
        {/* Use the imported ContextMenu */}
        <ContextMenu
          contextMenu={contextMenu}
          containers={containers}
          onMove={(container) => {
            // You may need to define selectedData in state as well, or lift it up
            setLocalContextMenu(null);
          }}
        />
      </div>
    </div>
  );
};

export default GoDiagram;
