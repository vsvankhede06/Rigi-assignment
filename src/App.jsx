import "./styles.css";
import React, { useState, useRef } from "react";
import { v4 as uuid } from "uuid";
import { FiPlay, FiPause } from "react-icons/fi";

const VideoPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    const { duration } = videoRef.current;
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleSpeedChange = (e) => {
    setPlaybackSpeed(parseFloat(e.target.value));
    videoRef.current.playbackRate = parseFloat(e.target.value);
  };

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      ></video>
      <div className="controls">
        <button onClick={togglePlay}>
          {isPlaying ? <FiPause /> : <FiPlay />}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={(currentTime / duration) * 100 || 0}
          onChange={handleSeek}
        />
        <span>
          {new Date(currentTime * 1000).toISOString().substr(11, 8)} /{" "}
          {new Date(duration * 1000).toISOString().substr(11, 8)}
        </span>
        <select value={playbackSpeed} onChange={handleSpeedChange}>
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>
    </div>
  );
};

const Playlist = ({ videos, onSelectVideo }) => {
  const [playlist, setPlaylist] = useState(videos);

  const handleVideoClick = (video) => {
    onSelectVideo(video);
  };

  const handleDragEnd = (e) => {
    const newIndex = parseInt(e.target.dataset.index);
    const draggedItem = playlist.find(
      (item) => item.id === e.dataTransfer.getData("text/plain"),
    );
    const newPlaylist = [...playlist];
    newPlaylist.splice(newIndex, 0, draggedItem);
    setPlaylist(newPlaylist);
  };

  return (
    <div className="playlist">
      {playlist.map((video, index) => (
        <div
          key={video.id}
          data-index={index}
          draggable
          onDragEnd={handleDragEnd}
          onClick={() => handleVideoClick(video)}
        >
          {video.title}
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const videos = [
    { id: uuid(), title: "Video 1", src: "video1.mp4" },
    { id: uuid(), title: "Video 2", src: "video2.mp4" },
    { id: uuid(), title: "Video 3", src: "video3.mp4" },
  ];
  const [currentVideo, setCurrentVideo] = useState(videos[0]);

  const handleSelectVideo = (video) => {
    setCurrentVideo(video);
  };

  return (
    <div className="app">
      <VideoPlayer src={currentVideo.src} />
      <Playlist videos={videos} onSelectVideo={handleSelectVideo} />
    </div>
  );
};

export default App;
