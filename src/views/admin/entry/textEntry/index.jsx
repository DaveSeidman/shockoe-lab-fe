import React, { useEffect, useState, useRef } from 'react';
import { s3Bucket } from '../../../../config.json';
import './index.scss';

export default function TextEntry({ entry, text, setText, setFilesToUpload, setFilesToRemove }) {
  const [textContent, setTextContent] = useState();
  const originalContent = useRef();

  useEffect(() => {
    if (text.file) {
      console.log(text.file);
      fetch(text.file, { cache: 'no-store' }).then((res) => res.text()).then((res) => {
        setTextContent(res);
        originalContent.current = res;
      });
    }
  }, []);

  const handleTextContentChange = (e) => {
    setTextContent(e.target.value);
    const file = new Blob([e.target.value], { type: 'text/plain' });
    file.name = 'text.txt';
    setText((prevText) => ({
      file: `${s3Bucket}/${entry._id}/text.txt`,
      text: prevText.text,
      caption: prevText.caption,
    }));
    setFilesToUpload((prevFiles) => [...prevFiles.slice(0, -1), file]);
  };

  const handleTextChange = (e) => {
    setText((prevText) => ({
      file: prevText.file,
      text: e.target.value,
      caption: prevText.caption,
    }));
  };

  const handleCaptionChange = (e) => {
    setText((prevText) => ({
      file: prevText.file,
      text: prevText.text,
      caption: e.target.value,
    }));
  };

  return (
    <div className="text-entry">
      <span>content:</span>
      <textarea value={textContent} onChange={handleTextContentChange} />
      <label>
        <span>text:</span>
        <input type="text" value={text.text} onChange={handleTextChange} />
      </label>
      <label>
        <span>caption:</span>
        <input type="text" value={text.caption} onChange={handleCaptionChange} />
      </label>
    </div>
  );
}
