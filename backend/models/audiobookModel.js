import mongoose from "mongoose"

const audiobookSchema = mongoose.Schema({
    name: String,
    id: String,
    author: String,
    duration: String,
    type: { type: String, default: 'Audiobook' },
    image: String
})

const Audiobook = mongoose.model('Audiobook', audiobookSchema)

export default Audiobook