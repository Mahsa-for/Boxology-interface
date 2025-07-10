import React, { useRef } from 'react';
import './App.css';
import Toolbar from './Toolbar';
import LeftSidebar from './components/LeftSidebar';
import GoDiagram from './GoDiagram';
import * as go from 'gojs';
import RightSidebar from './components/RightSidebar';


function App() {
  const diagramRef = useRef<go.Diagram | null>(null);

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

  return (
    <div className="app">
      <Toolbar
        onOpen={handleOpen}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onAbout={handleAbout}
      />
      <div className="main">
        <LeftSidebar />
        <GoDiagram diagramRef={diagramRef} />
        <RightSidebar />
      </div>
  
</div>
  );
}

export default App;
