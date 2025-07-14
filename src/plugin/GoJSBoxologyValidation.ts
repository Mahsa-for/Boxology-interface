import * as go from 'gojs';

// List of all patterns (update as needed)
const allPatterns = [
  { name: "train_model (symbol)", edges: [["Symbol", "Generate:train"], ["Generate:train", "Model"]] },
  { name: "train_model (data)", edges: [["Data", "Generate:train"], ["Generate:train", "Model"]] },
  { name: "transform symbol", edges: [["Symbol", "Transform"], ["Transform", "Data"]] },
  { name: "transform symbol/data", edges: [["Symbol/Data", "Transform"], ["Transform", "Data"]] },
  { name: "transform data", edges: [["Data", "Transform"], ["Transform", "Data"]] },
  { name: "generate_model from actor", edges: [["Actor", "Generate:engineer"], ["Generate:engineer", "Model"]] },
  // ...add more patterns as needed
];

// Valid next connections (update as needed)
const validNext: Record<string, string[]> = {
  "Symbol": ["Infer:deduce", "Generate:train", "Generate", "Generate:engineer", "Transform", "Symbol", "Symbol/Data"],
  "Data": ["Infer:deduce", "Generate:train", "Generate", "Generate:engineer", "Transform", "Data", "Symbol/Data"],
  "Symbol/Data": ["Infer:deduce", "Transform", "Generate", "Symbol/Data", "Generate", "Symbol", "Data", "Generate:train", "Generate:engineer"],
  "Infer:deduce": ["Symbol", "Model", "Infer:deduce", "Data", "Symbol/Data"],
  "Model": ["Infer:deduce", "Model", "Generate", "Generate:train", "Generate:engineer", "Transform"],
  "Generate:train": ["Model", "Generate:train"],
  "Generate": ["Model", "Generate", "Data", "Symbol", "Symbol/Data"],
  "Actor": ["Generate:engineer", "Actor"],
  "Generate:engineer": ["Model", "Generate:engineer", "Generate", "Data", "Symbol", "Symbol/Data"],
  "Transform": ["Data", "Symbol", "Symbol/Data", "Transform", "Model"],
  // ...add more as needed
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

    const fromLabel = fromNode.data.label || fromNode.data.name;
    const toLabel = toNode.data.label || toNode.data.name;
    edges.push([fromLabel, toLabel]);
    nodeLabels.add(fromLabel);
    nodeLabels.add(toLabel);

    // Check valid connection
    if (!validNext[fromLabel] || !validNext[fromLabel].includes(toLabel)) {
      errors.push(`❌ Invalid connection: "${fromLabel}" → "${toLabel}"`);
    }
  });

  // Pattern matching
  const matchedPatterns: string[] = [];
  allPatterns.forEach(pattern => {
    const required = [...pattern.edges];
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