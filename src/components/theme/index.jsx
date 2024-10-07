import React, { useState, useRef, useEffect } from 'react';
import './index.scss';

export default function Theme({ themes, theme, setTheme }) {
  // console.log({ themes, theme });
  // const [themeName, setThemeName] = useState('');
  // useEffect(() => {
  //   setThemeName(themes.find((t) => t._id === theme).name);
  // }, [theme]);

  return (
    <div className={`theme ${theme ? '' : 'hidden'}`}>
      {theme && (<h1>{themes.find((t) => t._id === theme).name}</h1>)}
      <button className="close" type="button" onClick={() => { setTheme(null); }}>X</button>
    </div>
  );
}
