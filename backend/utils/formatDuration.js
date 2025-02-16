const formatDuration = (durationMs) => {
    const totalSeconds = Math.floor(durationMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Pad the minutes and seconds with leading zeros if necessary
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(2, '0');

    // If hours are zero, return only minutes and seconds
    if (hours === 0) {
        return `${paddedMinutes}:${paddedSeconds}`;
    } else {
        // Pad hours only when necessary
        const paddedHours = hours.toString().padStart(2, '0');
        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }
};

export default formatDuration