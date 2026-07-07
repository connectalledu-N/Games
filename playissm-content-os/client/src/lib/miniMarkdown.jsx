import React from 'react';

// Minimal renderer for the handful of markdown constructs used in wiki pages:
// #/## headings, > blockquotes, - lists, blank-line paragraphs, **bold**.
export function renderMiniMarkdown(text) {
  const lines = (text ?? '').split('\n');
  const blocks = [];
  let listBuffer = [];

  function flushList() {
    if (listBuffer.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="list-disc space-y-1 pl-5">
          {listBuffer.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      flushList();
      blocks.push(
        <h1 key={i} className="mt-4 mb-2 text-xl font-bold text-slate-900 first:mt-0">
          {renderInline(trimmed.slice(2))}
        </h1>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList();
      blocks.push(
        <h2 key={i} className="mt-4 mb-1.5 text-base font-semibold text-slate-800">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith('> ')) {
      flushList();
      blocks.push(
        <blockquote key={i} className="border-l-2 border-amber-300 bg-amber-50 px-3 py-1.5 text-sm text-amber-800">
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
    } else if (trimmed.startsWith('- ')) {
      listBuffer.push(trimmed.slice(2));
    } else if (trimmed === '') {
      flushList();
    } else {
      flushList();
      blocks.push(
        <p key={i} className="text-sm leading-relaxed text-slate-600">
          {renderInline(trimmed)}
        </p>
      );
    }
  });
  flushList();
  return <div className="space-y-2">{blocks}</div>;
}

function renderInline(str) {
  const parts = str.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}
