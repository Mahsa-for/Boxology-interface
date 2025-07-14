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
    const errors: string[] = [];
    const edges: [string, string][] = [];
    const nodeLabels = new Set<string>();

    diagram.links.each(link => {
        const fromNode = link.fromNode;
        const toNode = link.toNode;
        if (!fromNode || !toNode) return;

        // Normalize to lowercase for matching
        const fromLabel = (fromNode.data.label || fromNode.data.name || "").toLowerCase();
        const toLabel = (toNode.data.label || toNode.data.name || "").toLowerCase();
        edges.push([fromLabel, toLabel]);
        nodeLabels.add(fromLabel);
        nodeLabels.add(toLabel);

        // Check valid connection (direction matters)
        if (!validNext[fromLabel] || !validNext[fromLabel].includes(toLabel)) {
            errors.push(`❌ Invalid connection: "${fromLabel}" → "${toLabel}"`);
        }
    });

    // Pattern matching (direction matters)
    const matchedPatterns: string[] = [];
    allPatterns.forEach(pattern => {
        const required = pattern.edges.map(([from, to]) => [from.toLowerCase(), to.toLowerCase()]);
        const found = required.every(([from, to]) =>
            edges.some(([s, t]) => s === from && t === to)
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