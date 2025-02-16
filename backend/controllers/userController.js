import asyncHandler from "express-async-handler"
import User from '../models/userModel.js'
import generateToken from "../utils/generateToken.js"
import validateUserInput from "../utils/inputValidation.js"
import UserPlaylist from "../models/userPlaylistModel.js"

// @desc Auth user/set token
// route POST api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({username})

    if (user && (await user.matchPasswords(password))) {
        const token = generateToken(user._id)
        
        res.status(201).json({
            _id: user._id,
            username: user.username,
            cartTotal: user.cartTotal,
            token: token
        })
    } else {
        res.status(401)
        throw new Error('Invalid username or password')
    }
})

// @desc Register a new user
// route POST api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, password, confirm_password } = req.body;

    const inputValidation = validateUserInput(username, password, confirm_password)

    if (!inputValidation.isValid){
        res.status(400)
        throw new Error(inputValidation.error)
    }
    
    //Check if user exists
    const userExists = await User.findOne({username})
    if (userExists){
        res.status(400)
        throw new Error('Username already taken')
    }

    //Create user
    const user = await User.create({
        username,
        password,
        image: '',
        followed_items: [],
        recently_viewed: [],
        liked_songs: []
    })

    if (user) {
        const token = generateToken(user._id)
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: token
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// DESC Get user profile
// route GET api/users/profile
// ACCESS Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id: req.user._id,
        username: req.user.username
    }
    res.status(200).json(user)
})

// DESC Update user profile
// route PUT api/users/profile
// ACCESS Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    const { username, password, confirm_password } = req.body
    const token = req.headers.authorization.split(' ')[1];

    const inputValidation = validateUserInput(username, password, confirm_password)

    if (!inputValidation.isValid){
        res.status(400)
        throw new Error(inputValidation.error)
    }

    if (user){
        user.username = req.body.username || user.username
        user.password = req.body.password || user.password

        const updatedUser = await user.save()
        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            cartTotal: updatedUser.cartTotal,
            token: token
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// DESC Check if servers if awake
// route GET api/users/awake
// ACCESS Public
const awake = asyncHandler(async (req, res) => {
    res.json({ status: true })
})

// DESC Get firebase config data
// route GET api/users/firebase
// ACCESS Private
const getFirebaseConfig = asyncHandler(async (req, res) => {
    res.json({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    })
})

// DESC Store hosted image url to users model
// route PUT api/users/store_image
// ACCESS Private
const storeImage = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    const url = req.body.url

    if(user && url){
        user.image = url
        await user.save()

        res.json({status: true})
    } else {
        res.status(400)
        res.json('Error storing image')
    }
})

// DESC Store hosted image url to user playlist model
// route PUT api/users/store_user_playlist_image
// ACCESS Private
const storeUserPlaylistImage = asyncHandler(async (req, res) => {
    const { id } = req.params
    const url = req.body.url
    const userPlaylist = await UserPlaylist.findById(id)

    if(id && url && userPlaylist){
        userPlaylist.image = url
        await userPlaylist.save()

        res.json({ status: true })
    } else {
        res.status(400)
        res.json('Error storing image')
    }
})

// DESC Get users profile image
// route GET api/users/profile_image
// ACCESS Private
const getProfileImage = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)

    if(user){
        res.json(user.image)
    } else {
        res.status(400)
        res.json('Error fetching image')
    }
})

export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    awake,
    getFirebaseConfig,
    storeImage,
    storeUserPlaylistImage,
    getProfileImage
}