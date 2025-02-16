import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    followed_items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'followed_items.type'
        },
        type: {
            type: String,
            required: true,
            enum: ['Artist', 'Album', 'Playlist', 'Audiobook', 'UserPlaylist']
        },
        followedAt: {
            type: Date,
            default: Date.now
        }
    }],
    recently_viewed: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'recently_viewed.type'
        },
        type: {
            type: String,
            required: true,
            enum: ['Artist', 'Album', 'Playlist', 'Audiobook', 'Track']
        },
        followedAt: {
            type: Date,
            default: Date.now
        }
    }],
    liked_songs: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'recently_viewed.type'
        },
        type: {
            type: String,
            required: true,
            enum: ['Track']
        },
        followedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPasswords = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User;