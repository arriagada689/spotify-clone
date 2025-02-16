const parseDuration = (duration) => {
    const parts = duration.split(':').reverse();
    let totalSeconds = 0;
    
    if (parts.length > 0) totalSeconds += parseInt(parts[0], 10); // seconds
    if (parts.length > 1) totalSeconds += parseInt(parts[1], 10) * 60; // minutes
    if (parts.length > 2) totalSeconds += parseInt(parts[2], 10) * 3600; // hours
    
    return totalSeconds;
};

export default parseDuration