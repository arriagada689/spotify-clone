import React from 'react'
import { Link } from 'react-router-dom'

const CompactGrid2 = ({ playlistItems, addedOn }) => {
    
    const cutString = (str) => {
        if(str.length >= 25){
            return str.substring(0, 24) + '...'
        } else {
            return str
        }
    }
    
    return (
        <>
            {/*Grid with 3 columns */}
            <div className='grid compact-grid xl:hidden 2xl:hidden'>
                <div className='grid-row text-grayText font-semibold'>
                    <div className="text-center border-b-2 border-hoverGray">#</div>
                    <div className="text-left border-b-2 border-hoverGray">Title</div>
                    <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                </div>

                {playlistItems.map((item, index) => {
                    return <Link to={item.type === 'Track' ? `/track/${item.id}` : `/audiobook/${item.id}`} className='grid-row' key={index}>
                                {/* Counter */}
                                <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1}</div>   

                                {/*Title */}
                                <div className='flex items-center text-left text-grayText grid-cell font-white'>{item.name}</div>

                                {/* Duration */}
                                <div className='flex items-center justify-center text-grayText grid-cell '>{item.duration}</div>
                            </Link>
                })}
            </div>

            {/*Grid with 5 columns */}
            <div className='hidden xl:grid compact-grid 2xl:hidden'>
                <div className='grid-row text-grayText font-semibold'>
                    <div className="text-center border-b-2 border-hoverGray">#</div>
                    <div className="text-left border-b-2 border-hoverGray">Title</div>
                    <div className="text-left border-b-2 border-hoverGray">Artist</div>
                    <div className="text-left border-b-2 border-hoverGray">Album</div>
                    <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                </div>

                {playlistItems.map((item, index) => {
                    return <Link to={item.type === 'Track' ? `/track/${item.id}` : `/audiobook/${item.id}`} className='grid-row' key={index}>
                                {/* Counter */}
                                <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1}</div>   

                                {/*Title */}
                                <div className='flex items-center text-left text-grayText grid-cell font-white'>{item.name}</div>

                                {/*Artist */}
                                <div className='flex items-center text-left text-grayText grid-cell'>{item.type === 'Track' ? cutString(item.artist) : cutString(item.author)}</div>

                                {/*Album */}
                                <div className='flex items-center text-left text-grayText grid-cell'>{item.type === 'Track' ? cutString(item.album) : ''}</div>

                                {/* Duration */}
                                <div className='flex items-center justify-center text-grayText grid-cell '>{item.duration}</div>
                            </Link>
                })}
            </div>

            {/*Grid with 6 columns */}
            <div className='hidden 2xl:grid compact-grid'>
                <div className='grid-row text-grayText font-semibold'>
                    <div className="text-center  border-b-2 border-hoverGray">#</div>
                    <div className="text-left border-b-2 border-hoverGray">Title</div>
                    <div className="text-left border-b-2 border-hoverGray">Artist</div>
                    <div className="text-left border-b-2 border-hoverGray">Album</div>
                    <div className="text-left border-b-2 border-hoverGray">Date added</div>
                    <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                </div>

                {playlistItems.map((item, index) => {
                    return <Link to={item.type === 'Track' ? `/track/${item.id}` : `/audiobook/${item.id}`} className='grid-row' key={index}>
                                {/* Counter */}
                                <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1}</div>   

                                {/*Title */}
                                <div className='flex items-center text-left text-grayText grid-cell font-white'>{item.name}</div>

                                {/*Artist */}
                                <div className='flex items-center text-left text-grayText grid-cell'>{item.type === 'Track' ? cutString(item.artist) : cutString(item.author)}</div>

                                {/*Album */}
                                <div className='flex items-center text-left text-grayText grid-cell'>{item.type === 'Track' ? cutString(item.album) : ''}</div>

                                {/* Date added */}
                                <div className='flex items-center text-left text-grayText grid-cell'>{addedOn[index]}</div>

                                {/* Duration */}
                                <div className='flex items-center justify-center text-grayText grid-cell '>{item.duration}</div>
                            </Link>
                })}
            </div>
        </>
    )
}

export default CompactGrid2