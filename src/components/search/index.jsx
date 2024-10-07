import React, { useState, useRef, useEffect } from 'react';
import ReactSimpleKeyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './index.scss';

export default function Search({ searchString, setSearchString }) {
  const [visible, setVisible] = useState(false);
  const ignoredKeys = ['Tab', 'Enter', 'Shift', 'Meta', 'Control', 'Alt', 'Backspace', 'CapsLock', 'Escape'];
  useEffect(() => {
    if (searchString.length >= 3) console.log('set entries based');
  }, [searchString]);

  return (
    <div
      className="search"
      onClick={(e) => {
        if (e.target.classList.contains('keyboard')) setVisible(false);
      }}
    >
      <input
        className="search-input"
        value={searchString}
        onChange={(e) => {
          // console.log(e);
          // console.log('here', e.target.value);
          // setSearchString((prev) => `${prev}${e.target.value}`);
        }}
        onKeyDown={({ key }) => {
          if (key === 'Backspace') {
            setSearchString((prev) => prev.slice(0, -1));
            return;
          }
          if (ignoredKeys.includes(key)) return;
          setSearchString((prev) => `${prev}${key}`);
        }}
        type="text"
        placeholder="Search"
        onFocus={() => { setVisible(true); }}
      />
      <div className={`keyboard ${visible ? '' : 'hidden'}`}>
        <ReactSimpleKeyboard
          onChange={setSearchString}
        />
      </div>
    </div>
  );
}
