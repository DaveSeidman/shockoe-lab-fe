import React, { useState, useRef } from 'react';
import fallbackVideo from '../../../../assets/videos/fallback.mp4';
import { s3Bucket } from '../../../../config.json';
import './index.scss';

export default function VideoEntry({ entry, video, setVideo, setFilesToUpload, setFilesToRemove }) {
  const [previewVideo, setPreviewVideo] = useState(null);
  const videoRef = useRef();
  const handleFileChange = (e) => {
    const fileSelected = e.target.files[0];
    if (fileSelected) {
      setPreviewVideo(URL.createObjectURL(fileSelected));
      videoRef.current.load();

      setVideo((prevVideo) => ({
        file: `${s3Bucket}/${entry._id}/${fileSelected.name}`,
        text: prevVideo.text,
        caption: prevVideo.caption,
      }));

      setFilesToUpload((prevFiles) => [...prevFiles, fileSelected]);
    }
  };

  const handleTextChange = (e) => {
    setVideo((prevVideo) => ({
      file: prevVideo.file,
      text: e.target.value,
      caption: prevVideo.caption,
    }));
  };

  const handleCaptionChange = (e) => {
    setVideo((prevVideo) => ({
      file: prevVideo.file,
      text: prevVideo.text,
      caption: e.target.value,
    }));
  };

  const { file, text, caption } = video;

  return (
    <div className="video-entry">
      <label>
        <span>file:</span>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
        />
      </label>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        controls
        className="overlay-content-video"
        onCanPlay={(e) => {
          console.log('can play');
          e.target.play();
        }}
      >
        <source src={previewVideo || file || fallbackVideo} alt="Entry" />
      </video>
      <label>
        <span>text:</span>
        <input type="text" value={text} onChange={handleTextChange} />
      </label>
      <label>
        <span>caption:</span>
        <input type="text" value={caption} onChange={handleCaptionChange} />
      </label>
    </div>
  );
}
