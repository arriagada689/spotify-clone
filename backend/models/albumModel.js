import mongoose from "mongoose"

const albumSchema = mongoose.Schema({
    name: String,
    id: String,
    artist: String,
    type: { 
        type: String, 
        default: 'Album' 
    },
    album_type: {
        type: String,
        default: 'Album'
    },
    image: String
})

const Album = mongoose.model('Album', albumSchema)

export default Album