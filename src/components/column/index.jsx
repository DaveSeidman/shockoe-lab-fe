import React, { useState, useRef, useEffect } from 'react';
import './index.scss';

export default function Column({ column, columnIndex, openEntry, highlights }) {
  const [translate, setTranslate] = useState(0);
  const columnRef = useRef();
  const entryRefs = useRef([]);
  const offsets = useRef([]);
  let totalHeight = 0;
  if (columnRef.current) totalHeight = columnRef.current.getBoundingClientRect().height + 20;
  const pointer = useRef({ y: 0, velocity: 0, down: false, moved: false });

  const animationRef = useRef();

  useEffect(() => {
    offsets.current = new Array(column.length).fill(0);
  }, [column]);

  const resize = () => {
    if (columnRef.current) {
      totalHeight = columnRef.current.getBoundingClientRect().height + 20;
      setTranslate(translate + 0.00001); // TODO:
    }
  };

  useEffect(() => {
    addEventListener('resize', resize);
    resize();
    return (() => {
      removeEventListener('resize', resize);
    });
  }, []);

  // Smooth animation on pointer up (deceleration)
  const smoothScroll = () => {
    if (Math.abs(pointer.current.velocity) > 0.1) { // If velocity is still significant, keep animating
      setTranslate((prevTranslate) => prevTranslate + pointer.current.velocity);
      pointer.current.velocity *= 0.95; // Reduce velocity gradually
      animationRef.current = requestAnimationFrame(smoothScroll);
    } else {
      cancelAnimationFrame(animationRef.current); // Stop animation when velocity is low
    }
  };

  useEffect(() => {
    entryRefs.current.forEach((entry, index) => {
      if (!entry) return;
      const { top, height } = entry.getBoundingClientRect();
      if (top < -height) {
        offsets.current[index] += totalHeight;
      }
      if (top > innerHeight) {
        offsets.current[index] -= totalHeight;
      }
    });
  }, [translate]);

  return (
    <div
      key={`col-${columnIndex}`}
      className="columns-column"
      onWheel={(e) => {
        setTranslate((prevTranslate) => prevTranslate - e.deltaY);
      }}
      onPointerDown={(e) => {
        // if (e.target.hasPointerCapture(e.pointerId))
        e.target.releasePointerCapture(e.pointerId);
        e.preventDefault();
        e.stopPropagation();
        pointer.current.down = true;
        pointer.current.velocity = 0;
        pointer.current.moved = false;
        cancelAnimationFrame(animationRef.current); // Cancel any ongoing smooth animation
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => { pointer.current.down = false; });
        animationRef.current = requestAnimationFrame(smoothScroll);
      }}
      onPointerMove={(e) => {
        if (!e.isPrimary) return;

        e.preventDefault();
        e.stopPropagation();
        pointer.current.moved = true;
        if (pointer.current.down) {
          pointer.current.velocity = e.movementY * devicePixelRatio;
          setTranslate((prevTranslate) => prevTranslate + pointer.current.velocity);
        }
      }}
    >
      <div
        index={columnIndex}
        ref={columnRef}
        className="columns-column-entries"
        style={{ transform: `translateY(${translate}px)` }}
      >
        {column.map((entry, entryIndex) => (
          <div
            key={entry._id}
            ref={(el) => {
              entryRefs.current[entryIndex] = el;
            }}
            className={`columns-column-entries-entry color-${entry.color} size-${entry.size} ${entry.tags.some((tag) => highlights.includes(tag)) ? 'active' : ''}`}
            style={{ transform: `translateY(${offsets.current[entryIndex] || 0}px)` }}
            onClick={() => {
              if (pointer.current.velocity === 0 && !pointer.current.moved) {
                openEntry(entry._id, entryRefs.current[entryIndex]);
              }
            }}
          >
            <div>
              <h1>{entry.summary}</h1>
              {entry.image && <img src={entry.image.file} />}
              {/* {entry.video && <video muted playsInline><source src={entry.video} /></video>} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
