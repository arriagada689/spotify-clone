import mongoose from "mongoose"

const userPlaylistSchema = mongoose.Schema({
    name: String,
    creator: String,
    description: String,
    image: {
        type: String
    },
    playlist_items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'followed_items.type'
        },
        type: {
            type: String,
            required: true,
            enum: ['Audiobook', 'Track']
        },
        added_on: {
            type: Date,
            default: Date.now
        }
    }],
    type: { type: String, default: 'UserPlaylist' },
})

const UserPlaylist = mongoose.model('UserPlaylist', userPlaylistSchema)

export default UserPlaylist