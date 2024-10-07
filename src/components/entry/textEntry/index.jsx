import React, { useState, useRef, useEffect } from 'react';
import './index.scss';

export default function TextEntry({ entry }) {
  const [content, setContent] = useState('');
  const containerRef = useRef();
  const contentRef = useRef();
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(0);

  fetch(entry.text.file).then((res) => res.text()).then((res) => {
    setContent(res);
  });

  useEffect(() => {
    setTimeout(() => {
      const containerWidth = containerRef.current ? containerRef.current.getBoundingClientRect().width : 0;
      console.log(containerRef.current.scrollWidth / containerWidth);
      setPages(['a']);
    }, 1500);
  }, []);

  return (
    <div className="text-entry">
      <div className="text-entry-title">{entry.title}</div>
      <div ref={containerRef} className="text-entry-main">
        <pre
          ref={contentRef}
          style={{
            transform: `translateX(${page * -100}%)`,
          }}
        >
          {content}
        </pre>
        <div className="text-entry-caption">
          <p>{entry.text.caption}</p>
        </div>
        <div className="text-entry-main-controls">
          <div className="text-entry-main-controls-dots">
            {
              pages.map((page, index) => <span key={index} className="text-entry-dots-dot" />)
            }
          </div>
          <button
            type="button"
            className="text-entry-main-controls-prev"
            onClick={() => { setPage(page - 1); }}
          >
            ←
          </button>
          <button
            type="button"
            className="text-entry-main-controls-next"
            onClick={() => { setPage(page + 1); }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
