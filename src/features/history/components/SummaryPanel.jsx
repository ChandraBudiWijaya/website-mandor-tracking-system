import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  generateRecommendations, 
  calculateOverallScore, 
  getStatusBadge 
} from '../utils/analyticsUtils';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, BarElement, CategoryScale, LinearScale);

const SummaryPanel = ({ summary, loading, error }) => {
  const theme = useTheme(); // Dapatkan tema saat ini
  const isDarkMode = theme.palette.mode === 'dark';

  // [OPTIMIZED FOR FULL WIDTH] Tambahkan warna latar dan layout horizontal
  const panelContainerClass = "p-6 rounded-xl shadow-lg w-full bg-white dark:bg-gray-800";

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

  // Perhitungan existing
  const totalMinutes = summary.totalWorkMinutes + summary.totalOutsideAreaMinutes;
  const workPercentage = totalMinutes > 0 ? (summary.totalWorkMinutes / totalMinutes) * 100 : 0;
  const outsidePercentage = totalMinutes > 0 ? (summary.totalOutsideAreaMinutes / totalMinutes) * 100 : 0;

  // Perhitungan tambahan untuk analisis yang lebih mendalam
  const expectedWorkMinutes = (summary.expectedWorkHours || 8) * 60; // Default 8 jam kerja
  const actualWorkMinutes = summary.totalWorkMinutes || 0;
  const workEfficiencyRatio = expectedWorkMinutes > 0 ? (actualWorkMinutes / expectedWorkMinutes) * 100 : 0;
  
  // Konversi menit ke jam untuk tampilan yang lebih user-friendly
  const actualWorkHours = actualWorkMinutes / 60;
  const expectedWorkHours = expectedWorkMinutes / 60;
  const totalActiveHours = totalMinutes / 60;
  
  // Perhitungan produktivitas dan insight tambahan
  const productivityScore = totalMinutes > 0 ? (actualWorkMinutes / totalMinutes) * 100 : 0;
  const overtimeMinutes = Math.max(0, actualWorkMinutes - expectedWorkMinutes);
  const shortfallMinutes = Math.max(0, expectedWorkMinutes - actualWorkMinutes);
  
  // Status kerja berdasarkan efisiensi
  const overallScore = calculateOverallScore(summary);
  const statusBadge = getStatusBadge(overallScore.overall);
  const recommendations = generateRecommendations(summary);
  
  let workStatus = '';
  let statusColor = '';
  if (workEfficiencyRatio >= 100) {
    workStatus = 'Target Tercapai';
    statusColor = 'text-green-600 dark:text-green-400';
  } else if (workEfficiencyRatio >= 80) {
    workStatus = 'Mendekati Target';
    statusColor = 'text-yellow-600 dark:text-yellow-400';
  } else {
    workStatus = 'Di Bawah Target';
    statusColor = 'text-red-600 dark:text-red-400';
  }

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
      <h2 className="text-2xl text-center mb-6 text-green-700 dark:text-green-400 font-bold">
        📊 Ringkasan Aktivitas Harian
      </h2>
      
      {/* Layout Grid untuk Charts dan Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Chart Utama - Distribusi Waktu */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Distribusi Waktu
          </h3>
          <div className="h-[200px] w-full relative max-w-[250px]">
            <Doughnut options={chartOptions} data={chartData} plugins={[ChartDataLabels]} />
          </div>
        </div>

        {/* Chart Perbandingan Target vs Aktual */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Target vs Aktual
          </h3>
          <div className="h-[200px] w-full">
            <Bar
              data={{
                labels: ['Jam Kerja'],
                datasets: [
                  {
                    label: 'Target',
                    data: [expectedWorkHours],
                    backgroundColor: isDarkMode ? '#4ade80' : '#22c55e',
                    borderColor: isDarkMode ? '#22c55e' : '#16a34a',
                    borderWidth: 1,
                  },
                  {
                    label: 'Aktual',
                    data: [actualWorkHours],
                    backgroundColor: workEfficiencyRatio >= 80 
                      ? (isDarkMode ? '#3b82f6' : '#2563eb')
                      : (isDarkMode ? '#f59e0b' : '#d97706'),
                    borderColor: workEfficiencyRatio >= 80 
                      ? (isDarkMode ? '#2563eb' : '#1d4ed8')
                      : (isDarkMode ? '#d97706' : '#b45309'),
                    borderWidth: 1,
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: Math.max(expectedWorkHours, actualWorkHours) * 1.2,
                    ticks: {
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                    },
                    grid: {
                      color: isDarkMode ? '#374151' : '#e5e7eb',
                    }
                  },
                  x: {
                    ticks: {
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                    },
                    grid: {
                      color: isDarkMode ? '#374151' : '#e5e7eb',
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                      font: { size: 12, family: 'Poppins, sans-serif' },
                    }
                  },
                  datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: (value) => `${value.toFixed(1)}h`,
                    color: isDarkMode ? '#FFFFFF' : '#333',
                    font: { weight: 'bold', size: 12 },
                  }
                }
              }}
              plugins={[ChartDataLabels]}
            />
          </div>
        </div>

        {/* Overall Score Badge - Centerpiece */}
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Skor Overall
          </h3>
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 px-6 py-4 rounded-full shadow-lg border border-green-200 dark:border-green-700">
              <span className="text-3xl">{statusBadge.icon}</span>
              <div>
                <div className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                  {overallScore.overall}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {statusBadge.text}
                </div>
              </div>
            </div>
          </div>
          {/* Progress Bar Overall */}
          <div className="w-full max-w-[200px] mt-4">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{overallScore.overall}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  overallScore.overall >= 90 ? 'bg-green-500' :
                  overallScore.overall >= 80 ? 'bg-blue-500' :
                  overallScore.overall >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${overallScore.overall}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Grid Layout untuk Detail Informasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Status Utama */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold text-base mb-3 text-gray-800 dark:text-gray-200">
            📊 Status Kerja
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`font-semibold ${statusColor}`}>{workStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Efisiensi:</span>
              <span className={`font-semibold ${workEfficiencyRatio >= 80 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {workEfficiencyRatio.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Detail Waktu Kerja */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold text-base mb-3 text-gray-800 dark:text-gray-200">
            ⏰ Waktu Kerja
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Target:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {expectedWorkHours.toFixed(1)}h
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Aktual:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {actualWorkHours.toFixed(1)}h
              </span>
            </div>
            {overtimeMinutes > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Overtime:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  +{(overtimeMinutes / 60).toFixed(1)}h
                </span>
              </div>
            )}
            {shortfallMinutes > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Kurang:</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -{(shortfallMinutes / 60).toFixed(1)}h
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Distribusi Aktivitas */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold text-base mb-3 text-gray-800 dark:text-gray-200">
            📍 Distribusi
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {totalActiveHours.toFixed(1)}h
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Area Kerja:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {workPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Luar Area:</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                {outsidePercentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Produktivitas:</span>
              <span className={`font-semibold ${productivityScore >= 70 ? 'text-green-600 dark:text-green-400' : productivityScore >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                {productivityScore.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Pola Aktivitas */}
        {summary.activityPattern && (
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
            <h3 className="font-semibold text-base mb-3 text-purple-800 dark:text-purple-300">
              📈 Pola Aktivitas
            </h3>
            <div className="space-y-2 text-sm">
              {summary.activityPattern.peakActivityHour && (
                <div className="flex justify-between">
                  <span className="text-purple-600 dark:text-purple-400">Jam Puncak:</span>
                  <span className="font-medium text-purple-800 dark:text-purple-200">
                    {summary.activityPattern.peakActivityHour}:00
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-purple-600 dark:text-purple-400">Perpindahan:</span>
                <span className="font-medium text-purple-800 dark:text-purple-200">
                  {summary.activityPattern.totalSwitches}x
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-600 dark:text-purple-400">Data Points:</span>
                <span className="font-medium text-purple-800 dark:text-purple-200">
                  {summary.totalDataPoints || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-600 dark:text-purple-400">Stabilitas:</span>
                <span className={`font-medium ${summary.activityPattern.totalSwitches <= 10 ? 'text-green-600 dark:text-green-400' : summary.activityPattern.totalSwitches <= 20 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                  {summary.activityPattern.totalSwitches <= 10 ? 'Stabil' : summary.activityPattern.totalSwitches <= 20 ? 'Sedang' : 'Rendah'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Breakdown Scores dalam Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {overallScore.breakdown.efficiency}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Efisiensi Target
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {overallScore.breakdown.productivity}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Produktivitas
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {overallScore.breakdown.consistency}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Konsistensi
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {overallScore.breakdown.mobility}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Efisiensi Mobilitas
          </div>
        </div>
      </div>

      {/* Rekomendasi dan Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rekomendasi Dinamis */}
        {recommendations.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">
              💡 Rekomendasi Personal
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    rec.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :
                    rec.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                    'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{rec.icon}</span>
                    <div>
                      <h4 className={`font-medium text-sm ${
                        rec.type === 'success' ? 'text-green-800 dark:text-green-200' :
                        rec.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                        'text-blue-800 dark:text-blue-200'
                      }`}>
                        {rec.title}
                      </h4>
                      <p className={`text-xs mt-1 ${
                        rec.type === 'success' ? 'text-green-700 dark:text-green-300' :
                        rec.type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
                        'text-blue-700 dark:text-blue-300'
                      }`}>
                        {rec.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Insight Umum */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-blue-800 dark:text-blue-300">
            💡 Insight & Analisis
          </h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="text-sm text-blue-700 dark:text-blue-200 space-y-2">
              {workEfficiencyRatio >= 100 ? (
                <p>✅ Excellent! Target kerja telah tercapai atau terlampaui.</p>
              ) : workEfficiencyRatio >= 80 ? (
                <p>⚠️ Hampir mencapai target, pertahankan konsistensi kerja.</p>
              ) : (
                <p>🔔 Masih di bawah target, perlu peningkatan fokus kerja.</p>
              )}
              
              {outsidePercentage > 30 && (
                <p>📍 Waktu di luar area kerja cukup tinggi ({outsidePercentage.toFixed(1)}%), perlu evaluasi aktivitas.</p>
              )}
              
              {productivityScore < 60 && (
                <p>⏱️ Skor produktivitas rendah, pertimbangkan optimalisasi jadwal kerja.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Update Terakhir */}
      <div className="text-center pt-6 mt-6 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Update Terakhir: {summary.lastUpdate?.toDate ? summary.lastUpdate.toDate().toLocaleString('id-ID') : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default SummaryPanel;