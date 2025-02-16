import generateSpotifyToken from '../utils/generateSpotifyToken.js'
import formatDuration from './formatDuration.js'

const getFormattedDuration = async (id) => {
    const spotifyToken = await generateSpotifyToken()

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
        return formatDuration(total)
    } else {
        return 0
    }
}

export default getFormattedDuration