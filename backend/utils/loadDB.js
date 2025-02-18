import generateSpotifyToken from "./generateSpotifyToken.js";
import Artist from "../models/artistModel.js";
import Album from "../models/albumModel.js";

const popular_artists_arr = [
    ['Kendrick Lamar', '2YZyLoL8N0Wb9xBt1NhZWg'],
    ['The Weekend', '1Xyo4u8uXC1ZmMpatF05PJ'], 
    ['Lady Gaga', '1HY2Jd0NmPuamShAr6KMms'],
    ['Drake', '3TVXtAsR1Inumwj472S9r4'],  
    ['Billie Eilish', '6qqNVTkY8uBg9cP3Jd7DAH'], 
    ['SZA', '7tYKF4w9nC0nq9CsPZTHyP'], 
    ['Post Malone', '246dkjvS1zLTtiykXe5h60'],
    ['Rihanna', '5pKCCKE2ajJHZ9KAiaK11H'], 
    ['Kanye West', '5K4W6rqBFWDnAN6FQUkS6x'],
    ['Tyler, The Creator', '4V8LLVI7PbaPR0K2TGSxFF'],
    ['Taylor Swift', '06HL4z0CvFAxyc27GXpf02'],
    ['Future', '1RyvyyTE3xzB2ZywiAwp0i'], 
    ['Morgan Wallen', '4oUHIQIBe0LHzYfvXNW4QM'],
    ['Sabrina Carpenter', '74KM79TiuVKeVCqs8QtB0B'], 
    ['Bruno Mars', '0du5cEVh5yTK9QJze8zA0C'],
    ['Eminem', '7dGJo4pcD2V6oG8kP0tJRR'],  
    ['Zach Bryan', '40ZNYROS4zLfyyBSs2PGe2'],
    ['Tommy Richman', '1WaFQSHVGZQJTbf0BdxdNo'],
    ['Chappell Roan', '7GlBOeep6PqTfFi59PTUUN'],
    ['Hozier', '2FXC3k01G6Gw61bmprjgqS'], 
    ['Luke Combs', '718COspgdWOnwOFpJHRZHS'], 
    ['Travis Scott', '0Y5tJX1MQlPlqiwlOH1tJY'],
    ['Beyonce', '6vWDO969PvNqNYHIOW5v0m'],
    ['Ariana Grande', '66CXWjxzNUsdJxJ2JdwvnR'], 
];

const popular_albums_arr = [
    ['DeBÍ TiRAR MáS FOToS', '5K79FLRUCSysQnVESLcTdb'],
    ['GNX', '0hvT3yIEysuuvkK73vgdcW'],
    ['SOS Deluxe: LANA', '3VQkNrG74QPY4rHBPoyZYZ'],
    ['CHROMAKOPIA', '0U28P0QVB1QRxpqp5IHOlH'],
    ['Hurry Up Tomorrow', '3OxfaVgvTxUTy7276t7SPU'],
    ['HIT ME HARD AND SOFT', '7aJuG4TFXa2hmE4z1yxc3n'],
    ["Short n'Sweet", '3iPSVi54hsacKKl1xIR2eH'],
    ['10 Hours of Continuous Rain Sounds for Sleeping' ,'54vGSK50oe08qxz2xXECEC'], 
    ['The Rise and Fall of a Midwest Princess' ,'0EiI8ylL0FmWWpgHVTsZjZ'], 
    ['One Thing At a Time' ,'6i7mF7whyRJuLJ4ogbH2wh'],
    ['$ome $exy $ongs 4 U', '6Rl6YoCarF2GHPSQmmFjuR'],
    ['Alligator Bites Never Heal', '60UzB8mOCMpc7xkuJE6Bwc'],
    ['Blonde' ,'3mH6qwIy9crq0I9YQbOuDf'],
    ['THE TORTURED POETS' ,'5H7ixXZfsNMGbIE5OBSpcb'], 
    ['Best White Noise For Sleeping Baby', '0NGHR9zjS5eFFlqtClA9VV'],
    ['channel ORANGE', '392p3shh2jkxUxY2VHvlH8'],
    ['INCÓMODO', '27GWSFRITD8JJcSGMgEfTN'],
    ['Wicked: The Soundtrack', '3JUrJP460nFIqwjxM19slT'],
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
                console.log(`${new_artist.name} was made`)
            } else { 
                //update artist data incase of changes
                const updated_artist = await Artist.findOneAndUpdate(
                    { id: artist_id },
                    {
                        name: artist_name,
                        image: artist_image
                    },
                    { new: true } // Returns the updated document
                );
                console.log(`${updated_artist.name} was updated`);
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
            console.log(`${new_album.name} was made`)
        } else {
            //update data incase any information changed
            const updated_album = await Album.findOneAndUpdate(
                { id: album_id },
                {
                    name: album_name,
                    image: album_image,
                    artist: album_artist,
                    album_type: album_type
                }
            )
            console.log(`${updated_album.name} was updated`)
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
                console.log(`${new_album.name} was made`)
            } else {
                //update data incase any information changed
                const updated_album = await Album.findOneAndUpdate(
                    { id: album_id },
                    {
                        name: album_name,
                        image: album_image,
                        artist: album_artist,
                        album_type: album_type
                    }
                )
                console.log(`${updated_album.name} was updated`)
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