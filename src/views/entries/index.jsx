import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Column from '../../components/column';
import Entry from '../../components/entry';
import Theme from '../../components/theme';
import Search from '../../components/search';
import './index.scss';

function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

export default function Entries({ entries, tags, themes, theme, setTheme }) {
  const [highlights, setHighlights] = useState([]);
  const columnAmount = 5;
  const [columns, setColumns] = useState(new Array(columnAmount).fill(null).map(() => []));
  const { entryId } = useParams();
  const navigate = useNavigate();
  const colors = 3;
  const dimensions = useRef({ top: 0, left: 0, width: 0, height: 0 });
  const entryRef = useRef();
  const [closing, setClosing] = useState(false);
  const [searchString, setSearchString] = useState('');
  // const [filteredEntries, setFilteredEntries] = useState([...entries]);

  const entry = entries.find((entry) => entry._id === entryId);
  if (entryId && !entry) {
    console.log('entry not found (or data not fetched yet)');
  }

  useEffect(() => {
    const nextColumns = new Array(columnAmount).fill(null).map(() => []);
    const entriesPerColumn = Math.ceil(entries.length / columnAmount);
    const randomizedEntries = shuffle(entries);
    const filteredEntries = randomizedEntries.filter(
      (entry) => (entry.summary.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
        || entry.title.toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
        || entry.text.text && entry.text.text.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
        || entry.image.text && entry.image.text.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
        || entry.video.text && entry.video.text.toLowerCase().indexOf(searchString.toLowerCase()) >= 0,

    );
    let lastColor = 1;
    filteredEntries.forEach((entry, index) => {
      let color = lastColor;
      while (color === lastColor) {
        color = Math.floor(Math.random() * colors) + 1;
      }
      lastColor = color;
      entry.color = color;
      entry.size = 4 - Math.min(Math.max(Math.floor(entry.title.length / 4), 1), 3);
      const column = Math.floor(index / entriesPerColumn);
      nextColumns[column].push(entry);
    });
    setColumns(nextColumns);
  }, [entries, searchString]);

  const openEntry = (id, el) => {
    const { top, left, width, height } = el.getBoundingClientRect();
    dimensions.current = { top, left, width, height };
    entryRef.current = el;
    navigate(id);
  };

  return (
    <div className="entries">
      <div className={`container ${entry ? 'pushback' : ''} ${closing ? 'override' : ''}`}>
        <div className="top">
          <Search
            searchString={searchString}
            setSearchString={setSearchString}
          />
          <div className="tags">
            <ul className="tags-list">
              {tags.map((tag) => (
                <li
                  key={tag._id}
                  className={`tags-list-tag ${highlights.includes(tag._id) ? 'active' : ''}`}
                  onClick={() => {
                    setHighlights((prevHighlights) => (prevHighlights.includes(tag._id)
                      ? prevHighlights.filter((id) => id !== tag._id)
                      : [...prevHighlights, tag._id]));
                  }}
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="columns">
          {columns.map((column, columnIndex) => (
            <Column
              key={columnIndex}
              columnAmount={columnAmount}
              column={column}
              columnIndex={columnIndex}
              openEntry={openEntry}
              highlights={highlights}
            />
          ))}
        </div>
      </div>
      {entry && (
        <Entry
          entry={entry}
          entries={entries}
          tags={tags}
          dimensions={dimensions}
          entryRef={entryRef}
          setClosing={setClosing}
        />
      )}
      <Theme
        theme={theme}
        themes={themes}
        setTheme={setTheme}
      />
    </div>
  );
}
