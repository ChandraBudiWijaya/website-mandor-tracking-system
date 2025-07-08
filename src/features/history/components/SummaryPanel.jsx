import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Impor hook useTheme

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const SummaryPanel = ({ summary, loading, error }) => {
  const theme = useTheme(); // Dapatkan tema saat ini
  const isDarkMode = theme.palette.mode === 'dark';

  // [DARK MODE] Tambahkan warna latar dan teks gelap
  const panelContainerClass = "p-6 rounded-xl shadow-lg h-full flex flex-col items-center bg-white dark:bg-gray-800";

  if (loading) {
    return (
      <div className={`${panelContainerClass} justify-center`}>
        <CircularProgress />
        <p className="mt-3 text-gray-600 dark:text-gray-400">Mencari data ringkasan...</p>
      </div>
    );
  }

  if (error) {
    return <div className={panelContainerClass}><Alert severity="error" className="w-full">Gagal memuat data.</Alert></div>;
  }

  if (!summary) {
    return (
      <div className={`${panelContainerClass} justify-center text-center`}>
        <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Ringkasan Harian</h2>
        <p className="text-gray-600 dark:text-gray-400">Data ringkasan akan muncul di sini.</p>
      </div>
    );
  }

  const totalMinutes = summary.totalWorkMinutes + summary.totalOutsideAreaMinutes;
  const workPercentage = totalMinutes > 0 ? (summary.totalWorkMinutes / totalMinutes) * 100 : 0;
  const outsidePercentage = totalMinutes > 0 ? (summary.totalOutsideAreaMinutes / totalMinutes) * 100 : 0;

  const chartData = {
    labels: ['Di Area Kerja', 'Di Luar Area'],
    datasets: [{
      data: [summary.totalWorkMinutes, summary.totalOutsideAreaMinutes],
      backgroundColor: ['#2b8c3d', '#E74C3C'],
      borderColor: [isDarkMode ? '#1f2937' : '#FFFFFF'], // Sesuaikan border chart
      borderWidth: 3,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 25,
          color: isDarkMode ? '#9ca3af' : '#6b7280', // Sesuaikan warna teks legenda
          font: { size: 13, family: 'Poppins, sans-serif' },
          boxWidth: 20,
        },
      },
      datalabels: {
        formatter: (value, context) => {
          if (value === 0) return null;
          const total = context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
        color: isDarkMode ? '#FFFFFF' : '#333', // Sesuaikan warna teks data label
        font: { weight: 'bold', size: 15, family: 'Poppins, sans-serif' },
      },
      tooltip: {
        bodyFont: { size: 14 },
        titleFont: { size: 15, weight: 'bold' },
        padding: 10,
      }
    },
  };

  return (
    <div className={panelContainerClass}>
      <h2 className="text-xl text-center mb-4 text-green-700 dark:text-green-400 font-bold">
        Ringkasan Aktivitas Harian
      </h2>
      <div className="h-[250px] w-full relative">
        <Doughnut options={chartOptions} data={chartData} plugins={[ChartDataLabels]} />
      </div>
      <div className="mt-6 text-center w-full text-sm">
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          <strong>Di Area Kerja:</strong> {summary.totalWorkMinutes.toFixed(1)} menit ({workPercentage.toFixed(1)}%)
        </p>
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          <strong>Di Luar Area:</strong> {summary.totalOutsideAreaMinutes.toFixed(1)} menit ({outsidePercentage.toFixed(1)}%)
        </p>
        <p className="mt-5 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          Update Terakhir: {summary.lastUpdate?.toDate ? summary.lastUpdate.toDate().toLocaleString('id-ID') : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default SummaryPanel;