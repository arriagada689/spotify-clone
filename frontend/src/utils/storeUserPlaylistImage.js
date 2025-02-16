const storeUserPlaylistImage = async (url, token, id) => {
    try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
        const response = await fetch(`${apiBaseUrl}/users/store_user_playlist_image/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                url: url
            })
        })
        if(response.ok){
            const data = await response.json()
            return data.status
        }
    } catch (error) {
        console.log(error)
    }
    
}

export default storeUserPlaylistImage