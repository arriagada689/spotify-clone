import React from 'react'
import { FaListUl } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const GridDropdownButton = ({ gridDropdown, gridView, setGridDropdown, setGridView, sortingMetric, setSortingMetric }) => {

    const handleDropdownClick = (action) => {
        setGridView(action)
        setGridDropdown(false)
    }

    const sortingObj = {
        1: 'Title descending',
        2: 'Title ascending',
        5: 'Duration descending',
        6: 'Duration ascending',
    }
    
    return (
        <div className='text-grayText relative'>
            {/*Grid view button*/}
            {gridView === 'List' ? (
                <button onClick={(e) => setGridDropdown(prev => !prev)} className='flex items-center hover:text-white'>
                    <div className='mr-2'>List</div>
                    <FaListUl size={17}/>
                </button>
            ) : (
                <button onClick={(e) => setGridDropdown(prev => !prev)} className='flex items-center hover:text-white'>
                    <div className='mr-2'>Compact</div>
                    <GiHamburgerMenu size={17}/>
                </button>
            )}

            {/*dropdown */}
            {gridDropdown &&
                <div className='absolute right-0 mt-2 -ml-10 bg-grayBox shadow-lg flex flex-col w-40 p-3 gap-y-2 rounded-lg text-white'>
                    {/*Sort by section */}
                    <div className='text-sm text-grayText'>Sort by</div>
                    <button onClick={() => setSortingMetric(sortingMetric === 1 ? 2 : 1)} className={`flex justify-between items-center w-full ${sortingMetric === 1 || sortingMetric === 2 ? 'text-spotifyGreen' : ''}`}>
                        <span>Title</span>
                        {sortingMetric === 1 && <FaArrowUp />}
                        {sortingMetric === 2 && <FaArrowDown />}
                    </button>

                    <button onClick={() => setSortingMetric(sortingMetric === 5 ? 6 : 5)} className={`flex justify-between items-center w-full ${sortingMetric === 5 || sortingMetric === 6 ? 'text-spotifyGreen' : ''}`}>
                        <span>Duration</span>
                        {sortingMetric === 5 && <FaArrowUp />}
                        {sortingMetric === 6 && <FaArrowDown />}
                    </button>
                    
                    {/*View as section */}
                    <div className='text-sm text-grayText'>View as</div>
                    <button onClick={() => handleDropdownClick('Compact')} className={`flex justify-between items-center w-full ${gridView === 'Compact' ? 'text-spotifyGreen' : ''}`}>
                        <span className='flex items-center w-full'>
                            <GiHamburgerMenu size={20}/>
                            <div className='ml-2'>Compact</div>
                        </span>
                        {gridView === 'Compact' && <IoMdCheckmark />}
                    </button>

                    <button onClick={() => handleDropdownClick('List')} className={`flex justify-between items-center w-full ${gridView === 'List' ? 'text-spotifyGreen' : ''}`}>
                        <span className='flex items-center w-full'>
                            <FaListUl size={20}/>
                            <div className='ml-2'>List</div>
                        </span>
                        {gridView === 'List' && <IoMdCheckmark size={20}/>}
                    </button>
                </div>
            }
        </div>
    )
}

export default GridDropdownButton