// Utility functions untuk analisis data tracking

/**
 * Menghitung efisiensi kerja berdasarkan berbagai parameter
 */
export const calculateWorkEfficiency = (actualMinutes, expectedMinutes, qualityScore = 1) => {
  if (expectedMinutes === 0) return 0;
  const baseEfficiency = (actualMinutes / expectedMinutes) * 100;
  return Math.min(100, baseEfficiency * qualityScore);
};

/**
 * Menganalisis pola kerja harian
 */
export const analyzeWorkPattern = (logs) => {
  if (!logs || logs.length === 0) return null;

  const patterns = {
    workStreaks: [],
    breakPatterns: [],
    peakHours: {},
    mobilityScore: 0,
    consistencyScore: 0
  };

  let currentStreak = null;
  let totalSwitches = 0;
  let previousStatus = null;

  logs.forEach((log, index) => {
    const timestamp = log.device_timestamp?.toDate?.() || new Date(log.device_timestamp);
    const hour = timestamp.getHours();
    
    // Hitung aktivitas per jam
    patterns.peakHours[hour] = (patterns.peakHours[hour] || 0) + 1;

    // Analisis streak kerja
    if (log.in_geofence) {
      if (!currentStreak) {
        currentStreak = {
          start: timestamp,
          end: timestamp,
          duration: 0
        };
      } else {
        currentStreak.end = timestamp;
        currentStreak.duration = (timestamp - currentStreak.start) / (1000 * 60); // menit
      }
    } else {
      if (currentStreak) {
        patterns.workStreaks.push(currentStreak);
        currentStreak = null;
      }
    }

    // Hitung perpindahan status
    if (previousStatus !== null && previousStatus !== log.in_geofence) {
      totalSwitches++;
    }
    previousStatus = log.in_geofence;
  });

  // Finalisasi streak terakhir
  if (currentStreak) {
    patterns.workStreaks.push(currentStreak);
  }

  // Hitung skor mobilitas (semakin sedikit perpindahan, semakin baik)
  patterns.mobilityScore = Math.max(0, 100 - (totalSwitches * 5));

  // Hitung skor konsistensi berdasarkan variasi streak
  if (patterns.workStreaks.length > 0) {
    const avgStreakDuration = patterns.workStreaks.reduce((sum, streak) => sum + streak.duration, 0) / patterns.workStreaks.length;
    const variance = patterns.workStreaks.reduce((sum, streak) => sum + Math.pow(streak.duration - avgStreakDuration, 2), 0) / patterns.workStreaks.length;
    patterns.consistencyScore = Math.max(0, 100 - Math.sqrt(variance));
  }

  return patterns;
};

/**
 * Memberikan rekomendasi berdasarkan data performa
 */
export const generateRecommendations = (summary) => {
  const recommendations = [];
  
  const workEfficiency = summary.expectedWorkHours > 0 
    ? (summary.totalWorkMinutes / 60) / summary.expectedWorkHours * 100 
    : 0;
  
  const outsidePercentage = summary.totalWorkMinutes + summary.totalOutsideAreaMinutes > 0
    ? (summary.totalOutsideAreaMinutes / (summary.totalWorkMinutes + summary.totalOutsideAreaMinutes)) * 100
    : 0;

  // Rekomendasi berdasarkan efisiensi kerja
  if (workEfficiency < 70) {
    recommendations.push({
      type: 'warning',
      icon: '⚠️',
      title: 'Tingkatkan Jam Kerja',
      message: 'Jam kerja masih di bawah target. Pertimbangkan untuk memulai lebih awal atau mengurangi waktu istirahat.'
    });
  } else if (workEfficiency > 120) {
    recommendations.push({
      type: 'info',
      icon: '💡',
      title: 'Pertimbangkan Work-Life Balance',
      message: 'Jam kerja melebihi target. Pastikan untuk menjaga keseimbangan kehidupan kerja.'
    });
  }

  // Rekomendasi berdasarkan waktu di luar area
  if (outsidePercentage > 30) {
    recommendations.push({
      type: 'warning',
      icon: '📍',
      title: 'Optimalkan Waktu di Area Kerja',
      message: `${outsidePercentage.toFixed(1)}% waktu dihabiskan di luar area kerja. Evaluasi kebutuhan mobilitas.`
    });
  }

  // Rekomendasi berdasarkan pola aktivitas
  if (summary.activityPattern?.totalSwitches > 20) {
    recommendations.push({
      type: 'info',
      icon: '🔄',
      title: 'Stabilkan Pola Kerja',
      message: 'Terlalu banyak perpindahan lokasi. Cobalah untuk lebih fokus di satu area.'
    });
  }

  // Rekomendasi positif
  if (workEfficiency >= 90 && workEfficiency <= 110 && outsidePercentage < 20) {
    recommendations.push({
      type: 'success',
      icon: '🎉',
      title: 'Performa Excellent!',
      message: 'Anda menunjukkan pola kerja yang sangat baik dan konsisten.'
    });
  }

  return recommendations;
};

/**
 * Menghitung scoring overall berdasarkan berbagai faktor
 */
export const calculateOverallScore = (summary) => {
  const weights = {
    efficiency: 0.4,      // 40% - Pencapaian target jam kerja
    productivity: 0.3,    // 30% - Rasio waktu produktif
    consistency: 0.2,     // 20% - Konsistensi pola kerja  
    mobility: 0.1         // 10% - Efisiensi mobilitas
  };

  const workEfficiency = summary.expectedWorkHours > 0 
    ? Math.min(100, (summary.totalWorkMinutes / 60) / summary.expectedWorkHours * 100)
    : 0;

  const productivity = summary.totalWorkMinutes + summary.totalOutsideAreaMinutes > 0
    ? (summary.totalWorkMinutes / (summary.totalWorkMinutes + summary.totalOutsideAreaMinutes)) * 100
    : 0;

  const consistency = summary.activityPattern?.consistencyScore || 70;
  const mobility = summary.activityPattern?.mobilityScore || 70;

  const overallScore = (
    workEfficiency * weights.efficiency +
    productivity * weights.productivity +
    consistency * weights.consistency +
    mobility * weights.mobility
  );

  return {
    overall: Math.round(overallScore),
    breakdown: {
      efficiency: Math.round(workEfficiency),
      productivity: Math.round(productivity),
      consistency: Math.round(consistency),
      mobility: Math.round(mobility)
    }
  };
};

/**
 * Format durasi dari menit ke format yang mudah dibaca
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${Math.round(minutes)} menit`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  
  if (remainingMinutes === 0) {
    return `${hours} jam`;
  }
  return `${hours} jam ${remainingMinutes} menit`;
};

/**
 * Mendapatkan status badge berdasarkan skor
 */
export const getStatusBadge = (score) => {
  if (score >= 90) return { text: 'Excellent', color: 'green', icon: '🏆' };
  if (score >= 80) return { text: 'Good', color: 'blue', icon: '👍' };
  if (score >= 70) return { text: 'Average', color: 'yellow', icon: '⚡' };
  if (score >= 60) return { text: 'Below Average', color: 'orange', icon: '⚠️' };
  return { text: 'Needs Improvement', color: 'red', icon: '🔴' };
};
