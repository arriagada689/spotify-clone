import express from 'express'
import { 
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    awake,
    getFirebaseConfig,
    storeImage,
    storeUserPlaylistImage,
    getProfileImage
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser)
router.post('/auth', authUser)
router.get('/awake', awake)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.route('/firebase').get(protect, getFirebaseConfig)
router.route('/store_image').put(protect, storeImage)
router.route('/store_user_playlist_image/:id').put(protect, storeUserPlaylistImage)
router.route('/profile_image').get(protect, getProfileImage)

export default router