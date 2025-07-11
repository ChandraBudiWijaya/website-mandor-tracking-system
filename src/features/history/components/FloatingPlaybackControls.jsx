import React, { useState, useRef, useEffect } from 'react';
import { IconButton, Slider, FormControl, Select, MenuItem, Tooltip } from '@mui/material';
import { FaPlay, FaPause, FaForward, FaBackward, FaStop, FaChevronUp, FaChevronDown, FaExpand, FaCompress } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';

const FloatingPlaybackControls = ({
  logs,
  isPlaying,
  playbackIndex,
  playbackSpeed,
  isPlaybackActive,
  onPlayPause,
  onSliderChange,
  onSpeedChange,
  onStop,
  onNext,
  onPrevious,
  // Info untuk fullscreen
  employeeName,
  selectedDate
}) => {
  const [isMinimized, setIsMinimized] = useState(true); // Default ke minimized
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const speedMenuRef = useRef(null);
  
  // Close speed menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(event.target)) {
        setShowSpeedMenu(false);
      }
    };

    if (showSpeedMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSpeedMenu]);
  
  // Helper function untuk mendapatkan label speed
  const getSpeedLabel = (speed) => {
    switch(speed) {
      case 400: return '0.5x';
      case 200: return '1x';
      case 100: return '2x';
      case 50: return '4x';
      default: return '1x';
    }
  };

  const handleMapFullscreen = () => {
    const mapContainer = document.querySelector('.history-map-container');
    
    if (!mapContainer) {
      console.warn('Map container not found for fullscreen');
      return;
    }
    
    if (!isMapFullscreen) {
      // Enter fullscreen
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen().catch(err => {
          console.error('Error attempting to enable fullscreen:', err);
        });
      } else if (mapContainer.webkitRequestFullscreen) {
        mapContainer.webkitRequestFullscreen();
      } else if (mapContainer.msRequestFullscreen) {
        mapContainer.msRequestFullscreen();
      } else if (mapContainer.mozRequestFullScreen) {
        mapContainer.mozRequestFullScreen();
      } else {
        console.warn('Fullscreen API is not supported');
        return;
      }
      setIsMapFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error('Error attempting to exit fullscreen:', err);
        });
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
      setIsMapFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsMapFullscreen(isFullscreen);
    };
    
    // Add event listeners for different browsers
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  if (!logs || logs.length === 0) return null;

  const getCurrentTime = () => {
    if (logs[playbackIndex]?.device_timestamp) {
      return logs[playbackIndex].device_timestamp.toDate?.() 
        ? logs[playbackIndex].device_timestamp.toDate().toLocaleTimeString('id-ID')
        : new Date(logs[playbackIndex].device_timestamp).toLocaleTimeString('id-ID');
    }
    return '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Floating Info untuk Fullscreen Mode */}
      {isMapFullscreen && (employeeName || selectedDate) && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1001] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-600/50 p-4 max-w-[320px]">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
              <span className="text-blue-600 dark:text-blue-400 text-lg">👤</span>
            </div>
            <div className="flex-1">
              {employeeName && (
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                  {employeeName}
                </h3>
              )}
              {selectedDate && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  📅 {formatDate(selectedDate)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Playback Controls */}
      <div className={`absolute bottom-4 right-4 z-[1000] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-600/50 transition-all duration-300 ${
        isMinimized ? 'p-2' : 'p-3'
      } ${isMinimized ? 'min-w-[160px]' : 'min-w-[280px] max-w-[320px]'}`}>
      
      {/* Slim Minimized View */}
      {isMinimized ? (
        <div className="flex items-center justify-between gap-2">
          {/* Play/Pause Button */}
          <Tooltip title={isPlaying ? "Pause" : "Play"}>
            <IconButton 
              onClick={onPlayPause}
              size="small"
              className="bg-green-600 hover:bg-green-700 text-white"
              sx={{ width: 28, height: 28 }}
            >
              {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
            </IconButton>
          </Tooltip>
          
          {/* Progress Info */}
          <div className="flex-1 px-2">
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center mb-1">
              {playbackIndex + 1}/{logs.length}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-200"
                style={{ width: `${((playbackIndex + 1) / logs.length) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center gap-1">
            <Tooltip title="Fullscreen Map">
              <IconButton 
                size="small"
                onClick={handleMapFullscreen}
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                sx={{ width: 24, height: 24 }}
              >
                {isMapFullscreen ? <FaCompress size={8} /> : <FaExpand size={8} />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Expand">
              <IconButton 
                size="small"
                onClick={() => setIsMinimized(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                sx={{ width: 24, height: 24 }}
              >
                <FaChevronUp size={8} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ) : (
        /* Compact Full View */
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
              📹 Playback
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {playbackIndex + 1}/{logs.length}
              </span>
              <Tooltip title="Fullscreen Map">
                <IconButton 
                  size="small"
                  onClick={handleMapFullscreen}
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                  sx={{ width: 20, height: 20 }}
                >
                  {isMapFullscreen ? <FaCompress size={8} /> : <FaExpand size={8} />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Minimize">
                <IconButton 
                  size="small"
                  onClick={() => setIsMinimized(true)}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  sx={{ width: 20, height: 20 }}
                >
                  <FaChevronDown size={8} />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {/* Current Time - More Compact */}
          <div className="text-center mb-2">
            <div className="text-xs font-mono text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-center">
              {getCurrentTime()}
            </div>
          </div>

          {/* Control Buttons - More Compact */}
          <div className="flex items-center justify-center gap-1 mb-2">
            <Tooltip title="Previous">
              <IconButton 
                size="small"
                onClick={onPrevious}
                disabled={playbackIndex <= 0}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                sx={{ width: 28, height: 28 }}
              >
                <FaBackward size={10} />
              </IconButton>
            </Tooltip>

            <Tooltip title={isPlaying ? "Pause" : "Play"}>
              <IconButton 
                onClick={onPlayPause}
                className="bg-green-600 hover:bg-green-700 text-white mx-1"
                sx={{ width: 32, height: 32 }}
              >
                {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Next">
              <IconButton 
                size="small"
                onClick={onNext}
                disabled={playbackIndex >= logs.length - 1}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                sx={{ width: 28, height: 28 }}
              >
                <FaForward size={10} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Stop">
              <IconButton 
                size="small"
                onClick={onStop}
                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                sx={{ width: 28, height: 28 }}
              >
                <FaStop size={10} />
              </IconButton>
            </Tooltip>
          </div>

          {/* Progress Slider - More Compact */}
          <div className="mb-2">
            <Slider
              value={playbackIndex}
              min={0}
              max={logs.length - 1}
              onChange={onSliderChange}
              size="small"
              sx={{
                color: '#16a34a',
                height: 4,
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                },
                '& .MuiSlider-track': {
                  height: 3,
                },
                '& .MuiSlider-rail': {
                  height: 3,
                  opacity: 0.3,
                },
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{Math.round(((playbackIndex + 1) / logs.length) * 100)}%</span>
              <span>{getSpeedLabel(playbackSpeed)}</span>
            </div>
          </div>

          {/* Speed Control - More Compact */}
          <div className="flex items-center gap-2">
            <MdSpeed className="text-gray-600 dark:text-gray-400" size={12} />
            
            {/* Custom Speed Control untuk Fullscreen */}
            {isMapFullscreen ? (
              <div className="relative flex-1" ref={speedMenuRef}>
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="w-full h-6 px-2 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <span className="text-gray-800 dark:text-gray-200">{getSpeedLabel(playbackSpeed)}</span>
                  <span className="text-gray-400">▼</span>
                </button>
                
                {showSpeedMenu && (
                  <div className="absolute bottom-full left-0 w-full mb-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-[999999]">
                    {[
                      { value: 400, label: '0.5x' },
                      { value: 200, label: '1x' },
                      { value: 100, label: '2x' },
                      { value: 50, label: '4x' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onSpeedChange(option.value);
                          setShowSpeedMenu(false);
                        }}
                        className={`w-full px-2 py-1 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-600 ${
                          playbackSpeed === option.value 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                            : 'text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Normal Select untuk non-fullscreen */
              <FormControl size="small" className="flex-1">
                <Select
                  value={playbackSpeed}
                  onChange={(e) => onSpeedChange(e.target.value)}
                  variant="outlined"
                  sx={{
                    height: 24,
                    fontSize: '0.7rem',
                    '& .MuiSelect-select': {
                      padding: '2px 6px',
                    }
                  }}
                >
                  <MenuItem value={400} style={{ fontSize: '0.7rem' }}>0.5x</MenuItem>
                  <MenuItem value={200} style={{ fontSize: '0.7rem' }}>1x</MenuItem>
                  <MenuItem value={100} style={{ fontSize: '0.7rem' }}>2x</MenuItem>
                  <MenuItem value={50} style={{ fontSize: '0.7rem' }}>4x</MenuItem>
                </Select>
              </FormControl>
            )}
            
            {/* Status Indicator */}
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                isPlaying ? 'bg-green-500 animate-pulse' : 
                isPlaybackActive ? 'bg-yellow-500' : 'bg-gray-400'
              }`} />
            </div>
          </div>
        </>
      )}
      </div>
    </>
  );
};

export default FloatingPlaybackControls;
