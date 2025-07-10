import React from 'react';

export default function LeftSidebar() {
  return (
    <div style={{
      width: 280,
      backgroundColor: '#f9f9f9',
      borderRight: '1px solid #ccc',
      padding: 12,
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: 14,
    }}>
      <h3 style={{ marginBottom: 8 }}>Style</h3>

      {/* Color Palette */}
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
          {['#ffffff', '#f5f5f5', '#dae8fc', '#d5e8d4', '#fff2cc', '#f8cecc', '#e1d5e7'].map((c) => (
            <div key={c}
              style={{
                backgroundColor: c,
                width: 24,
                height: 24,
                border: '1px solid #aaa',
                cursor: 'pointer'
              }}
              title={c}
              onClick={() => alert(`Apply fill color: ${c}`)}
            />
          ))}
        </div>
      </div>

      {/* Fill & Line Checkboxes */}
      <div style={{ marginBottom: 12 }}>
        <label>
          <input type="checkbox" defaultChecked /> Fill
        </label>
        <br />
        <label>
          <input type="checkbox" defaultChecked /> Line
        </label>
        <br />
        <label>
          <input type="checkbox" /> Gradient
        </label>
      </div>

      {/* Stroke Width + Opacity */}
      <div style={{ marginBottom: 12 }}>
        <label>Stroke Width:</label>
        <input type="number" min={0} defaultValue={1} style={{ width: 50, marginLeft: 8 }} />
        <br />
        <label>Opacity:</label>
        <input type="range" min={0} max={100} defaultValue={100} />
      </div>

      {/* Shape Options */}
      <div style={{ marginBottom: 12 }}>
        <label><input type="checkbox" /> Rounded</label><br />
        <label><input type="checkbox" /> Glass</label><br />
        <label><input type="checkbox" /> Shadow</label><br />
      </div>

      {/* Edit Style */}
      <div style={{ marginTop: 12 }}>
        <button>Edit Style</button>
        <button style={{ marginLeft: 6 }}>Copy</button>
      </div>

      {/* Advanced */}
      <details style={{ marginTop: 16 }}>
        <summary><strong>Property</strong></summary>
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Perimeter:</span>
            <input type="number" defaultValue={0} style={{ width: 50 }} />
          </div>
        </div>
      </details>
    </div>
  );
}
