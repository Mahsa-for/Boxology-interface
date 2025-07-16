import * as go from 'gojs';

// List of all patterns (update as needed)
const allPatterns = [
    { name: "train_model (symbol)", edges: [["symbol", "generate:train"], ["generate:train", "model"]] },
    { name: "train_model (data)", edges: [["data", "generate:train"], ["generate:train", "model"]] },
    { name: "transform symbol", edges: [["symbol", "transform"], ["transform", "data"]] },
    { name: "transform symbol/data", edges: [["symbol/data", "transform"], ["transform", "data"]] },
    { name: "transform data", edges: [["data", "transform"], ["transform", "data"]] },
    { name: "generate_model from actor", edges: [["actor", "generate:engineer"], ["generate:engineer", "model"]] },
    { name: "infer_symbol (symbol → model → symbol)", edges: [["model", "infer:deduce"], ["symbol", "infer:deduce"], ["infer:deduce", "symbol"]] },
    { name: "infer_symbol (symbol/data → model → symbol)", edges: [["model", "infer:deduce"], ["symbol/data", "infer:deduce"], ["infer:deduce", "symbol"]] },
    { name: "infer_symbol (data → model → symbol)", edges: [["model", "infer:deduce"], ["data", "infer:deduce"], ["infer:deduce", "symbol"]] },
    { name: "infer_model (symbol → model → model)", edges: [["model", "infer:deduce"], ["symbol", "infer:deduce"], ["infer:deduce", "model"]] },
    { name: "infer_model (symbol/data → model → model)", edges: [["model", "infer:deduce"], ["symbol/data", "infer:deduce"], ["infer:deduce", "model"]] },
    { name: "infer_model (data → model → model)", edges: [["model", "infer:deduce"], ["data", "infer:deduce"], ["infer:deduce", "model"]] },
    { name: "embed transform", edges: [["symbol", "transform:embed"], ["data", "transform:embed"], ["transform:embed", "model:semantic"]] },
    // New rules
    { name: "transform data type", edges: [["data", "transform"], ["transform", "data"]] },
    { name: "generate_model from model and data ", edges: [["model", "generate"], ["data", "generate"], ["generate", "model"]] },
    { name: "train_model (symbol)", edges: [["symbol", "generate"], ["generate", "model"]] },
    { name: "generate model (data → symbol → model)", edges: [["data", "generate"], ["symbol", "generate"], ["generate", "model"]] },
    { name: "generate_symbol from actor", edges: [["actor", "generate:engineer"], ["generate:engineer", "symbol"]] },
    { name: "data-symbol transform", edges: [["symbol", "transform"], ["data", "transform"], ["transform", "data"]] },
    { name: "actor generate model", edges: [["actor", "generate"], ["symbol", "generate"], ["generate", "model"]]},

    { name: "infer symbol from more model", edges: [["model", "infer:deduce"],["data", "infer:deduce"], ["infer:deduce", "symbol"]] },
];

// Valid next connections (update as needed)
const validNext: Record<string, string[]> = {
    "symbol": ["infer:deduce", "generate:train","generate","generate:engineer", "transform:embed", "transform", "symbol","symbol/data"],
    "data": ["infer:deduce", "generate:train","generate","generate:engineer", "transform", "data","transform:embed","symbol/data"],
    "symbol/data": ["infer:deduce", "transform:embed","generate", "transform", "symbol/data","generate","symbol","data", "generate:train", "generate:engineer"],
    "infer:deduce": ["symbol", "model", "infer:deduce","data","symbol/data","model:semantic", "model:statistics"],
    "model": ["infer:deduce", "model","generate","generate:train","generate:engineer", "model:statistics", "model:semantic","transform:embed","transform"],
    "generate:train": ["model", "generate:train", "model:semantic", "model:statistics"],
    "generate": ["model", "generate", "model:semantic", "model:statistics","data","symbol","symbol/data"],
    "actor": ["generate:engineer", "actor", "generate"],
    "generate:engineer": ["model", "generate:engineer","generate","data","symbol","symbol/data"],
    "model:semantic": ["infer:deduce", "model","generate","generate:train","generate:engineer", "model:statistics", "model:semantic","transform:embed","transform"],
    "model:statistics": ["infer:deduce", "model","generate","generate:train","generate:engineer", "model:statistics", "model:semantic","transform:embed","transform"],
    "transform:embed": ["data", "transform:embed", "symbol", "transform", "model:semantic", "model:statistics", "symbol/data","model"],
    "transform": ["data", "symbol", "symbol/data", "transform","transform:embed", "model", "model:semantic", "model:statistics"],
};

// Main validation function
export function validateGoJSDiagram(diagram: go.Diagram): string {
  // Always get fresh selection - never use cached data
  const selectedCells = diagram.selection;
  
  console.log(`🔍 Validating ${selectedCells.count} selected items`);
  
  if (selectedCells.count === 0) {
    return "⚠️ No selection made! Please select a pattern before validation.";
  }

    // Clear any previous validation state
    const nodes: go.Node[] = [];
    const edges: go.Link[] = [];
    
    // Fresh iteration over current selection
    selectedCells.each(part => {
      if (part instanceof go.Node && !isIgnorable(part)) {
        nodes.push(part);
      } else if (part instanceof go.Link && part.fromNode && part.toNode) {
        edges.push(part);
      }
    });
  
  // Helper to ignore certain nodes (customize as needed)
  function isIgnorable(node: go.Node): boolean {
    // Example: ignore nodes with category "Comment" or any other logic
    return node.category === "Comment";
  }

  console.log(`📊 Found ${nodes.length} nodes and ${edges.length} edges`);

  // Make sure all arrays are freshly created, not reused
  const edgeNameList = edges.map(edge => [
    edge.fromNode?.data.label || edge.fromNode?.data.name || "",
    edge.toNode?.data.label || edge.toNode?.data.name || ""
  ]);

  const matchedPatterns: string[] = []; // Fresh array
  const matchedNodeIds = new Set<string>(); // Fresh set
  const errors: string[] = []; // Fresh array
  
  // Pattern matching (direction matters)
  allPatterns.forEach(pattern => {
    const required = pattern.edges.map(([from, to]) => [from.toLowerCase(), to.toLowerCase()]);
    const found = required.every(([from, to]) =>
      edges.some(edge => {
        const s = (edge.fromNode?.data.label || edge.fromNode?.data.name || "").toLowerCase();
        const t = (edge.toNode?.data.label || edge.toNode?.data.name || "").toLowerCase();
        return s === from && t === to;
      })
    );
    if (found) matchedPatterns.push(pattern.name);
  });

  let summary = '';
  if (errors.length === 0) {
      if (matchedPatterns.length > 0) {
          summary += "✅ Valid pattern(s) detected:\n\n";
          matchedPatterns.forEach(p => summary += `• ${p}\n`);
      } else {
          summary += "✅ Diagram is valid (no invalid connections), but no known pattern detected.";
      }
  } else {
      summary += "❌ Invalid pattern or connection:\n";
      errors.forEach(e => summary += e + "\n");
      if (matchedPatterns.length > 0) {
          summary += "\nPartial matches found:\n";
          matchedPatterns.forEach(p => summary += `• ${p}\n`);
      }
  }

  return summary;
}

// Utility to add a button to your UI (call this in your diagram component)
export function addGoJSValidationButton(diagram: go.Diagram, container: HTMLElement) {
  const button = document.createElement("button");
  button.textContent = "Validate Pattern";
  button.style.marginLeft = "10px";
  button.style.padding = "5px 10px";
  button.style.border = "1px solid #000";
  button.style.background = "#4CAF50";
  button.style.color = "white";
  button.style.cursor = "pointer";
  button.style.fontWeight = "bold";
  button.onclick = () => {
    const result = validateGoJSDiagram(diagram);
    alert(result);
  };
  container.appendChild(button);
}

// Setup validation listeners on diagram creation - like the original BoxologyValidation.js
export function setupDiagramValidation(diagram: go.Diagram): void {
  console.log("✅ GoJS Boxology Plugin Loading...");
  
  // Add listener for when links are drawn (equivalent to CELL_CONNECTED in mxGraph)
  diagram.addDiagramListener("LinkDrawn", (e) => {
    const link = e.subject as go.Link;
    if (!link || !link.fromNode || !link.toNode) return;

    const source = (link.fromNode.data.label || link.fromNode.data.name || "").toLowerCase();
    const target = (link.toNode.data.label || link.toNode.data.name || "").toLowerCase();

    // Check if connection is valid using validNext rules
    if (!validNext[source] || !validNext[source].includes(target)) {
      alert(`❌ Invalid connection! "${source}" → "${target}" will be removed.`);
      diagram.startTransaction("remove invalid link");
      diagram.remove(link);
      diagram.commitTransaction("remove invalid link");
      return;
    }

    // If same name nodes are connected, merge them (like original BoxologyValidation.js)
    if (source === target) {
      mergeIdenticalNodes(diagram, link);
    }
  });

  // Add listener for link relinking
  diagram.addDiagramListener("LinkRelinked", (e) => {
    const link = e.subject as go.Link;
    if (!link || !link.fromNode || !link.toNode) return;

    const source = (link.fromNode.data.label || link.fromNode.data.name || "").toLowerCase();
    const target = (link.toNode.data.label || link.toNode.data.name || "").toLowerCase();

    if (!validNext[source] || !validNext[source].includes(target)) {
      alert(`❌ Invalid connection! "${source}" → "${target}" will be removed.`);
      diagram.startTransaction("remove invalid relink");
      diagram.remove(link);
      diagram.commitTransaction("remove invalid relink");
    }
  });

  console.log("✅ GoJS Boxology Plugin Loaded Successfully");
}

// Helper function to merge identical nodes (like original BoxologyValidation.js)
function mergeIdenticalNodes(diagram: go.Diagram, connectingLink: go.Link): void {
  const sourceNode = connectingLink.fromNode;
  const targetNode = connectingLink.toNode;
  
  if (!sourceNode || !targetNode || sourceNode === targetNode) return;
  
  const sourceName = (sourceNode.data.label || sourceNode.data.name || "").toLowerCase();
  const targetName = (targetNode.data.label || targetNode.data.name || "").toLowerCase();
  
  if (sourceName === targetName) {
    diagram.startTransaction("merge identical nodes");
    
    try {
      // Get all links connected to target node (except the connecting link)
      const targetLinks: go.Link[] = [];
      targetNode.findLinksConnected().each(link => {
        if (link !== connectingLink) targetLinks.push(link);
      });
      
      // Reconnect target's links to source node
      targetLinks.forEach(link => {
        if (link.fromNode === targetNode) {
          (link.data as any).from = sourceNode.data.key;
        }
        if (link.toNode === targetNode) {
          (link.data as any).to = sourceNode.data.key;
        }
        diagram.model.updateTargetBindings(link.data);
      });
      
      // Remove the connecting link and target node
      diagram.remove(connectingLink);
      diagram.remove(targetNode);
      
      console.log(`✅ Merged identical nodes: "${sourceName}"`);
      
    } catch (error) {
      console.error("Error merging nodes:", error);
    } finally {
      diagram.commitTransaction("merge identical nodes");
    }
  }
}