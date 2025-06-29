// src/features/history/components/SummaryPanel.jsx

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Komponen MUI yang masih kita butuhkan
import { CircularProgress, Alert } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const SummaryPanel = ({ summary, loading, error }) => {
  // Container utama dengan styling Tailwind
  const panelContainerClass = "p-4 md:p-6 rounded-xl shadow-lg h-full flex flex-col items-center bg-white";

  if (loading) {
    return (
      <div className={`${panelContainerClass} justify-center`}>
        <CircularProgress size={40} />
        <p className="mt-3 text-gray-600">Mencari data ringkasan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={panelContainerClass}>
        <Alert severity="error" className="w-full">
          Gagal memuat data ringkasan. Silakan coba lagi.
        </Alert>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className={`${panelContainerClass} justify-center text-center`}>
        <h2 className="text-xl font-bold text-green-700 mb-2">
          Ringkasan Harian
        </h2>
        <p className="text-gray-600">
          Data ringkasan aktivitas akan muncul di sini setelah ada perjalanan.
        </p>
      </div>
    );
  }

  const totalMinutes = summary.totalWorkMinutes + summary.totalOutsideAreaMinutes;
  const workPercentage = totalMinutes > 0 ? (summary.totalWorkMinutes / totalMinutes) * 100 : 0;
  const outsidePercentage = totalMinutes > 0 ? (summary.totalOutsideAreaMinutes / totalMinutes) * 100 : 0;

  const chartData = {
    labels: ['Di Area Kerja', 'Di Luar Area'],
    datasets: [
      {
        data: [summary.totalWorkMinutes, summary.totalOutsideAreaMinutes],
        backgroundColor: ['#2b8c3d', '#E74C3C'],
        borderColor: ['#FFFFFF', '#FFFFFF'],
        borderWidth: 3,
      },
    ],
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
        color: '#333',
        font: {
          weight: 'bold',
          size: 15,
          family: 'Poppins, sans-serif'
        },
        anchor: 'center',
        align: 'center',
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
      <h2 className="text-xl text-center mb-4 text-green-700 font-bold">
        Ringkasan Aktivitas Harian
      </h2>

      <div className="h-[250px] w-full relative">
        <Doughnut options={chartOptions} data={chartData} plugins={[ChartDataLabels]} />
      </div>

      <div className="mt-6 text-center w-full text-sm">
        <p className="mb-2 text-gray-700">
          <strong>Di Area Kerja:</strong> {summary.totalWorkMinutes.toFixed(1)} menit ({workPercentage.toFixed(1)}%)
        </p>
        <p className="mb-2 text-gray-700">
          <strong>Di Luar Area:</strong> {summary.totalOutsideAreaMinutes.toFixed(1)} menit ({outsidePercentage.toFixed(1)}%)
        </p>
        <p className="mt-5 text-gray-500 border-t border-gray-200 pt-4">
          Update Terakhir: {summary.lastUpdate?.toDate ? summary.lastUpdate.toDate().toLocaleString('id-ID') : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default SummaryPanel;