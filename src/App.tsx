import React, { useRef, useState } from 'react';
import './App.css';
import Toolbar from './Toolbar';
import LeftSidebar from './components/LeftSidebar';
import GoDiagram from './GoDiagram';
import * as go from 'gojs';
import RightSidebar from './components/RightSidebar';
import ContextMenu from './ContextMenu';
import { validateGoJSDiagram } from './plugin/GoJSBoxologyValidation';

function App() {
  const diagramRef = useRef<go.Diagram | null>(null);
  const [containers, setContainers] = useState<string[]>(['General', 'Annotation']);
  const [customContainerShapes, setCustomContainerShapes] = useState<{ [key: string]: any[] }>({});
  const [selectedData, setSelectedData] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleSave = () => {
    if (diagramRef.current) {
      const json = diagramRef.current.model.toJson();
      localStorage.setItem('diagramData', json);
      alert('Diagram saved!');
    }
  };

  const handleOpen = () => {
    const json = localStorage.getItem('diagramData');
    if (json && diagramRef.current) {
      diagramRef.current.model = go.Model.fromJson(json);
    }
  };

  const handleUndo = () => {
    diagramRef.current?.undoManager?.undo();
  };

  const handleRedo = () => {
    diagramRef.current?.undoManager?.redo();
  };

  const handleAbout = () => {
    alert('Custom Diagram Editor using GoJS');
  };

  const handleValidate = () => {
    if (diagramRef.current) {
      const result = validateGoJSDiagram(diagramRef.current);
      alert(result);
    }
  };

  interface ContextMenuPosition {
    x: number;
    y: number;
  }

  interface SelectedData {
    key: string;
    [key: string]: any;
  }

  function handleMoveNodeToContainer(containerName: string | null): void {
    if (!selectedData || !containerName) return;
    // Do NOT remove node from diagram
    setCustomContainerShapes(prev => ({
      ...prev,
      [containerName]: [...(prev[containerName] || []), selectedData]
    }));
    setContextMenu(null);
    setSelectedData(null);
  }

  function handleAddContainer() {
    const name = prompt('Container name?');
    if (name && !containers.includes(name)) {
      setContainers([...containers, name]);
      setCustomContainerShapes(prev => ({ ...prev, [name]: [] }));
    }
  }

  return (
    <div className="app" style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        onOpen={handleOpen}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onAbout={handleAbout}
        onValidate={handleValidate}
      />
      <div
        className="main"
        style={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
          minWidth: 0,
          height: '100%',
          width: '100%',
        }}
      >
        {/* Left Sidebar */}
        <div
          style={{
            width: 240,
            minWidth: 180,
            maxWidth: 300,
            background: '#f9f9f9',
            borderRight: '1px solid #ddd',
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <LeftSidebar
            containers={containers}
            customContainerShapes={customContainerShapes}
            onAddContainer={handleAddContainer}
          />
        </div>
        {/* Canvas */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            position: 'relative',
            height: '100%',
            display: 'flex',
          }}
        >
          <GoDiagram
            diagramRef={diagramRef}
            setSelectedData={setSelectedData}
            setContextMenu={setContextMenu}
            containers={containers}
          />
          <ContextMenu contextMenu={contextMenu} containers={containers} onMove={handleMoveNodeToContainer} />
        </div>
        {/* Right Sidebar */}
        <div
          style={{
            width: 280,
            minWidth: 200,
            maxWidth: 340,
            background: '#f9f9f9',
            borderLeft: '1px solid #ddd',
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <RightSidebar
            selectedData={null} // <-- Replace null with actual selected node data from GoDiagram
            diagramRef={diagramRef}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
