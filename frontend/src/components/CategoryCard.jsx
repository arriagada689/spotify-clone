import React from 'react'
import { Link } from 'react-router-dom'
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter.js'

const CategoryCard = ({ name, color }) => {

    return (
        <Link to={`/search?query=${name}`}>
            <div className={`${color} h-[110px] w-[170px] rounded-2xl text-lg flex items-center justify-center text-white font-semibold`}>
                {capitalizeFirstLetter(name)}
            </div>
        </Link>
    )
}

export default CategoryCard