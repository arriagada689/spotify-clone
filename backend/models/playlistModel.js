import mongoose from "mongoose"

const playlistSchema = mongoose.Schema({
    name: String,
    id: String,
    creator: String,
    description: String,
    type: { type: String, default: 'Playlist' },
    image: String
})

const Playlist = mongoose.model('Playlist', playlistSchema)

export default Playlist