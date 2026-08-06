import React from 'react';

export default function FormattedContent({ text, isOption = false }) {
  if (!text) return null;

  // Render inline backtick code `code`
  const renderInlineCode = (str) => {
    const parts = str.split(/`([^`]+)`/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <code key={i} className="inline-code">{part}</code>;
      }
      return part;
    });
  };

  const lines = text.split('\n');
  if (lines.length === 1) {
    if (isOption) {
      const optionMatch = text.match(/^([A-Z]\.)\s*(.*)/);
      if (optionMatch) {
        return (
          <span>
            <strong style={{ marginRight: '0.4rem' }}>{optionMatch[1]}</strong>
            {renderInlineCode(optionMatch[2])}
          </span>
        );
      }
    }
    return <span style={{ whiteSpace: 'pre-wrap' }}>{renderInlineCode(text)}</span>;
  }

  // Multi-line text handling
  let optionHeader = null;
  let remainingText = text;

  if (isOption) {
    const optionMatch = text.match(/^([A-Z]\.)\s*([\s\S]*)/);
    if (optionMatch) {
      optionHeader = optionMatch[1];
      remainingText = optionMatch[2];
    }
  }

  const remLines = remainingText.split('\n');
  
  let proseLines = [];
  let codeLines = [];
  let isInsideCode = false;

  for (let i = 0; i < remLines.length; i++) {
    const line = remLines[i];
    const trimmed = line.trim();

    const looksLikeCode = /^(using\s|namespace\s|public\s|private\s|protected\s|internal\s|class\s|struct\s|enum\s|interface\s|static\s|void\s|var\s|ref\s|return\s|Console\.|DirectoryInfo|FileStream|StreamWriter|Func<|Action<|DbSet<|DbContext|\[.*\]|\{|\}|\/\/)/.test(trimmed)
      || (i > 0 && (trimmed.startsWith('{') || trimmed.endsWith(';') || trimmed.endsWith('}') || trimmed.startsWith('var ') || trimmed.startsWith('ref ')));

    if (looksLikeCode) {
      isInsideCode = true;
    }

    if (isInsideCode) {
      codeLines.push(line);
    } else {
      proseLines.push(line);
    }
  }

  return (
    <div style={{ display: 'inline-block', width: '100%' }}>
      {optionHeader && (
        <strong style={{ marginRight: '0.4rem', display: 'inline-block', marginBottom: '0.2rem' }}>
          {optionHeader}
        </strong>
      )}
      {proseLines.length > 0 && (
        <div style={{ whiteSpace: 'pre-wrap', marginBottom: codeLines.length > 0 ? '0.5rem' : '0' }}>
          {renderInlineCode(proseLines.join('\n'))}
        </div>
      )}
      {codeLines.length > 0 && (
        <pre className="code-block">
          <code>{codeLines.join('\n')}</code>
        </pre>
      )}
    </div>
  );
}
