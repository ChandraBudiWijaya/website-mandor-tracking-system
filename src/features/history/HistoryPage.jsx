import React, { useState, useEffect, useRef } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { useHistoryData } from './hooks/useHistoryData';
import HistoryMap from './components/HistoryMap';
import SummaryPanel from './components/SummaryPanel';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Button,
  Box,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setPageError('');
    if (!selectedEmployee || !selectedDate) {
      setPageError('Silakan pilih karyawan dan tanggal terlebih dahulu.');
      return;
    }
    setIsPlaying(false);
    setIsPlaybackActive(false);
    setPlaybackIndex(0);
    fetchData(selectedEmployee, selectedDate);
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
    // [DARK MODE] Tambahkan warna latar gelap
    <div className="p-5 bg-gray-100 dark:bg-gray-900 min-h-[calc(100vh-70px)] transition-colors duration-300">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Riwayat Perjalanan
      </h1>

      {/* Form Pencarian */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="mb-5 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col sm:flex-row flex-wrap items-end gap-4"
      >
        <div className="w-full sm:w-auto sm:min-w-[200px]">
          <FormControl fullWidth>
            <InputLabel>Pilih Karyawan</InputLabel>
            <Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              label="Pilih Karyawan"
              disabled={loadingEmployees}
            >
              <MenuItem value="">
                {loadingEmployees && <CircularProgress size={20} className="mr-2" />}
                {loadingEmployees ? 'Memuat...' : '-- Pilih Mandor --'}
              </MenuItem>
              {employees.map(emp => (
                <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="w-full sm:w-auto sm:min-w-[160px]">
          <TextField
            fullWidth
            label="Pilih Tanggal"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          disabled={loadingHistory || loadingEmployees}
          className="w-full sm:w-auto bg-green-700 hover:bg-green-800"
        >
          {loadingHistory ? 'Mencari...' : 'Tampilkan Riwayat'}
        </Button>
      </Box>

      {pageError && (
        <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setPageError('')}>
          {pageError}
        </Alert>
      )}

      <hr className="my-8 border-gray-300 dark:border-gray-700" />

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
        <div className="p-5 mt-4">
          <Alert severity="error">Gagal memuat data. Silakan coba lagi.</Alert>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;