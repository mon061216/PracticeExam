import React from 'react';

export default function FormattedContent({ text, isOption = false }) {
  if (!text) return null;

  // Render markdown images and inline backtick code `code`
  const renderFormattedText = (str) => {
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = imgRegex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      parts.push({ alt: match[1], src: match[2] });
      lastIndex = imgRegex.lastIndex;
    }
    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts.map((part, index) => {
      if (typeof part === 'object' && part.src) {
        return (
          <img
            key={`img-${index}`}
            src={part.src}
            alt={part.alt || 'Question Illustration'}
            className="question-image"
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              display: 'block',
              margin: '0.8rem 0',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1'
            }}
          />
        );
      }

      // Process inline code inside text part
      const codeParts = part.split(/`([^`]+)`/g);
      return codeParts.map((cPart, i) => {
        if (i % 2 === 1) {
          return <code key={`code-${index}-${i}`} className="inline-code">{cPart}</code>;
        }
        return cPart;
      });
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
            {renderFormattedText(optionMatch[2])}
          </span>
        );
      }
    }
    return <span style={{ whiteSpace: 'pre-wrap' }}>{renderFormattedText(text)}</span>;
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
          {renderFormattedText(proseLines.join('\n'))}
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
