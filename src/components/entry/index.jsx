import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TextEntry from './textEntry';
import ImageEntry from './imageEntry';
import VideoEntry from './videoEntry';

import './index.scss';

export default function Entry({ entry, tags, entries, entryRef, dimensions, setClosing }) {
  const [expanded, setExpanded] = useState(false);
  const entryBackRef = useRef();
  const navigate = useNavigate();
  const { top, left, width, height } = entryRef.current && entryRef.current.getBoundingClientRect() || { top: 0, left: 0, width: 0, height: 0 };
  // console.log(entryRef.current.innerHTML, entryBackRef);
  if (entryRef.current && entryBackRef.current) {
    entryBackRef.current.innerHTML = entryRef.current.innerHTML;
    entryBackRef.current.className = `entry-back ${entryRef.current.className}`;
  }

  useEffect(() => {
    setExpanded(true);
  }, []);

  const close = () => {
    setExpanded(false);
    setClosing(true);
    setTimeout(() => {
      if (entryBackRef.current) {
        entryBackRef.current.innerHTML = '';
        entryBackRef.current.className = 'entry-back';
        setClosing(false);
      }
      navigate('./');
    }, 750);
  };

  return (
    <div
      className={`entry ${expanded ? 'expand' : ''}`}
      style={{ top, left, width, height }}
    >
      <div ref={entryBackRef} className="entry-back">
        <p>Backside</p>
      </div>
      <div className="entry-front">
        <div className="entry-front-content">
          <div className="entry-front-content-main">
            {entry.type.name === 'Text' && <TextEntry entry={entry} />}
            {entry.type.name === 'Image' && <ImageEntry entry={entry} />}
            {entry.type.name === 'Video' && <VideoEntry entry={entry} />}

            <div className="entry-front-content-links">
              <div className="entry-front-content-related">
                <p>Related Media:</p>
                {entry.related.map((related) => {
                  const { type, title } = entries.find((entry) => entry._id === related);

                  return (
                    <span
                      key={related}
                      onClick={() => { navigate(related); }}
                    >
                      <b>{type.name}</b>
                      :
                      {title}
                    </span>
                  );
                })}
              </div>
              <button type="button" className="close" onClick={close}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
