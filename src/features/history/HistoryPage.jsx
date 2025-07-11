import React, { useState, useEffect, useRef } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { useHistoryData } from './hooks/useHistoryData';
import HistoryMap from './components/HistoryMap';
import HistoryForm from './components/HistoryForm';
import SummaryPanel from './components/SummaryPanel';
import {
  CircularProgress,
  Alert,
} from '@mui/material';

function HistoryPage() {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const { employees, loading: loadingEmployees } = useEmployees();
  const { logs, summary, geofence, loading: loadingHistory, error, fetchData } = useHistoryData();

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(200);
  const timerRef = useRef(null);
  const [isPlaybackActive, setIsPlaybackActive] = useState(false);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    clearInterval(timerRef.current);
    if (isPlaying && logs.length > 0) {
      timerRef.current = setInterval(() => {
        setPlaybackIndex(prevIndex => {
          if (prevIndex < logs.length - 1) {
            return prevIndex + 1;
          }
          setIsPlaying(false);
          setIsPlaybackActive(false);
          return prevIndex;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, logs, playbackSpeed]);

  const handleSubmit = (employeeId, date) => {
    setPageError('');
    setIsPlaying(false);
    setIsPlaybackActive(false);
    setPlaybackIndex(0);
    fetchData(employeeId, date);
  };

  const handlePlayPause = () => {
    if (logs.length === 0) return;
    if (!isPlaybackActive) {
      setIsPlaybackActive(true);
      setPlaybackIndex(0);
    } else if (playbackIndex >= logs.length - 1) {
      setPlaybackIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPlaybackActive(false);
    setPlaybackIndex(0);
  };

  const handleNext = () => {
    if (playbackIndex < logs.length - 1) {
      setIsPlaying(false);
      setIsPlaybackActive(true);
      setPlaybackIndex(playbackIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (playbackIndex > 0) {
      setIsPlaying(false);
      setIsPlaybackActive(true);
      setPlaybackIndex(playbackIndex - 1);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setPlaybackSpeed(newSpeed);
  };

  const handleSliderChange = (event, newValue) => {
    if (logs.length > 0) {
      setIsPlaying(false);
      setIsPlaybackActive(true);
      setPlaybackIndex(newValue);
    }
  };

  const logsForMap = isPlaybackActive ? logs.slice(0, playbackIndex + 1) : logs;
  const currentMarker = isPlaybackActive ? logs[playbackIndex] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Riwayat Perjalanan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lihat dan analisis riwayat perjalanan karyawan berdasarkan tanggal
          </p>
        </div>

        {/* Form Pencarian */}
        <HistoryForm
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          employees={employees}
          loadingEmployees={loadingEmployees}
          loadingHistory={loadingHistory}
          pageError={pageError}
          setPageError={setPageError}
          onSubmit={handleSubmit}
        />

        {/* Layout Flex Column untuk Peta dan Ringkasan */}
        <div id="history-results" className="flex flex-col gap-6">
          {/* Peta - Full Width dan Lebih Tinggi */}
          <div className="history-map-container w-full h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex items-center justify-center">
            {loadingHistory ? (
              <div className="flex flex-col items-center"><CircularProgress /><p className="mt-2 text-gray-600 dark:text-gray-400">Memuat Peta...</p></div>
            ) : (
              <HistoryMap
                logs={logsForMap}
                allLogs={logs}  // Tambahkan logs asli untuk FloatingPlaybackControls
                currentMarker={currentMarker}
                geofence={geofence}
                isPlaying={isPlaying}
                playbackIndex={playbackIndex}
                playbackSpeed={playbackSpeed}
                isPlaybackActive={isPlaybackActive}
                onPlayPause={handlePlayPause}
                onSliderChange={handleSliderChange}
                onSpeedChange={handleSpeedChange}
                onStop={handleStop}
                onNext={handleNext}
                onPrevious={handlePrevious}
                showPlaybackControls={true}
                employeeName={employees.find(emp => emp.id === selectedEmployee)?.name}
                selectedDate={selectedDate}
              />
            )}
          </div>
          
          {/* Summary Panel - Full Width di Bawah Peta */}
          <div className="w-full">
            <SummaryPanel summary={summary} loading={loadingHistory} error={error} />
          </div>
        </div>

        {error && (
          <div className="mt-6">
            <Alert severity="error">Gagal memuat data. Silakan coba lagi.</Alert>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;