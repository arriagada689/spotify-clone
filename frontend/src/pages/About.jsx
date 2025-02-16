import React from 'react'

const About = () => {
    return (
        <div className='bg-primary px-5 pb-16 md:pb-2 h-fit md:h-full flex flex-col'>
            <div className="flex flex-col text-white mx-auto text-center md:w-2/3 space-y-5">
                <div className='text-2xl font-bold'>About</div>
                <div>
                    <div className='text-xl text-left font-semibold'>Introduction</div>
                    <div className='text-left'>
                        Welcome to my Spotify Clone App. This is a full stack MERN project which includes many of the essential features and a similar UI to the original Spotify.
                        Search for your favorite artists, tracks, albums, playlists, and audiobooks. All music data pulled from the 
                        <a href="https://developer.spotify.com/documentation/web-api" className='text-spotifyGreen underline md:no-underline md:hover:underline'> Spotify Web API</a>.
                    </div>
                </div>
                
                <div>
                    <div className='text-xl text-left font-semibold'>Backend functionality</div>
                    <div className="text-left">
                        <ul className='list-disc pl-5'>
                            <li>User authentication</li>
                            <li>Customizable playlists</li>
                            <li>Save tracks and audiobooks to your playlists</li>
                            <li>Save artists, albums, playlists, and audiobooks to your library</li>
                            <li>Customizable profile</li>
                            <li>Image uploading and hosting</li>
                        </ul>
                    </div>
                </div>
                
                <div>
                    <div className='text-xl text-left font-semibold'>React features included</div>
                    <div className="text-left">
                        <ul className="list-disc pl-5">
                            <li>Dynamic UI components</li>
                            <li>React Router</li>
                            <li>State, props, hooks</li>
                            <li>JSX</li>
                            <li>Context API</li>
                        </ul>
                    </div>
                </div>

                <div>
                    <div className='text-xl text-left font-semibold'>Implementation</div>
                    <div className="text-left">
                        <ul className="list-disc pl-5">
                            <li>Backend server implemented using Node.js and Express</li>
                            <li>Styling implemented using Tailwind CSS</li>
                            <li>Database implemented using MongoDB</li>
                            <li>Server hosted on Render</li>
                            <li>Frontend hosted on Vercel</li>
                            <li>Images hosted on Firebase</li>
                        </ul>
                    </div>
                </div>

                <div className="text-left">For more details about the code, check out the <a href="https://github.com/arriagada689/spotify-frontend" className='text-spotifyGreen underline md:no-underline md:hover:underline'> project github page</a>.</div>
            </div>
        </div>
    )
}

export default About
