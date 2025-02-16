import mongoose from "mongoose"

const trackSchema = mongoose.Schema({
    name: String,
    id: String,
    image: String,
    artist: String,
    album: String,
    duration: String,
    type: { type: String, default: 'Track' }
})

const Track = mongoose.model('Track', trackSchema)

export default Track