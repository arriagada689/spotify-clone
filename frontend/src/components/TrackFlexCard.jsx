import React, { useState, useContext } from 'react'
import formatDuration from '../utils/formatDuration'
import { Link } from 'react-router-dom'
import { FiPlusCircle } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import { AuthContext } from '../contexts/AuthContext.jsx';

const TrackFlexCard = ({popular_track, flag, index}) => {
    const [liked, setLiked] = useState(flag !== undefined ? flag : null)
    const { updateSidebar } = useContext(AuthContext);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    const likeSong = async (e) => {
        e.preventDefault()
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        const response = await fetch(`${apiBaseUrl}/profile/like_song_full/${popular_track.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                track_name: popular_track.name,
                track_image: popular_track.album.images[0].url,
                track_duration: formatDuration(popular_track.duration_ms),
                track_artist: popular_track.artists[0].name,
                track_album: popular_track.album.name
            })
        })
        if(response.ok){
            const data = await response.json()
            // console.log(data);
            setLiked(true)
            updateSidebar()
        } else {
            const error = await response.json()
            console.error(error)
        }
    }

    const unlikeSong = async (e) => {
        e.preventDefault()
        const token = JSON.parse(localStorage.getItem('userInfo')).token
        const response = await fetch(`${apiBaseUrl}/profile/unlike_song/${popular_track.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok){
            const data = await response.json()
            setLiked(false)
            updateSidebar()
        } else {
            const error = await response.json()
            console.error(error)
        }
    }

    return (
        <Link to={`/track/${popular_track.id}`} key={index}>
            <div className="flex w-full bg-primary hover:bg-hoverGray items-center p-2 rounded-md parent">
                <img
                    src={popular_track.album.images[0].url}
                    alt={popular_track.name}
                    className="h-[45px] w-[45px] rounded-md"
                />
                <div className="flex w-full justify-between ml-2 items-center">
                    <div className="flex flex-col overflow-hidden">
                        <div className="text-white truncate max-w-[200px] md:max-w-[225px] lg:max-w-[350px] xl:max-w-[550px]">{popular_track.name}</div>
                        <div className="text-grayText text-sm truncate max-w-[200px] md:max-w-[225px] lg:max-w-[350px] xl:max-w-[550px]">{popular_track.artists[0].name}</div>
                    </div>
                    {liked !== null ? (
                        <div className="flex items-center text-grayText space-x-3">
                            {liked && localStorage.getItem('userInfo') ? (
                                <FaCheckCircle
                                    onClick={(e) => unlikeSong(e)}
                                    className="hover-show text-spotifyGreen"
                                    size={18}
                                />
                            ) : (
                                <FiPlusCircle
                                    onClick={(e) => likeSong(e)}
                                    className="hover-show"
                                    size={18}
                                />
                            )}
                            <div className="">{formatDuration(popular_track.duration_ms)}</div>
                        </div>
                    ) : (
                        <div className="flex items-center text-grayText space-x-3">
                            <div className="">{formatDuration(popular_track.duration_ms)}</div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default TrackFlexCard