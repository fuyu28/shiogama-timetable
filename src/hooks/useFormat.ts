export const useFormat = () => {
  const formatTime = (date: Date): string => {
    // HH:MM:SS
    return [date.getHours(), date.getMinutes(), date.getSeconds()]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");
  };

  const formatTimeHHMM = (date: Date): string => {
    // HH:MM (秒なし)
    return [date.getHours(), date.getMinutes()]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");
  };

  const formatDateTime = (date: Date): string => {
    // YYYY/MM/DD HH:MM:SS
    const dateStr = date.toLocaleDateString("ja-JP");
    const timeStr = formatTime(date);
    return `${dateStr} ${timeStr}`;
  };

  return {
    formatTime,
    formatTimeHHMM,
    formatDateTime,
  };
};
