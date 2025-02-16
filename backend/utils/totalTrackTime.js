function totalTrackTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;

    let parts = [];

    if (hours > 0) {
        parts.push(`${hours} hr`);
        parts.push(`${remainingMinutes} min`);
    } else {
        if (remainingMinutes > 0) {
            parts.push(`${remainingMinutes} min`);
        }
        parts.push(`${remainingSeconds} sec`);
    }

    return parts.join(' ');
}

export default totalTrackTime