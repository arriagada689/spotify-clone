import generateSpotifyToken from "./generateSpotifyToken.js";
import Artist from "../models/artistModel.js";
import Album from "../models/albumModel.js";

const popular_artists_arr = [
    ['Kendrick Lamar', '2YZyLoL8N0Wb9xBt1NhZWg'],
    ['Post Malone', '246dkjvS1zLTtiykXe5h60'],
    ['Drake', '3TVXtAsR1Inumwj472S9r4'],  
    ['Taylor Swift', '06HL4z0CvFAxyc27GXpf02'],
    ['Billie Eilish', '6qqNVTkY8uBg9cP3Jd7DAH'], 
    ['The Weekend', '1Xyo4u8uXC1ZmMpatF05PJ'], 
    ['Eminem', '7dGJo4pcD2V6oG8kP0tJRR'],  
    ['Kanye West', '5K4W6rqBFWDnAN6FQUkS6x'],
    ['Rihanna', '5pKCCKE2ajJHZ9KAiaK11H'], 
    ['Sabrina Carpenter', '74KM79TiuVKeVCqs8QtB0B'], 
    ['Future', '1RyvyyTE3xzB2ZywiAwp0i'], 
    ['Zach Bryan', '40ZNYROS4zLfyyBSs2PGe2'],
    ['SZA', '7tYKF4w9nC0nq9CsPZTHyP'], 
    ['Morgan Wallen', '4oUHIQIBe0LHzYfvXNW4QM'],
    ['Tommy Richman', '1WaFQSHVGZQJTbf0BdxdNo'],
    ['Hozier', '2FXC3k01G6Gw61bmprjgqS'], 
    ['Luke Combs', '718COspgdWOnwOFpJHRZHS'], 
    ['Travis Scott', '0Y5tJX1MQlPlqiwlOH1tJY'],
    ['Beyonce', '6vWDO969PvNqNYHIOW5v0m'],
    ['Ariana Grande', '66CXWjxzNUsdJxJ2JdwvnR'], 
];

const popular_albums_arr = [
    ['THE TORTURED POETS' ,'5H7ixXZfsNMGbIE5OBSpcb'], 
    ['HIT ME HARD AND SOFT', '7aJuG4TFXa2hmE4z1yxc3n'],
    ['One Thing At a Time' ,'6i7mF7whyRJuLJ4ogbH2wh'],
    ['The Rise and Fall of a Midwest Princess' ,'0EiI8ylL0FmWWpgHVTsZjZ'], 
    ['WE DONT TRUST YOU' ,'4iqbFIdGOTzXeDtt9owjQn'], 
    ['Zach Bryan' ,'6PbnGueEO6LGodPfvNldYf'],
    ['MILLION DOLLAR BABY' ,'52TwRwdTUMtkpglbOE5IRz'],
    ['Not Like Us', '5JjnoGJyOxfSZUZtk2rRwZ'],
    ['SOS' ,'07w0rG5TETcyihsEIZR3qG'],
    ['UTOPIA' ,'18NOKLkZETa4sWwLMIm0UZ'], 
    ['10 Hours of Continuous Rain Sounds for Sleeping' ,'54vGSK50oe08qxz2xXECEC'], 
    ['I Had Some Help', '1woYXxyyxTQJ0E0AhZE6mj'],
    ['Eternal Sunshine' ,'5EYKrEDnKhhcNxGedaRQeK'], 
    ['COWBOY CARTER' ,'6BzxX6zkDsYKFJ04ziU5xQ'], 
    ['Fireworks & Rollerblades' ,'168CdR21lfn0TTyw1Pkdcm'],
    ['Blonde' ,'3mH6qwIy9crq0I9YQbOuDf'],
    ['One of Wun', '7g0PJ7VbsOkYTECUFkyNPN'],
    ['Stick Season' ,'50ZenUP4O2Q5eCy2NRNvuz'], 
    ['Un Verano Sin Ti' ,'3RQQmkQEvNCY4prGKE6oc5'],
]

const loadArtists = async () => {
    const spotifyToken = await generateSpotifyToken()
    const idString = popular_artists_arr.map(pair => pair[1]).join(',')

    const response = await fetch(`https://api.spotify.com/v1/artists?ids=${idString}`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,  
            'Content-Type': 'application/json'
        }
    })

    if (response.ok) {  
        const data = await response.json(); 
        for (const artist of data.artists) {
            const artist_name = artist.name
            const artist_id = artist.id
            const artist_image = artist.images[0].url

            //check if its already made
            const temp_artist = await Artist.findOne({id: artist_id})
            if(!temp_artist) { //make new artist
                const new_artist = await Artist.create({
                    name: artist_name,
                    id: artist_id,
                    image: artist_image
                })
            } 
            
        } 
    } else {
        const errorData = await response.json();  
        console.error('Failed to fetch artists:', errorData);  
    }
}

const loadArtist = async (id) => {
    const spotifyToken = await generateSpotifyToken()

    const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,  
            'Content-Type': 'application/json'
        }
    })
    if(response.ok){
        const data = await response.json()
        const artist_name = data.name
        const artist_id = data.id
        const artist_image = data.images[0].url
        const temp_artist = await Artist.findOne({id: artist_id})
        if(!temp_artist){
            const new_artist = await Artist.create({
                name: artist_name,
                id: artist_id,
                image: artist_image
            })
        } else {
            const errorData = await response.json();  
            console.error('Failed to fetch albums:', errorData);
        }
    }
}

const loadAlbum = async (id) => {
    const spotifyToken = await generateSpotifyToken()
    
    const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,  
            'Content-Type': 'application/json'
        }
    })
    if(response.ok){
        const data = await response.json()
        const album_name = data.name
        const album_id = data.id
        const album_image = data.images[0].url
        const album_artist = data.artists[0].name
        const album_type = data.album_type
        
        const temp_album = await Album.findOne({id: album_id})
        if(!temp_album){
            const new_album = await Album.create({
                name: album_name,
                id: album_id,
                image: album_image,
                artist: album_artist,
                album_type: album_type
            })
        }
    } else {
        const errorData = await response.json();  
        console.error('Failed to fetch albums:', errorData);
    }
}

const loadAlbums = async () => {
    const spotifyToken = await generateSpotifyToken()
    const idString = popular_albums_arr.map(pair => pair[1]).join(',')

    const response = await fetch(`https://api.spotify.com/v1/albums?ids=${idString}`, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`,  
            'Content-Type': 'application/json'
        }
    })

    if (response.ok) {
        const data = await response.json(); 
        for (const album of data.albums) {
            const album_name = album.name
            const album_id = album.id
            const album_artist = album.artists[0].name
            const album_image = album.images[0].url
            const album_type = data.album_type

            const temp_album = await Album.findOne({id: album_id})
            if(!temp_album) {
                const new_album = await Album.create({
                    name: album_name,
                    id: album_id,
                    artist: album_artist,
                    image: album_image,
                    album_type: album_type
                })
            }
        }
    } else {
        const errorData = await response.json();  
        console.error('Failed to fetch albums:', errorData);
    }
}



export {
    loadArtists,
    loadAlbums,
    loadAlbum,
    loadArtist,
    popular_artists_arr,
    popular_albums_arr
}