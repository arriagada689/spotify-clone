import express from 'express'
import {
    followItem,
    unfollowItem,
    followStatus,
    createPlaylist,
    addItemToPlaylist,
    getUserList,
    removeItemFromPlaylist,
    getUserPlaylistData,
    updateUserPlaylist,
    deleteUserPlaylist,
    getSidebarData,
    addRecentlyViewed,
    getRecentlyViewed,
    wipeRecentlyViewed,
    getProfileData,
    getSubProfileData,
    updateProfile,
    deleteProfile,
    subSearch,
    likeSong,
    unlikeSong,
    checkLikeStatus,
    getLikedSongsData,
    getLikeList,
    likeSongFull
} from '../controllers/profileController.js'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/follow_item').post(protect, followItem)
router.route('/unfollow_item').delete(protect, unfollowItem)
router.route('/follow_status/:type/:id').get(protect, followStatus)
router.route('/create_playlist').post(protect, createPlaylist)
router.route('/add_item').post(protect, addItemToPlaylist)
router.route('/remove_item').delete(protect, removeItemFromPlaylist)
router.route('/user_list/:type/:id').get(protect, getUserList)
router.route('/get_user_playlist/:id').get(protect, getUserPlaylistData)
router.route('/update_user_playlist').put(protect, updateUserPlaylist)
router.route('/delete_user_playlist/:id').delete(protect, deleteUserPlaylist)
router.route('/sidebar_data').get(protect, getSidebarData)
router.route('/add_recently_viewed').post(protect, addRecentlyViewed)
router.route('/get_recently_viewed').get(protect, getRecentlyViewed)
router.route('/wipe_recently_viewed').delete(protect, wipeRecentlyViewed)
router.route('/get_profile').get(protect, getProfileData)
router.route('/get_sub_profile_data').get(protect, getSubProfileData)
router.route('/update_profile').put(protect, updateProfile)
router.route('/update_profile').put(protect, updateProfile)
router.route('/delete_profile').delete(protect, deleteProfile)
router.route('/sub_search').get(protect, subSearch)
router.route('/like_song/:id').post(protect, likeSong)
router.route('/like_song_full/:id').post(protect, likeSongFull)
router.route('/unlike_song/:id').delete(protect, unlikeSong)
router.route('/like_status/:id').get(protect, checkLikeStatus)
router.route('/liked_songs').get(protect, getLikedSongsData)
router.route('/like_list').post(protect, getLikeList)

export default router