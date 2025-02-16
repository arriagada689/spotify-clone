import express from 'express'
import { 
    getHomeData, 
    getPopularArtists, 
    getPopularAlbums, 
    getFeaturedPlaylists,
    getNewReleases,
    getCategories,
    search,
    getTrackData,
    getArtistData,
    getArtistDiscography,
    getAlbumData,
    getPlaylistData,
    getAudiobookData,
    getUserData,
    getRecommendedTracks
} from '../controllers/spotifyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/home', getHomeData);
router.get('/popular_artists', getPopularArtists);
router.get('/popular_albums', getPopularAlbums);
router.get('/featured_playlists', getFeaturedPlaylists);
router.get('/new_releases', getNewReleases);
router.get('/get_categories', getCategories);
router.get('/search', search);
router.get('/get_track/:id', getTrackData);
router.get('/get_artist/:id', getArtistData);
router.get('/get_artist_discography/:id', getArtistDiscography);
router.get('/get_album/:id', getAlbumData);
router.get('/get_playlist/:id', getPlaylistData);
router.get('/get_audiobook/:id', getAudiobookData);
router.get('/get_user/:id', getUserData);
router.route('/recommended/:id').get(protect, getRecommendedTracks); 

export default router