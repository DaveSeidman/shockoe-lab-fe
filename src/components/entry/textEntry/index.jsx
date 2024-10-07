import React, { useState } from 'react';
import './index.scss';

export default function TextEntry({ entry }) {
  const [content, setContent] = useState('');
  console.log(entry.text.file);
  fetch(entry.text.file).then((res) => res.text()).then((res) => {
    setContent(res);
  });
  return (
    <div className="text-entry">
      <div className="text-entry-title">{entry.title}</div>
      <div className="text-entry-main">
        <pre>
          {content}
        </pre>
        <div className="text-entry-caption">
          <p>{entry.text.caption}</p>
        </div>
      </div>
    </div>
  );
}
