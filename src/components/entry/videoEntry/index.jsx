import React, { useRef, useEffect, useState } from 'react';
import './index.scss';

// TODO: move to utils.js
const formatTime = (seconds) => {
  // const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  // const formattedHrs = hrs.toString().padStart(2, '0');
  const formattedMins = mins.toString().padStart(2, '0');
  const formattedSecs = secs.toString().padStart(2, '0');

  // return `${formattedHrs}:${formattedMins}:${formattedSecs}`;
  return `${formattedMins}:${formattedSecs}`;
};

export default function VideoEntry({ entry }) {
  const videoRef = useRef(null);
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [timecode, setTimecode] = useState('');
  const [isPlaying, setIsPlaying] = useState(true); // Assuming autoPlay is true
  const [ccEnabled, setCCEnabled] = useState(true); // Assuming subtitles are enabled by default
  const [wasPlaying, setWasPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (video && video.duration) {
        const value = (video.currentTime / video.duration) * 100;
        setTimecode(formatTime(video.currentTime));
        setProgress(value);
      }
    };

    const handleLoadedMetadata = () => {
      if (video && video.duration) {
        const value = (video.currentTime / video.duration) * 100;
        setProgress(value);
      }
    };

    // Update play/pause state
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Clean up event listeners on component unmount
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handleScrubStart = () => {
    setWasPlaying(!videoRef.current.paused);
    videoRef.current.pause();
  };

  const handleScrubEnd = () => {
    if (wasPlaying) {
      videoRef.current.play();
    }
  };

  const handlePlayPauseClick = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleRewindClick = () => {
    videoRef.current.currentTime = 0;
  };

  const handleCCToggle = () => {
    const textTrack = videoRef.current.textTracks[0]; // Assuming only one track
    if (textTrack) {
      if (textTrack.mode === 'showing') {
        textTrack.mode = 'hidden';
        setCCEnabled(false);
      } else {
        textTrack.mode = 'showing';
        setCCEnabled(true);
      }
    }
  };

  return (
    <div className="video-entry">
      <div className="video-entry-main">
        <div className="video-entry-main-player">
          <video
            className="video-entry-main-player-video"
            ref={videoRef}
            muted
            autoPlay
            loop
            onClick={handlePlayPauseClick}
          >
            <source src={entry.video.file} />
            {entry.video.subtitles && (
              <track
                ref={trackRef}
                kind="subtitles"
                src={entry.video.subtitles}
                srcLang="en"
                label="English"
                default
              />
            )}
          </video>
          <div className="video-entry-main-player-controls">
            <div className="progress-bar">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleProgressChange}
                onPointerDown={handleScrubStart}
                onPointerUp={handleScrubEnd}
                style={{ '--progress': `${progress}%` }}
              />
              <span
                className="timecode"
                style={{ left: `${progress}%` }}
              >
                {timecode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleRewindClick}
            />
            <button
              type="button"
              onClick={handlePlayPauseClick}
              className={isPlaying ? 'pause' : 'play'}
            />
            {
              // entry.video.subtitles && (
              <button
                type="button"
                onClick={handleCCToggle}
                className={ccEnabled ? 'off' : 'on'}
              />
            }
          </div>
        </div>
        <div className="video-entry-main-text">
          <h1>{entry.title}</h1>
          <p>{entry.video.text}</p>
        </div>
      </div>
      <div className="video-entry-caption">{entry.video.caption}</div>
    </div>
  );
}
