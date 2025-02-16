import asyncHandler from "express-async-handler"
import generateSpotifyToken from '../utils/generateSpotifyToken.js'
import { popular_artists_arr, popular_albums_arr } from "../utils/loadDB.js"
import formatDuration from "../utils/formatDuration.js"
import Artist from "../models/artistModel.js"
import Album from "../models/albumModel.js"
import User from "../models/userModel.js"
import Track from "../models/trackModel.js"
import UserPlaylist from "../models/userPlaylistModel.js"
import totalTrackTime from "../utils/totalTrackTime.js"

// @desc Get all home data (pop-artists, pop-albums, featured-playlists)
// route POST api/spotify/home
// @access Public
const getHomeData = asyncHandler(async (req, res) => {
    const spotifyToken = await generateSpotifyToken()
    //get popular artists from db
    const popular_artists = []
    for(const [name, id] of popular_artists_arr) {
        if (popular_artists.length >= 8) {
            break; 
        }
        const artist = await Artist.findOne({id: id})
        if(artist) {
            popular_artists.push(artist)
        }
    }

    //get popular albums from db
    const popular_albums = []
    for(const [name, id] of popular_albums_arr) {
        if (popular_albums.length >= 8) {
            break; 
        }
        const album = await Album.findOne({id: id})
        if(album) {
            popular_albums.push(album)
        }
    }

    // get featured playlists from spotify 
    // let featured_playlists = []
    // const response = await fetch(`${process.env.SPOTIFY_BASE_URL}/browse/featured-playlists?limit=8`, {
    //     headers: {
    //         'Authorization': `Bearer ${spotifyToken}`,
    //         'Content-Type': 'application/json'
    //     }
    // })
    // if(response.ok) {
    //     const data = await response.json()
    //     featured_playlists = data.playlists.items
    // } else {
    //     const error = await response.json()
    //     console.error(error)
    // }

    //get new releases
    let new_releases = []
    const response = await fetch(`${process.env.SPOTIFY_BASE_URL}/browse/new-releases?limit=8`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(response.ok) {
        const data = await response.json()
        new_releases = data.albums.items
    } else {
        const error = await response.json()
        // console.error(error)
    }

    res.json({
        popular_artists: popular_artists,
        popular_albums: popular_albums,
        new_releases: new_releases
    })
})

// @desc Get all popular artists 
// route GET api/spotify/popular_artists
// @access Public
const getPopularArtists = asyncHandler(async (req, res) => {
    const spotifyToken = await generateSpotifyToken()
    const popular_artists = []
    for(const [name, id] of popular_artists_arr) {
        const artist = await Artist.findOne({id: id})
        if(artist) {
            popular_artists.push(artist)
        }
    }

    res.json({
        popular_artists: popular_artists
    })
})

// @desc Get all popular albums
// route GET api/spotify/popular_albums
// @access Public
const getPopularAlbums = asyncHandler(async (req, res) => {
    const spotifyToken = await generateSpotifyToken()
    const popular_albums = []
    for(const [name, id] of popular_albums_arr) {
        const album = await Album.findOne({id: id})
        if(album) {
            popular_albums.push(album)
        }
    }
    res.json({
        popular_albums: popular_albums
    })
})

// @desc Get all featured playlists
// route GET api/spotify/featured_playlists
// @access Public
const getFeaturedPlaylists = asyncHandler(async (req, res) => {
    const spotifyToken = await generateSpotifyToken()
    let featured_playlists = []
    const response = await fetch(`${process.env.SPOTIFY_BASE_URL}/browse/featured-playlists`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(response.ok) {
        const data = await response.json()
        featured_playlists = data.playlists.items
    }
    res.json({
        featured_playlists: featured_playlists
    })
})

// @desc Get new releases
// route GET api/spotify/new_releases
// @access Public
const getNewReleases = asyncHandler(async(req, res) => {
    const spotifyToken = await generateSpotifyToken()
    let new_releases = []
    const response = await fetch(`${process.env.SPOTIFY_BASE_URL}/browse/new-releases`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(response.ok) {
        const data = await response.json()
        new_releases = data.albums.items
    }
    res.json({
        new_releases: new_releases
    })
})


// @desc Get all categories for search page
// route GET api/spotify/get_categories
// @access Public
const getCategories = asyncHandler(async (req, res) => {
    const spotifyToken = await generateSpotifyToken()
    let categories = []
    const response = await fetch(`${process.env.SPOTIFY_BASE_URL}/recommendations/available-genre-seeds`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    }) 
    if(response.ok) {
        const data = await response.json()
        categories = data.genres
    }
    res.json({
        categories: categories
    })
})

// @desc Search endpoint with query and type filter
// route GET api/spotify/search
// @access Public
const search = asyncHandler(async (req, res) => {
    const { query, type, offset } = req.query
    const spotifyToken = await generateSpotifyToken()
    const resObject = {}

    let url = `${process.env.SPOTIFY_BASE_URL}/search`
    if(query && type && offset){
        url += `?query=${query}&type=${type}&offset=${offset}&limit=50`
    }
    else if(query && type){
        url += `?query=${query}&type=${type}&limit=50`
    }
    else if(query) {
        url += `?query=${query}&type=track,album,artist,playlist,audiobook&limit=5`
    }
    // console.log(url)
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(response.ok) {
        const data = await response.json()
        resObject['tracks'] = data.tracks
        resObject['artists'] = data.artists
        resObject['albums'] = data.albums
        resObject['playlists'] = data.playlists
        resObject['audiobooks'] = data.audiobooks
    }
    
    res.json(resObject)
})

// @desc Get track data for track page (track artist's popular tracks and more from the album)
// route GET api/spotify/get_track/:id
// @access Public
const getTrackData = asyncHandler(async (req, res) => {
    const id = req.params.id
    const spotifyToken = await generateSpotifyToken()
    const resObject = {}
    let artistId = ''
    let albumId = ''

    //get track data from spotify
    const trackResponse = await fetch(`${process.env.SPOTIFY_BASE_URL}/tracks/${id}`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(trackResponse.ok) {
        const data = await trackResponse.json()
        resObject['track_data'] = data
        artistId = data.artists[0].id
        albumId = data.album.id
    }

    //get popular tracks by the artist of track
    const popularTracksResponse = await fetch(`${process.env.SPOTIFY_BASE_URL}/artists/${artistId}/top-tracks`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(popularTracksResponse.ok) {
        const data = await popularTracksResponse.json()
        resObject['popular_tracks'] = data.tracks
    }

    //get more from the album
    const albumResponse = await fetch(`${process.env.SPOTIFY_BASE_URL}/albums/${albumId}/tracks?limit=50`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(albumResponse.ok) {
        const data = await albumResponse.json()
        resObject['album_data'] = data.items
    }

    res.json(resObject)
})

// @desc Get artist data for artist page (artist's top tracks, related artists)
// route GET api/spotify/get_artist/:id
// @access Public
const getArtistData = asyncHandler(async (req, res) => {
    const id = req.params.id
    const spotifyToken = await generateSpotifyToken()
    const resObject = {}

    //get artist data from spotify
    const artistResponse = await fetch(`${process.env.SPOTIFY_BASE_URL}/artists/${id}`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(artistResponse.ok) {
        const data = await artistResponse.json()
        resObject['artist_data'] = data
    }

    //get artist's top tracks
    const popularTracksResponse = await fetch(`${process.env.SPOTIFY_BASE_URL}/artists/${id}/top-tracks`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(popularTracksResponse.ok) {
        const data = await popularTracksResponse.json()
        resObject['popular_tracks'] = data.tracks
    }

    res.json(resObject)
})

// @desc Get full discrography data for particular artist
// route GET api/spotify/get_artist_discography/:id
// @access Public
const getArtistDiscography = asyncHandler(async (req, res) => {
    const id = req.params.id
    const spotifyToken = await generateSpotifyToken()
    let initialData = {}, discography = []

    //fetch full discography data (1 second delay between each request)
    const discographyResponse = await fetch(`${process.env.SPOTIFY_BASE_URL}/artists/${id}/albums?limit=50`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(discographyResponse.ok){
        const data = await discographyResponse.json();
        initialData = data;
    }   
    
    //save first set of items
    discography = [...initialData.items];

    //iterate through albums
    let nextUrl = initialData.next;
    while(nextUrl){
        const response = await fetch(nextUrl, {
            headers: {
                'Authorization': `Bearer ${spotifyToken}`,
                'Content-Type': 'application/json'
            }
        });
        if(response.ok){
            const data = await response.json();
            discography = [...discography, ...data.items];
            nextUrl = data.next;
        }
    }

    res.json({ 
        discography,
        total: initialData.total 
    });
})

// @desc Get album data for album page
// route GET api/spotify/get_album/:id
// @access Public
const getAlbumData = asyncHandler(async (req, res) => {
    const id = req.params.id
    const spotifyToken = await generateSpotifyToken()
    const resObject = {}

    //get album data from spotify
    const albumResponse = await fetch(`${process.env.SPOTIFY_BASE_URL}/albums/${id}`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(albumResponse.ok) {
        const data = await albumResponse.json()

        //iterate through album tracks to get total time for subheader
        let time = 0
        for(const track of data.tracks.items){
            time += track.duration_ms
        }

        resObject['album_data'] = data
        resObject['total_time'] = totalTrackTime(time)
    }

    res.json(resObject)
})

// @desc Get playlist data for playlist page with pagination
// route GET api/spotify/get_playlist/:id
// @access Public
const getPlaylistData = asyncHandler(async (req, res) => {
    const id = req.params.id
    const { offset } = req.query
    const spotifyToken = await generateSpotifyToken()
    const resObject = {}

    //get playlist data from spotify
    const playlistResponse = await fetch(`${process.env.SPOTIFY_BASE_URL}/playlists/${id}`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(playlistResponse.ok) {
        const data = await playlistResponse.json()
        resObject['playlist_data'] = data
        if(!offset){
            resObject['playlist_tracks'] = data.tracks.items
        }
    }

    //if there is an offset in the request, send updated tracks
    if(offset) {
        const offsetResponse = await fetch(`${process.env.SPOTIFY_BASE_URL}/playlists/${id}/tracks?offset=${offset}`, {
            headers: {
                'Authorization': `Bearer ${spotifyToken}`,
                'Content-Type': 'application/json'
            }
        })
        if(offsetResponse.ok) {
            const data = await offsetResponse.json()
            resObject['playlist_tracks'] = data.items
        } else {
            const error = await offsetResponse.json()
            console.log(error)
        }
    } 

    res.json(resObject)
})

// @desc Get audiobook data for audiobook page
// route GET api/spotify/get_audiobook/:id
// @access Public
const getAudiobookData = asyncHandler(async (req, res) => {
    const id = req.params.id
    const spotifyToken = await generateSpotifyToken()
    const resObject = {}

    //Get audiobook data from spotify
    const audiobookResponse = await fetch(`${process.env.SPOTIFY_BASE_URL}/audiobooks/${id}`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(audiobookResponse.ok) {
        const data = await audiobookResponse.json()
        //iterate through audiobook chapters and sum up the duration
        let total = 0
        for(let i = 0; i < data.chapters.items.length; i++) {
            total += data.chapters.items[i].duration_ms
        }
        resObject['duration'] = formatDuration(total)
        resObject['audiobook_data'] = data
    }

    res.json(resObject)
})

// @desc Get spotify users data for user page with pagination
// route GET api/spotify/get_user/:id
// @access Public
const getUserData = asyncHandler(async (req, res) => {
    const id = req.params.id
    const { offset } = req.query
    const spotifyToken = await generateSpotifyToken()
    const resObject = {}

    //get user data from spotify
    const userResponse = await fetch(`${process.env.SPOTIFY_BASE_URL}/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(userResponse.ok) {
        const data = await userResponse.json()
        resObject['user_data'] = data
    }

    //get user's playlists
    const userPlaylistsResponse = await fetch(`${process.env.SPOTIFY_BASE_URL}/users/${id}/playlists?offset=${offset}&limit=50`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(userPlaylistsResponse.ok) {
        const data = await userPlaylistsResponse.json()
        resObject['user_playlists'] = data
    }

    res.json(resObject)
})

// @desc Get recommended tracks
// route GET api/spotify/recommended
// @access PRIVATE
const getRecommendedTracks = asyncHandler(async (req, res) => {
    const { track_ids } = req.query
    const id = req.params.id
    const user = await User.findById(req.user.id)
    const userPlaylist = await UserPlaylist.findById(id)

    //set up spotify recommended request
    const spotifyToken = await generateSpotifyToken()
    const response = await fetch(`https:api.spotify.com/v1/recommendations?seed_tracks=${track_ids}&limit=10`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
        }
    })
    if(response.ok){
        const data = await response.json()
        const arr = []
        const resObject = {}

        //iterate through each search result, and check if its in the user playlist
        if(data.tracks && data.tracks.length > 0){
            for(const item of data.tracks){
                let flag
                const track = await Track.findOne({id: item.id})
                if(track){
                    const index = userPlaylist.playlist_items.findIndex(playlist_item => {
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
        }
        
        res.json(resObject)
        return
    } else {
        const error = await response.json()
        console.log('Spotify Error', error)
        throw new Error(error)
    }
    
})

export {
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
}