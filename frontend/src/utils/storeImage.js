const storeImage = async (url, token) => {
    try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
        const response = await fetch(`${apiBaseUrl}/users/store_image`, {
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

export default storeImage