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
  IconButton,
  Slider,
  Box,
  Alert,
} from '@mui/material';
import { FaPlay, FaPause } from 'react-icons/fa';

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

      {/* Kontrol Playback */}
      {!loadingHistory && logs.length > 0 && (
        <div className="mb-5 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Kontrol Playback
          </h3>
          <div className="flex items-center gap-4">
            <IconButton onClick={handlePlayPause} className="bg-green-700 text-white hover:bg-green-800">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </IconButton>
            <Slider
              value={playbackIndex}
              min={0}
              max={logs.length - 1}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => logs[value]?.device_timestamp.toDate().toLocaleTimeString('id-ID') || ''}
            />
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Kecepatan</InputLabel>
              <Select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(e.target.value)}
                label="Kecepatan"
              >
                <MenuItem value={400}>0.5x</MenuItem>
                <MenuItem value={200}>1x (Normal)</MenuItem>
                <MenuItem value={100}>2x</MenuItem>
                <MenuItem value={50}>4x</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      )}

      <hr className="my-8 border-gray-300 dark:border-gray-700" />

      {/* Grid untuk Peta dan Ringkasan */}
      <div id="history-results" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex items-center justify-center">
          {loadingHistory ? (
            <div className="flex flex-col items-center"><CircularProgress /><p className="mt-2 text-gray-600 dark:text-gray-400">Memuat Peta...</p></div>
          ) : (
            <HistoryMap
              logs={logsForMap}
              currentMarker={currentMarker}
              geofence={geofence}
            />
          )}
        </div>
        <div className="lg:col-span-1">
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