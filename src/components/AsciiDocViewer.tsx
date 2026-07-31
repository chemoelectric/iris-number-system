import React from 'react';
import katex from 'katex';

interface AsciiDocViewerProps {
  content: string;
  className?: string;
  onNavigate?: (anchorId: string) => void;
}

export const AsciiDocViewer: React.FC<AsciiDocViewerProps> = ({ content, className = '', onNavigate }) => {
  // Render LaTeX math strings cleanly using KaTeX
  const renderMathInline = (text: string): React.ReactNode[] => {
    // Replace inline math \( ... \), $ ... $, latexmath:[...] or stem:[...]
    const blockMathRegex = /\\\[([\s\S]*?)\\\]|\$\$([\s\S]*?)\$\$/g;
    
    // Simple block splitter for math and text
    const blocks: { type: 'text' | 'math-block'; content: string }[] = [];
    
    let currentIdx = 0;
    let bMatch;

    while ((bMatch = blockMathRegex.exec(text)) !== null) {
      if (bMatch.index > currentIdx) {
        blocks.push({ type: 'text', content: text.substring(currentIdx, bMatch.index) });
      }
      const mathCode = bMatch[1] || bMatch[2];
      blocks.push({ type: 'math-block', content: mathCode });
      currentIdx = bMatch.index + bMatch[0].length;
    }
    if (currentIdx < text.length) {
      blocks.push({ type: 'text', content: text.substring(currentIdx) });
    }

    return blocks.map((block, idx) => {
      if (block.type === 'math-block') {
        try {
          const html = katex.renderToString(block.content, { displayMode: true, throwOnError: false });
          return (
            <div
              key={`block-${idx}`}
              className="my-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-x-auto text-amber-200 text-center text-sm font-mono"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <div key={`block-err-${idx}`} className="my-2 p-2 bg-rose-950/40 text-rose-300 font-mono text-xs rounded">
              \[{block.content}\]
            </div>
          );
        }
      }

      // Inline math parsing inside text blocks
      const inlineMathRegex = /\\\((.*?)\\\)|(\$([^\$]+)\$)|latexmath:\[(.*?)\]|stem:\[(.*?)\]/g;
      const inlineElements: React.ReactNode[] = [];
      let iIdx = 0;
      let iMatch;

      while ((iMatch = inlineMathRegex.exec(block.content)) !== null) {
        if (iMatch.index > iIdx) {
          inlineElements.push(
            <span key={`txt-${iIdx}`}>{formatInlineText(block.content.substring(iIdx, iMatch.index))}</span>
          );
        }
        const inlineMathCode = iMatch[1] || iMatch[3] || iMatch[4] || iMatch[5];
        try {
          const html = katex.renderToString(inlineMathCode, { displayMode: false, throwOnError: false });
          inlineElements.push(
            <span
              key={`inmath-${iMatch.index}`}
              className="inline-block px-1 text-amber-300 font-mono"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          inlineElements.push(<code key={`inmath-err-${iMatch.index}`} className="text-amber-400 font-mono">\( {inlineMathCode} \)</code>);
        }
        iIdx = iMatch.index + iMatch[0].length;
      }

      if (iIdx < block.content.length) {
        inlineElements.push(
          <span key={`txt-end-${iIdx}`}>{formatInlineText(block.content.substring(iIdx))}</span>
        );
      }

      return <span key={`inline-container-${idx}`}>{inlineElements}</span>;
    });
  };

  // Helper for bold, italic, code, and xref hyperlinking formatting
  const formatInlineText = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    // Regex matches xref:anchorId[label], <<anchorId,label>>, <<anchorId>>, **bold**, *bold*, _italic_, `code`
    const fmtRegex = /(xref:([a-zA-Z0-9_-]+)\[(.*?)\]|<<([a-zA-Z0-9_-]+),(.*?)>>|<<([a-zA-Z0-9_-]+)>>|\*\*(.*?)\*\*|\*(.*?)\*|_(.*?)_|`(.*?)`)/g;
    let lastIdx = 0;
    let match;

    while ((match = fmtRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(text.substring(lastIdx, match.index));
      }

      // Check if match is a cross-reference link
      const linkTarget = match[2] || match[4] || match[6];
      const linkLabel = match[3] || match[5] || match[6];

      if (linkTarget) {
        parts.push(
          <a
            key={`xref-${match.index}`}
            href={`#${linkTarget}`}
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) {
                onNavigate(linkTarget);
              } else {
                const el = document.getElementById(linkTarget);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }
            }}
            className="text-amber-400 hover:text-amber-300 underline decoration-amber-500/50 hover:decoration-amber-300 font-semibold transition cursor-pointer"
          >
            {formatInlineText(linkLabel)}
          </a>
        );
      } else if (match[7] || match[8]) {
        // Bold
        parts.push(
          <strong key={`b-${match.index}`} className="font-semibold text-slate-100">
            {match[7] || match[8]}
          </strong>
        );
      } else if (match[9]) {
        // Italic
        parts.push(
          <em key={`i-${match.index}`} className="italic text-slate-300">
            {match[9]}
          </em>
        );
      } else if (match[10]) {
        // Code
        parts.push(
          <code key={`c-${match.index}`} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-indigo-300 rounded font-mono text-xs">
            {match[10]}
          </code>
        );
      }

      lastIdx = match.index + match[0].length;
    }

    if (lastIdx < text.length) {
      parts.push(text.substring(lastIdx));
    }

    return parts;
  };

  // Parse lines into AsciiDoc blocks
  const parseAsciiDoc = (docText: string): React.ReactNode[] => {
    const lines = docText.split('\n');
    const nodes: React.ReactNode[] = [];
    let i = 0;
    let pendingAnchorId: string | null = null;

    while (i < lines.length) {
      const line = lines[i].trim();

      if (!line) {
        i++;
        continue;
      }

      // Anchor tag check e.g. [#postulate-1] or [[postulate-1]]
      const anchorMatch = line.match(/^\[#([a-zA-Z0-9_-]+)\]$/) || line.match(/^\[\[([a-zA-Z0-9_-]+)\]\]$/);
      if (anchorMatch) {
        pendingAnchorId = anchorMatch[1];
        i++;
        continue;
      }

      // H1 Header (e.g. = Title)
      if (line.startsWith('= ')) {
        const title = line.replace(/^=\s+/, '');
        const currentAnchor = pendingAnchorId;
        pendingAnchorId = null;
        nodes.push(
          <h1
            id={currentAnchor || undefined}
            key={`h1-${i}`}
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight border-b border-slate-800 pb-3 mt-6 mb-4"
          >
            {renderMathInline(title)}
          </h1>
        );
        i++;
        continue;
      }

      // H2 Header (e.g. == Chapter/Section Title)
      if (line.startsWith('== ')) {
        const title = line.replace(/^==\s+/, '');
        const currentAnchor = pendingAnchorId;
        pendingAnchorId = null;
        nodes.push(
          <h2
            id={currentAnchor || undefined}
            key={`h2-${i}`}
            className="text-xl sm:text-2xl font-bold text-amber-200 tracking-tight border-b border-slate-800/80 pb-2 mt-8 mb-4"
          >
            {renderMathInline(title)}
          </h2>
        );
        i++;
        continue;
      }

      // H3 Header (e.g. === Subsection Title)
      if (line.startsWith('=== ')) {
        const title = line.replace(/^===\s+/, '');
        const currentAnchor = pendingAnchorId;
        pendingAnchorId = null;
        nodes.push(
          <h3
            id={currentAnchor || undefined}
            key={`h3-${i}`}
            className="text-lg font-semibold text-indigo-300 mt-6 mb-3"
          >
            {renderMathInline(title)}
          </h3>
        );
        i++;
        continue;
      }

      // Callout Blocks: [NOTE], [IMPORTANT], [POSTULATE], [DEFINITION], [THEOREM]
      if (line.startsWith('[NOTE]') || line.startsWith('[IMPORTANT]') || line.startsWith('[POSTULATE]') || line.startsWith('[DEFINITION]') || line.startsWith('[THEOREM]')) {
        const blockType = line.match(/\[(.*?)\]/)?.[1] || 'NOTE';
        let blockTitle = '';
        let blockContentLines: string[] = [];
        
        i++;
        // Check optional block title line starting with . Title
        if (i < lines.length && lines[i].trim().startsWith('.')) {
          blockTitle = lines[i].trim().substring(1).trim();
          i++;
        }

        // Check if delimited block starts with ====
        if (i < lines.length && lines[i].trim() === '====') {
          i++;
          while (i < lines.length && lines[i].trim() !== '====') {
            blockContentLines.push(lines[i]);
            i++;
          }
          if (i < lines.length && lines[i].trim() === '====') {
            i++; // skip closing ====
          }
        } else {
          // single line or paragraph block
          while (i < lines.length && lines[i].trim() !== '') {
            blockContentLines.push(lines[i]);
            i++;
          }
        }

        const blockContent = blockContentLines.join('\n');

        // Styles based on blockType
        let boxStyles = 'bg-slate-900/90 border-slate-800 text-slate-200';
        let badgeStyles = 'bg-slate-800 text-slate-300';
        let titleColor = 'text-white';

        if (blockType === 'POSTULATE') {
          boxStyles = 'bg-amber-950/20 border-amber-500/40 text-amber-100 shadow-lg shadow-amber-950/20';
          badgeStyles = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
          titleColor = 'text-amber-300';
        } else if (blockType === 'DEFINITION') {
          boxStyles = 'bg-indigo-950/20 border-indigo-500/40 text-indigo-100 shadow-lg shadow-indigo-950/20';
          badgeStyles = 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';
          titleColor = 'text-indigo-300';
        } else if (blockType === 'THEOREM') {
          boxStyles = 'bg-purple-950/20 border-purple-500/40 text-purple-100 shadow-lg shadow-purple-950/20';
          badgeStyles = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
          titleColor = 'text-purple-300';
        } else if (blockType === 'IMPORTANT') {
          boxStyles = 'bg-rose-950/20 border-rose-500/40 text-rose-100';
          badgeStyles = 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
          titleColor = 'text-rose-300';
        } else if (blockType === 'NOTE') {
          boxStyles = 'bg-sky-950/20 border-sky-500/40 text-sky-100';
          badgeStyles = 'bg-sky-500/20 text-sky-300 border border-sky-500/30';
          titleColor = 'text-sky-300';
        }

        const currentAnchor = pendingAnchorId;
        pendingAnchorId = null;

        nodes.push(
          <div
            id={currentAnchor || undefined}
            key={`callout-${i}`}
            className={`my-6 p-5 rounded-2xl border ${boxStyles} space-y-3 font-sans transition-all duration-500`}
          >
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase ${badgeStyles}`}>
                {blockType}
              </span>
              {blockTitle && (
                <h4 className={`text-sm font-bold ${titleColor}`}>
                  {renderMathInline(blockTitle)}
                </h4>
              )}
            </div>
            <div className="text-xs sm:text-sm leading-relaxed space-y-2">
              {parseAsciiDoc(blockContent)}
            </div>
          </div>
        );
        continue;
      }

      // Unordered list items starting with * or -
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const listItems: string[] = [];
        while (i < lines.length && (lines[i].trim().startsWith('* ') || lines[i].trim().startsWith('- '))) {
          listItems.push(lines[i].trim().replace(/^[\*\-]\s+/, ''));
          i++;
        }
        const currentAnchor = pendingAnchorId;
        pendingAnchorId = null;

        nodes.push(
          <ul
            id={currentAnchor || undefined}
            key={`ul-${i}`}
            className="my-3 space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-300"
          >
            {listItems.map((li, liIdx) => (
              <li key={`li-${liIdx}`} className="leading-relaxed">
                {renderMathInline(li)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Standard paragraph
      const currentAnchor = pendingAnchorId;
      pendingAnchorId = null;

      nodes.push(
        <p
          id={currentAnchor || undefined}
          key={`p-${i}`}
          className="my-3 text-xs sm:text-sm leading-relaxed text-slate-300"
        >
          {renderMathInline(line)}
        </p>
      );
      i++;
    }

    return nodes;
  };

  return <div className={`prose prose-invert max-w-none font-sans ${className}`}>{parseAsciiDoc(content)}</div>;
};
