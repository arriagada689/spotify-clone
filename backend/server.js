import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
const PORT = process.env.PORT || 5000
import userRoutes from './routes/userRoutes.js'
import spotifyRoutes from './routes/spotifyRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { loadArtists, loadAlbums, loadAlbum, loadArtist } from './utils/loadDB.js';

connectDB()

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors());

app.use(cookieParser())

app.use('/api/users', userRoutes)
app.use('/api/spotify', spotifyRoutes)
app.use('/api/profile', profileRoutes)

app.get('/', (req, res) => {
    res.send('Server is ready')
})

app.use(notFound)
app.use(errorHandler)

// loadArtists()
// loadAlbums()
// loadArtist('2mSHY8JOR0nRi3mtHqVa04')
// loadAlbum('6s84u2TUpR3wdUv4NgKA2j')

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})