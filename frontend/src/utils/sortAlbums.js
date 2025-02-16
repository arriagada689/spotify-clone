function sortAlbumsByReleaseDate(albums) {
    return albums.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
}

export default sortAlbumsByReleaseDate;