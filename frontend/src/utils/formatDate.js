function dateConverter(dateStr) {
    const dateObj = new Date(dateStr);

    const year = dateObj.getFullYear();
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const day = dateObj.getDate();

    const formattedDate = `${month} ${day}, ${year}`;
    return formattedDate;
}

function formatDate(dateString) {
    const date = dateString.slice(0, 10);
    return dateConverter(date);
}

export default formatDate