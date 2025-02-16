import React from 'react'
import { Link } from 'react-router-dom'

const ListGrid2 = ({ playlistItems, addedOn }) => {
    return (
        <>
            {/*Grid with 3 columns */}
            <div className='grid sub-grid xl:hidden 2xl:hidden'>
                    <div className='grid-row text-grayText font-semibold'>
                        <div className="text-center  border-b-2 border-hoverGray">#</div>
                        <div className="text-left border-b-2 border-hoverGray">Title</div>
                        <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                    </div>

                    {playlistItems.map((item, index) => {
                        return <Link to={item.type === 'Track' ? `/track/${item.id}` : `/audiobook/${item.id}`} className='grid-row' key={index}>
                                    {/* Counter */}
                                    <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1}</div>   

                                    {/* Title and Artist */}
                                    <div className='grid-cell flex items-center text-left'>
                                        <img src={item.image} alt={item.name} className='h-[45px] w-[45px] rounded-md' />
                                        <div className="flex flex-col ml-2">
                                            <div className='text-white'>{item.name}</div>
                                            <div className='text-sm text-grayText'>{item.type === 'Track' ? item.artist : item.author}</div>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className='flex items-center justify-center text-grayText grid-cell '>{item.duration}</div>
                                </Link>
                    })}
                </div>

            {/*Grid with 4 columns */}
            <div className='hidden xl:grid sub-grid 2xl:hidden'>
                    <div className='grid-row text-grayText font-semibold'>
                        <div className="text-center  border-b-2 border-hoverGray">#</div>
                        <div className="text-left border-b-2 border-hoverGray">Title</div>
                        <div className="text-left border-b-2 border-hoverGray">Album</div>
                        <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                    </div>

                    {playlistItems.map((item, index) => {
                        return <Link to={item.type === 'Track' ? `/track/${item.id}` : `/audiobook/${item.id}`} className='grid-row' key={index}>
                                    {/* Counter */}
                                    <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1}</div>   

                                    {/* Title and Artist */}
                                    <div className='grid-cell flex items-center text-left'>
                                        <img src={item.image} alt={item.name} className='h-[45px] w-[45px] rounded-md' />
                                        <div className="flex flex-col ml-2">
                                            <div className='text-white'>{item.name}</div>
                                            <div className='text-sm text-grayText'>{item.type === 'Track' ? item.artist : item.author}</div>
                                        </div>
                                    </div>

                                    {/*Album */}
                                    <div className='flex items-center text-left text-grayText grid-cell'>{item.type === 'Track' ? item.album : ''}</div>

                                    {/* Duration */}
                                    <div className='flex items-center justify-center text-grayText grid-cell '>{item.duration}</div>
                                </Link>
                    })}
                </div>

            {/*Grid with 5 columns */}
            <div className='hidden 2xl:grid sub-grid'>
                <div className='grid-row text-grayText font-semibold'>
                    <div className="text-center  border-b-2 border-hoverGray">#</div>
                    <div className="text-left border-b-2 border-hoverGray">Title</div>
                    <div className="text-left border-b-2 border-hoverGray">Album</div>
                    <div className="text-left border-b-2 border-hoverGray">Date added</div>
                    <div className="mx-auto border-b-2 border-hoverGray w-full">Duration</div>
                </div>

                {playlistItems.map((item, index) => {
                    return <Link to={item.type === 'Track' ? `/track/${item.id}` : `/audiobook/${item.id}`} className='grid-row' key={index}>
                                {/* Counter */}
                                <div className='flex items-center justify-center text-grayText grid-cell'>{index + 1}</div>   

                                {/* Title and Artist */}
                                <div className='grid-cell flex items-center text-left'>
                                    <img src={item.image} alt={item.name} className='h-[45px] w-[45px] rounded-md' />
                                    <div className="flex flex-col ml-2">
                                        <div className='text-white'>{item.name}</div>
                                        <div className='text-sm text-grayText'>{item.type === 'Track' ? item.artist : item.author}</div>
                                    </div>
                                </div>

                                {/*Album */}
                                <div className='flex items-center text-left text-grayText grid-cell'>{item.type === 'Track' ? item.album : ''}</div>

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

export default ListGrid2