import React from 'react';
import './index.scss';

export default function ImageEntry({ entry }) {
  return (
    <div className="image-entry">
      <div className="image-entry-main">
        <div className="image-entry-main-image">
          <img src={entry.image.file} />
        </div>
        <div className="image-entry-main-text">
          <h1>{entry.title}</h1>
          <p>{entry.image.text}</p>
        </div>
      </div>
      <div className="image-entry-caption">{entry.image.caption}</div>
    </div>
  );
}
