import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const SummaryPanel = ({ summary, loading, error }) => {
  const panelContainerStyle = {
    padding: { xs: 2, md: 3 },
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const detailSectionStyle = {
    marginTop: '25px',
    textAlign: 'center',
    width: '100%',
  };

  if (loading) {
    return (
      <Paper elevation={4} sx={panelContainerStyle}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
          <CircularProgress sx={{ color: 'primary.main' }} size={40} />
          <Typography variant="subtitle1" sx={{ mt: 2, color: '#555' }}>
            Mencari data ringkasan...
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={4} sx={panelContainerStyle}>
        <Alert severity="error" sx={{ width: '100%' }}>
          Gagal memuat data ringkasan. Silakan coba lagi.
        </Alert>
      </Paper>
    );
  }

  if (!summary) {
    return (
      <Paper elevation={4} sx={panelContainerStyle}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600, mb: 2 }}>
          Ringkasan Harian
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', textAlign: 'center' }}>
          Data ringkasan aktivitas akan muncul di sini setelah ada perjalanan.
        </Typography>
      </Paper>
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
        backgroundColor: [
          '#2b8c3d',
          '#E74C3C',
        ],
        borderColor: [
          '#FFFFFF',
          '#FFFFFF',
        ],
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
          font: {
            size: 13,
            family: 'Roboto, sans-serif'
          },
          boxWidth: 20,
        },
      },
      datalabels: {
        formatter: (value, context) => {
          if (value === 0) return null;
          const total = context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
          const percentage = (value / total * 100).toFixed(1);
          return `${percentage}%`;
        },
        color: '#333',
        font: {
          weight: 'bold',
          size: 15,
          family: 'Roboto, sans-serif'
        },
        anchor: 'center',
        align: 'center',
      },
      tooltip: {
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 15,
          weight: 'bold',
        },
        padding: 10,
      }
    },
  };

  return (
    <Paper elevation={4} sx={panelContainerStyle}>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, color: 'primary.main', fontWeight: 700 }}>
        Ringkasan Aktivitas Harian
      </Typography>

      <Box sx={{ height: '250px', width: '100%', position: 'relative' }}>
        <Doughnut options={chartOptions} data={chartData} plugins={[ChartDataLabels]} />
      </Box>

      <Box sx={{ ...detailSectionStyle, fontSize: '0.9em' }}>
        <p style={{ margin: '0 0 8px 0', color: '#444' }}>
          <strong>Di Area Kerja:</strong> {summary.totalWorkMinutes.toFixed(1)} menit ({workPercentage.toFixed(1)}%)
        </p>
        <p style={{ margin: '0 0 8px 0', color: '#444' }}>
          <strong>Di Luar Area:</strong> {summary.totalOutsideAreaMinutes.toFixed(1)} menit ({outsidePercentage.toFixed(1)}%)
        </p>
        {/* --- START: Ganti penggunaan updateInfoStyle dengan inline style langsung --- */}
        <p style={{
            marginTop: '20px',
            color: '#666',
            borderTop: '1px solid #eee',
            paddingTop: '15px',
            margin: 0 // Pastikan margin juga diatur di sini
        }}>
          Update Terakhir: {summary.lastUpdate && summary.lastUpdate.toDate ? summary.lastUpdate.toDate().toLocaleString('id-ID') : 'N/A'}
        </p>
        {/* --- END: Ganti penggunaan updateInfoStyle dengan inline style langsung --- */}
      </Box>
    </Paper>
  );
};

export default SummaryPanel;