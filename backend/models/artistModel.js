import mongoose from "mongoose"

const artistSchema = mongoose.Schema({
    name: String,
    id: String,
    type: { type: String, default: 'Artist' },
    image: String
})

const Artist = mongoose.model('Artist', artistSchema)

export default Artist