import asyncHandler from "express-async-handler"
import Artist from "../models/artistModel.js"
import User from "../models/userModel.js"
import Album from "../models/albumModel.js"
import Playlist from "../models/playlistModel.js"
import Audiobook from "../models/audiobookModel.js"
import UserPlaylist from "../models/userPlaylistModel.js"
import Track from "../models/trackModel.js"
import formatDuration from "../utils/formatDuration.js"
import generateSpotifyToken from '../utils/generateSpotifyToken.js'
import getFormattedDuration from "../utils/getFormattedDuration.js"
import playlistFormatDate from "../utils/playlistFormatData.js"

// @desc Add an item to the user's followed items
// route POST api/profile/follow_item
// @access Private
const followItem = asyncHandler(async (req, res) => {
    const { name, image, id, type, artist, creator, description, author, duration, album_type } = req.body
    const user = await User.findById(req.user.id)
    let item

    if(type === 'Artist') {
        item = await Artist.findOne({id: id})
        if(!item) {
            item = await Artist.create({
                id: id,
                name: name,
                image: image
            });
        }
    } else if(type === 'Album'){
        item = await Album.findOne({id: id})
        if(!item) {
            item = await Album.create({
                name: name,
                image: image, 
                id: id,
                artist: artist,
                album_type: album_type
            })
        }
    } else if (type === 'Playlist') {
        item = await Playlist.findOne({id: id})
        if(!item) {
            item = await Playlist.create({
                name: name,
                image: image,
                id: id,
                creator: creator,
                description: description
            })
        }
    } else if (type === 'Audiobook') {
        item = await Audiobook.findOne({id: id})
        if(!item) {
            item = await Audiobook.create({
                name: name,
                image: image,
                id: id,
                author: author,
                duration: duration
            })
        }
    }

    const followedItem = {
        item: item._id,
        type: type,
        followedAt: new Date()
    }
    user.followed_items.push(followedItem);
    await user.save();

    res.json(`${type} added to user's followed items`)
})

// @desc Delete an item from the user's followed items
// route DELETE api/profile/unfollow_item
// @access Private
const unfollowItem = asyncHandler(async (req, res) => {
    const { id, type } = req.body
    const user = await User.findById(req.user.id)
    let item

    if(type === 'Artist') {
        item = await Artist.findOne({id: id})
    } else if(type === 'Album'){
        item = await Album.findOne({id: id})
    } else if(type === 'Playlist') {
        item = await Playlist.findOne({id: id})
    } else if(type === 'Audiobook') {
        item = await Audiobook.findOne({id: id})
    }
    const index = user.followed_items.findIndex(followed_item => followed_item.item.toString() === item._id.toString())
    if(index !== -1) {
        user.followed_items.splice(index, 1)
        await user.save()
        res.json({ message: `Successfully unfollowed the ${item.type}` });
    }
})

// @desc Get user's following status for a particular item
// route GET api/profile/follow_status
// @access Private
const followStatus = asyncHandler(async (req, res) => {
    const id = req.params.id
    const type = req.params.type
    const user = await User.findById(req.user.id)
    let item

    //find item based on spotify id
    if(type === 'artist'){
        item = await Artist.findOne({id: id})
    } else if(type === 'album') {
        item = await Album.findOne({id: id})
    } else if(type === 'playlist') {
        item = await Playlist.findOne({id: id})
    } else if(type === 'audiobook') {
        item = await Audiobook.findOne({id: id})
    }
    
    //iterate through users followed items to see if its there
    if(item) {
        const index = user.followed_items.findIndex(followed_item => followed_item.item.toString() === item._id.toString())

        if(index !== -1) {
            res.json({message: 'following'})
        } else {
            res.json({message: 'not following'})
        }
    } else {
        res.json({message: 'not following'})
    }
})

// @desc Create user playlist
// route POST api/profile/create_playlist
// @access Private
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const user = await User.findById(req.user.id)

    //input validation
    if(name.length > 50) {
        res.status(400)
        throw new Error('Playlist name too long.')
    }

    //create user playlist
    const user_playlist = await UserPlaylist.create({
        name: name,
        description: description,
        creator: user.username,
        image: '',
        playlist_items: []
    })

    //add to the user's followed items
    user.followed_items.push({
        item: user_playlist._id,
        type: 'UserPlaylist',
        followedAt: new Date()
    })
    await user.save()

    res.json({
        message: `User playlist created`,
        user_playlist: user_playlist
    })
})

// @desc Add track or audiobook to user playlist
// route POST api/profile/add_item
// @access Private
const addItemToPlaylist = asyncHandler(async (req, res) => {
    const { playlist_id, name, id, image, artist, album, duration, author, type } = req.body
    //when track is sent, duration is in ms. When audiobook is sent, duration is in string format
    const user = await User.findById(req.user.id)
    const user_playlist = await UserPlaylist.findById(playlist_id)
    
    //check if track or audiobook is already in db
    if(type === 'Track'){
        let track = await Track.findOne({id: id})
        if(!track){
            track = await Track.create({
                name: name,
                id: id,
                image, image,
                artist: artist,
                album: album,
                duration: formatDuration(duration)
            })
        }
        //add track to user playlist model
        user_playlist.playlist_items.push({
            item: track._id,
            type: 'Track',
            added_on: new Date()
        })
        await user_playlist.save()
        res.json('Track added to playlist')
    } else {
        let audiobook = await Audiobook.findOne({id: id})
        if(!audiobook) {
            audiobook = await Audiobook.create({
                name: name,
                id: id,
                image: image,
                author: author,
                duration: duration
            })
        }
        //add audiobook to user playlist model
        user_playlist.playlist_items.push({
            item: audiobook._id,
            type: 'Audiobook',
            added_on: new Date()
        })
        await user_playlist.save()
        res.json('Audiobook added to playlist')
    }
})

// @desc Remove track or audiobook from user playlist
// route DELETE api/profile/remove_item
// @access Private
const removeItemFromPlaylist = asyncHandler(async (req, res) => {
    const { playlist_id, id, type } = req.body
    const user_playlist = await UserPlaylist.findById(playlist_id)
    let item
    if(type === 'Track'){
        item = await Track.findOne({id: id})
    } else {
        item = await Audiobook.findOne({id: id})
    }

    const index = user_playlist.playlist_items.findIndex(playlist_item => playlist_item.item.toString() === item._id.toString())
    user_playlist.playlist_items.splice(index, 1)
    await user_playlist.save()
    res.json(`${type} removed from user playlist`)
})

// @desc Get list of user's playlists and check if particular track or audiobook is in each
// route GET api/profile/user_list
// @access Private
const getUserList = asyncHandler(async (req, res) => {
    const id = req.params.id
    const type = req.params.type
    const user = await User.findById(req.user.id)
    let item

    //grab all the user's user playlists
    const arr = await UserPlaylist.find({creator: user.username})

    //grab track or audiobook
    if(type === 'track'){
        item = await Track.findOne({id: id})
    } else {
        item = await Audiobook.findOne({id: id})
    }

    const resList = []

    if(!item){
        arr.map(user_playlist => {
            const temp = []
            temp.push(user_playlist._id)
            temp.push(user_playlist.name)
            temp.push(false)
            resList.push(temp)
        })
        res.json({
            user_list: resList
        })
        return
    }

    //iterate through list of user playlists and check if track or audiobook is in
    
    arr.map(user_playlist => {
        const temp = []
        let status
        temp.push(user_playlist._id)
        temp.push(user_playlist.name)
        //iterate through the user playlist's playlist items
        const index = user_playlist.playlist_items.findIndex(playlist_item => playlist_item.item.toString() === item._id.toString())
        if(index !== -1) {
            status = true
        } else {
            status = false
        }
        temp.push(status)
        resList.push(temp)
    })
    
    res.json({
        user_list: resList
    })
})

// @desc Get user playlist data
// route GET api/profile/get_user_playlist
// @access Private
const getUserPlaylistData = asyncHandler(async (req, res) => {
    const id = req.params.id
    const user_playlist = await UserPlaylist.findById(id)

    if(user_playlist){
        //iterate through the user playlist's playlist items and count songs and audiobooks
        let trackCount = 0
        let audiobookCount = 0
        const arr = []
        const added_on = []
        for(const item of user_playlist.playlist_items){
            if(item.type === 'Track'){
                trackCount++
                const track = await Track.findById(item.item.toString())
                arr.push(track)
            } else if(item.type === 'Audiobook'){
                audiobookCount++
                const audiobook = await Audiobook.findById(item.item.toString())
                arr.push(audiobook)
            }
            added_on.push(playlistFormatDate(item.added_on))
        }
        const resObject = {}
        resObject['track_count'] = trackCount
        resObject['audiobook_count'] = audiobookCount
        resObject['user_playlist'] = user_playlist
        resObject['playlist_items'] = arr
        resObject['added_on'] = added_on
        res.json(resObject)
    } else {
        res.status(400).json('User playlist does not exist')
    }
})

// @desc Update name or description of user playlist
// route PUT api/profile/update_user_playlist
// @access Private
const updateUserPlaylist = asyncHandler(async (req, res) => {
    const { id, name, description } = req.body
    const user_playlist = await UserPlaylist.findById(id)

    //input validation
    if(name.length > 50) {
        res.status(400)
        throw new Error('Playlist name is too long.')
    }

    if(user_playlist) {
        user_playlist.name = name
        user_playlist.description = description
        await user_playlist.save()
        res.json('user playlist updated successfully')
    } else {
        res.status(404).json('Unable to find user playlist')
    }
})

// @desc Delete user playlist from user playlist model and user's followed items
// route DELETE api/profile/delete_user_playlist
// @access Private
const deleteUserPlaylist = asyncHandler(async (req, res) => {
    const id = req.params.id
    const user = await User.findById(req.user.id)
    const user_playlist = await UserPlaylist.findById(id)

    if(user_playlist) {
        const index = user.followed_items.findIndex(item => item.item.toString() === user_playlist._id.toString())
        // console.log(index)
        user.followed_items.splice(index, 1)

        await user_playlist.deleteOne()
        await user.save()

        res.status(200).json({ message: 'User playlist deleted successfully' });
    } else {
        res.status(404).json('User playlist not found')
    }
})

// @desc Get a user's side bar data (user's followed_items)
// route GET api/profile/sidebar_data
// @access Private
const getSidebarData = asyncHandler(async (req, res) => {
    const type = req.query.type
    const user = await User.findById(req.user.id)
    
    if(user){
        const arr = []

        //create a copy of followed items and reverse it
        const reversedItems = user.followed_items.slice().reverse();

        //iterate through followed items and grab item info
        for(const item of reversedItems) {
            if (type === 'All') {
                // Directly push the item based on its type, without further checks
                if (item.type === 'Artist') {
                    const artist = await Artist.findById(item.item);
                    arr.push(artist);
                } else if (item.type === 'Album') {
                    const album = await Album.findById(item.item);
                    arr.push(album);
                } else if (item.type === 'Playlist') {
                    const playlist = await Playlist.findById(item.item);
                    arr.push(playlist);
                } else if (item.type === 'Audiobook') {
                    const audiobook = await Audiobook.findById(item.item);
                    arr.push(audiobook);
                } else if (item.type === 'UserPlaylist') {
                    const user_playlist = await UserPlaylist.findById(item.item);
                    arr.push(user_playlist);
                }
            } else {
                // Checks for specific types only if 'type' is not 'All'
                
                if (item.type === type) {
                    switch (item.type) {
                        case 'Artist':
                            const artist = await Artist.findById(item.item);
                            arr.push(artist);
                            break;
                        case 'Album':
                            const album = await Album.findById(item.item);
                            arr.push(album);
                            break;
                        case 'Playlist':
                            const playlist = await Playlist.findById(item.item);
                            arr.push(playlist);
                            break;
                        case 'Audiobook':
                            const audiobook = await Audiobook.findById(item.item);
                            arr.push(audiobook);
                            break;
                        case 'UserPlaylist': 
                            const user_playlist = await UserPlaylist.findById(item.item);
                            arr.push(user_playlist);
                            break;
                    }
                } else if(item.type === 'UserPlaylist' && type === 'Playlist'){
                    const user_playlist = await UserPlaylist.findById(item.item);
                    arr.push(user_playlist);
                }
            }
        }
        res.json(arr)
    } else {
        res.status(400).json('Error loading sidebar data')
    }
})

// @desc Add item to user's recently viewed
// route POST api/profile/add_recently_viewed
// @access Private
const addRecentlyViewed = asyncHandler(async (req, res) => {
    const { name, image, id, type, artist, creator, description, author, duration, album, album_type } = req.body
    const user = await User.findById(req.user.id)
    let item

    if(type === 'Artist') {
        item = await Artist.findOne({id: id})
        if(!item) {
            item = await Artist.create({
                id: id,
                name: name,
                image: image
            });
        }
    } else if(type === 'Album'){
        item = await Album.findOne({id: id})
        if(!item) {
            item = await Album.create({
                name: name,
                image: image, 
                id: id,
                artist: artist,
                album_type: album_type
            })
        }
    } else if (type === 'Playlist') {
        item = await Playlist.findOne({id: id})
        if(!item) {
            item = await Playlist.create({
                name: name,
                image: image,
                id: id,
                creator: creator,
                description: description
            })
        }
    } else if (type === 'Audiobook') {
        item = await Audiobook.findOne({id: id})
        if(!item) {
            item = await Audiobook.create({
                name: name,
                image: image,
                id: id,
                author: author,
                duration: duration
            })
        }
    } else if (type === 'Track') {
        item = await Track.findOne({id: id})
        if(!item) {
            item = await Track.create({
                name: name,
                image: image,
                id: id,
                album: album,
                artist: artist,
                duration: formatDuration(duration)
            })
        }
    }
    
    //check if item is already in recently viewed
    const index = user.recently_viewed.findIndex(arrItem => arrItem.item.toString() === item._id.toString())

    if(index === -1){
        //add item to user's recently_viewed
        user.recently_viewed.push({
            item: item._id,
            type: type,
            followedAt: new Date()
        })
        await user.save()
        res.json(`${type} added to recently viewed`)
    } else {
        res.json(`${type} already in recently viewed`)
    }
})

// @desc Get user's recently viewed items
// route GET api/profile/get_recently_viewed
// @access Private
const getRecentlyViewed = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)

    if(user) {
        const arr = []

        //create a copy of recently viewed and reverse it
        const reversedItems = user.recently_viewed.slice().reverse()

        //iterate through recently viewed and grab item info
        for(const item of reversedItems) {
            if(item.type === 'Artist'){
                const artist = await Artist.findById(item.item)
                arr.push(artist)
            } else if(item.type === 'Album'){
                const album = await Album.findById(item.item)
                arr.push(album)
            } else if(item.type === 'Playlist'){
                const playlist = await Playlist.findById(item.item)
                arr.push(playlist)
            } else if(item.type === 'Audiobook'){
                const audiobook = await Audiobook.findById(item.item)
                arr.push(audiobook)
            } else if(item.type === 'Track'){
                const track = await Track.findById(item.item)
                arr.push(track)
            }
        }
        res.json(arr)
    } else {
        res.status(400).json('error')
    }
})

// @desc Wipe user's recently viewed items
// route DELETE api/profile/wipe_recently_viewed
// @access Private
const wipeRecentlyViewed = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)

    if(user) {
        user.recently_viewed = []
        await user.save()
        res.json(`${user.username}'s recently viewed wiped`)
    } else {
        res.status(400).json('Error wiping recently viewed')
    }
})

// @desc Get user's profile data (saved playlists, followed artists, albums, audiobooks)
// route GET api/profile/get_profile
// @access Private
const getProfileData = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    const resObject = {}

    if(user) {
        resObject['username'] = user.username
        resObject['profile_image'] = user.image
        let artistCount = 0
        let albumCount = 0
        let playlistCount = 0
        let audiobookCount = 0
        const saved_playlists = []
        const followed_artists = []
        const followed_albums = []
        const followed_audiobooks = []

        //reverse followed items
        const reversedItems = user.followed_items.slice().reverse()

        for(const item of reversedItems) {
            if(item.type === 'Artist'){
                const artist = await Artist.findById(item.item)
                followed_artists.push(artist)
                artistCount++
            } else if(item.type === 'Album'){
                const album = await Album.findById(item.item)
                followed_albums.push(album)
                albumCount++
            } else if(item.type === 'Audiobook') {
                const audiobook = await Audiobook.findById(item.item)
                followed_audiobooks.push(audiobook)
                audiobookCount++
            } else if(item.type === 'Playlist'){
                const playlist = await Playlist.findById(item.item)
                saved_playlists.push(playlist)
                playlistCount++
            } else if(item.type === 'UserPlaylist'){
                const playlist = await UserPlaylist.findById(item.item)
                saved_playlists.push(playlist)
                playlistCount++
            }
        }
        resObject['artist_count'] = artistCount
        resObject['album_count'] = albumCount
        resObject['audiobook_count'] = audiobookCount
        resObject['playlist_count'] = playlistCount
        resObject['saved_playlists'] = saved_playlists 
        resObject['followed_artists'] = followed_artists 
        resObject['followed_albums'] = followed_albums 
        resObject['followed_audiobooks'] = followed_audiobooks 
        res.json(resObject)
    } else {
        res.status(400).json('error fetching profile data')
    }
})

// @desc Get data for either saved playlists, followed artists/albums/audiobooks
// route GET api/profile/get_sub_profile_data
// @access Private
const getSubProfileData = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user.id)
    const resObject = {}
    const arr = []
    const likedArr = []

    if(user) {
        //grab user playlists and external playlists
        for(const item of user.followed_items){
            if(item.type === 'Playlist'){
                const playlist = await Playlist.findById(item.item)
                arr.push(playlist)
            } else if(item.type === 'UserPlaylist'){
                const playlist = await UserPlaylist.findById(item.item)
                arr.push(playlist)
            }
        }

        //grab more items from the recently viewed if less than 8 items
        if(arr.length > 8){
            resObject['liked_songs'] = likedArr
            resObject['arr'] = arr
            res.json(resObject)
        } else {
            for(const item of user.recently_viewed){
                if(item.type === 'Artist'){
                    const artist = await Artist.findById(item.item)
                    arr.push(artist)
                    
                } else if(item.type === 'Album'){
                    const album = await Album.findById(item.item)
                    arr.push(album)
                
                } else if(item.type === 'Audiobook') {
                    const audiobook = await Audiobook.findById(item.item)
                    arr.push(audiobook)
                    
                } else if(item.type === 'Playlist'){
                    const playlist = await Playlist.findById(item.item)
                    arr.push(playlist)
                } else if(item.type === 'Track'){
                    const track = await Track.findById(item.item)
                    arr.push(track)
                }
            }
            resObject['liked_songs_length'] = user.liked_songs.length
            resObject['arr'] = arr
            res.json(resObject)
        }
    } else {
        res.status(400).json('error fetching profile data')
    }
})

// @desc Update user's profile (username)
// route PUT api/profile/update_profile
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
    const { username } = req.body
    const user = await User.findById(req.user.id)

    //input validation
    if (username.length > 150) {
        res.status(400)
        throw new Error('Username must be 150 characters or fewer.')
    }

    // Check for allowed characters
    if (!/^[a-zA-Z0-9@.+/_-]+$/.test(username)) {
        res.status(400)
        throw new Error('Username must contain only letters, digits, and @/./+/-/_')
    }

    //check if username already exists
    const userExists = await User.findOne({ username: username })
    if(userExists){
        res.status(400)
        throw new Error('Username already taken')
    }

    if(user) {
        //Change creator field for the user's user playlists
        await UserPlaylist.updateMany({creator: user.username}, {$set: {creator: username}})
        
        user.username = username
        await user.save()

        res.json('successfully updated username')
    } else {
        res.status(400).json('error')
    }
})

// @desc Delete user's profile (cleanup user's user playlists)
// route DELETE api/profile/delete_profile
// @access Private
const deleteProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)

    //clean up user playlists
    if(user){
        await UserPlaylist.deleteMany({creator: user.username});
        
        //delete user
        await User.deleteOne({_id: user._id})
        res.json('successfully deleted profile')
    } else {
        res.status(400).json('Error deleting profile')
    }
})

// @desc Search results for playlist page
// route GET api/profile/sub_search
// @access Private
const subSearch = asyncHandler(async (req, res) => {
    const { query, type, offset, playlist_id } = req.query
    const user_playlist = await UserPlaylist.findById(playlist_id)
    // console.log(query, type, offset)
    const spotifyToken = await generateSpotifyToken()
    const resObject = {}

    let url = `${process.env.SPOTIFY_BASE_URL}/search`
    if(query && type && offset){
        url += `?query=${query}&type=${type}&offset=${offset}&limit=10`
    } else if(query && type){
        url += `?query=${query}&type=${type}&limit=10`
    } else if(query) {
        url += `?query=${query}&limit=10`
    }

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(response.ok) {
        const data = await response.json()
        const arr = []
        if(data.tracks && data.tracks.items.length > 0){
            resObject['total'] = data.tracks.total
            
            //iterate through each search result, and check if its in the playlist
            for (const item of data.tracks.items){
                let flag
                const track = await Track.findOne({id: item.id})
                if(track){
                    const index = user_playlist.playlist_items.findIndex(playlist_item => {
                        return playlist_item.item.toString() === track._id.toString()
                    })
                    if(index !== -1){
                        flag = true
                    } else {
                        flag = false
                    }
                } else {
                    flag = false
                }
                const temp = [flag, item]; 
                arr.push(temp);
            }
            resObject['tracks'] = arr
            resObject['audiobooks'] = null
        } else {
            resObject['total'] = data.audiobooks.total

            //iterate through each search result, and check if its in the playlist
            let duration = 0
            
            for(const item of data.audiobooks.items) {
                let flag
                const audiobook = await Audiobook.findOne({id: item.id})
                if(audiobook) {
                    const index = user_playlist.playlist_items.findIndex(playlist_item => {
                        return playlist_item.item.toString() === audiobook._id.toString()
                    })
                    if(index !== -1){
                        flag = true
                    } else {
                        flag = false
                    }
                    duration = audiobook.duration
                } else {
                    //get the formatted duration for audiobooks and send to frontend
                   
                    duration = await getFormattedDuration(item.id)
                    flag = false
                }
                const temp = [flag, item, duration];
                arr.push(temp);
            }
            resObject['tracks'] = null
            resObject['audiobooks'] = arr
        }
    }
    res.json(resObject)
})

// @desc Add song to user's liked songs 
// route POST api/profile/like_song
// @access Private
const likeSong = asyncHandler (async (req, res) => {
    const trackId = req.params.id
    const track = await Track.findOne({id: trackId})
    const user = await User.findById(req.user.id)

    if(track) {
        //check if song is already in the liked songs array
        const index = user.liked_songs.findIndex(arrItem => arrItem.item.toString() === track._id.toString())
        
        //add track to users liked songs field
        if(index === -1){
            user.liked_songs.push({
                item: track._id,
                type: 'Track',
                followedAt: new Date()
            })
            await user.save()
            res.json(`${track.name} successfully added to liked songs`)
        } else {
            res.status(400)
            res.json('Error liking song')
        }
    } else {
        res.status(400)
        res.json('Error liking song')
    }   
})

// @desc Add song to user's liked songs from hover button (receives track data incase track is not in db)
// route POST api/profile/like_song_full
// @access Private
const likeSongFull = asyncHandler (async (req, res) => {
    const { track_name, track_image, track_album, track_artist, track_duration } = req.body;
    const trackId = req.params.id
    const track = await Track.findOne({id: trackId})
    const user = await User.findById(req.user.id)

    if(track) {
        //check if song is already in the liked songs array
        const index = user.liked_songs.findIndex(arrItem => arrItem.item.toString() === track._id.toString())
        
        //add track to users liked songs field
        if(index === -1){
            user.liked_songs.push({
                item: track._id,
                type: 'Track',
                followedAt: new Date()
            })
            await user.save()
            res.json(`${track.name} successfully added to liked songs`)
        } else {
            res.status(400)
            res.json('Error liking song')
        }
    } else {
        //if track is not already in db, then create it
        let new_track = await Track.create({
            name: track_name,
            image: track_image,
            id: trackId,
            album: track_album,
            artist: track_artist,
            duration: track_duration
        })
        user.liked_songs.push({
            item: new_track._id,
            type: 'Track',
            followedAt: new Date()
        });
        await user.save()
        res.json('New track created and added to liked songs');
    }   
})

const unlikeSong = asyncHandler(async (req, res) => {
    const trackId = req.params.id
    const track = await Track.findOne({id: trackId})
    const user = await User.findById(req.user.id)

    const index = user.liked_songs.findIndex(arrItem => arrItem.item.toString() === track._id.toString())
    if(track && user){
        if(index !== -1){
            user.liked_songs.splice(index, 1)
            await user.save()
            res.json(`${track.name} successfully removed from liked songs`)
        } else {
            res.status(400)
            res.json('Error unliking song')
        }
    } else {
        res.status(400)
        res.json('Error unliking song')
    }
    
})

// @desc Check if user has liked a particular song
// route GET api/profile/like_status
// @access Private
const checkLikeStatus = asyncHandler(async (req, res) => {
    const trackId = req.params.id
    const track = await Track.findOne({id: trackId})
    const user = await User.findById(req.user.id)

    if(!track){
        return res.json({ liked_status: false })
    }

    const index = user.liked_songs.findIndex(arrItem => arrItem.item.toString() === track._id.toString())
    if(track && user){
        if(index !== -1){
            res.json({ liked_status: true })
        } else {
            res.json({ liked_status: false })
        }
    } else {
        res.status(400)
        res.json('Error checking like status')
    }
})

// @desc Get liked songs data
// route GET api/profile/liked_songs
// @access Private
const getLikedSongsData = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    const likedSongs = []
    const added_on = []

    if(user){
        //reverse liked songs array
        const reversedItems = user.liked_songs.slice().reverse()

        for (const item of reversedItems) {
            const track = await Track.findById(item.item.toString())
            likedSongs.push(track)
            added_on.push(playlistFormatDate(item.followedAt))
        }
        res.json({
            liked_songs: likedSongs,
            added_on: added_on
        })
    } else {
        res.status(400)
        res.json('Error getting liked songs data')
    }
})

// @desc Get liked status list for list of search results
// route POST api/profile/like_list
// @access Private
const getLikeList = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    const trackList = req.body.track_list
    const arr = []

    if(user && trackList && trackList.length > 0){
        for(const item of trackList) {
            let flag
            const track = await Track.findOne({id: item.id})
            if(track){
                const index = user.liked_songs.findIndex(liked_song => {
                    return liked_song.item.toString() === track._id.toString()
                })
                if(index !== -1){
                    flag = true
                } else {
                    flag = false
                }
            } else {
                flag = false
            }
            arr.push(flag)
        }
    } else {
        res.status(400)
        res.json('Error fetching like list')
    }

    res.json(arr)
})

export {
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
    likeSongFull,
    unlikeSong,
    checkLikeStatus,
    getLikedSongsData,
    getLikeList
}