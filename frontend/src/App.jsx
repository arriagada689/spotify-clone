import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider 
} from 'react-router-dom'
import Home from './pages/Home.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import PopularArtists from './pages/PopularArtists.jsx'
import PopularAlbums from './pages/PopularAlbums.jsx'
import FeaturedPlaylists from './pages/FeaturedPlaylists.jsx'
import Search from './pages/Search.jsx'
import TrackPage from './pages/TrackPage.jsx'
import ArtistPage from './pages/ArtistPage.jsx'
import AlbumPage from './pages/AlbumPage.jsx'
import PlaylistPage from './pages/PlaylistPage.jsx'
import AudiobookPage from './pages/AudiobookPage.jsx'
import UserPage from './pages/UserPage.jsx'
import CreatePlaylist from './pages/CreatePlaylist.jsx'
import UserPlaylistPage from './pages/UserPlaylistPage.jsx'
import UpdatePlaylist from './pages/UpdatePlaylist.jsx'
import ConfirmPlaylistDelete from './pages/ConfirmPlaylistDelete.jsx'
import RecentSearchesPage from './pages/RecentSearchesPage.jsx'
import Profile from './pages/Profile.jsx'
import UpdateProfile from './pages/UpdateProfile.jsx'
import ConfirmProfileDelete from './pages/ConfirmProfileDelete.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import NotFound from './pages/NotFound.jsx'
import SavedPlaylistsPage from './pages/SavedPlaylistsPage.jsx'
import About from './pages/About.jsx'
import Logout from './pages/Logout.jsx'
import LikedSongs from './pages/LikedSongs.jsx'
import NewReleasesPage from './pages/NewReleasesPage.jsx'
import DiscographyPage from './pages/DiscographyPage.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<Home />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<SignUp />}/>
      <Route path='/about' element={<About />}/>
      <Route path='/popular_artists' element={<PopularArtists />}/>
      <Route path='/popular_albums' element={<PopularAlbums />}/>
      {/* <Route path='/featured_playlists' element={<FeaturedPlaylists />}/> */}
      <Route path='/new_releases' element={<NewReleasesPage />}/>
      <Route path='/search' element={<Search />}/>
      <Route path='/track/:id' element={<TrackPage />}/>
      <Route path='/artist/:id' element={<ArtistPage />}/>
      <Route path='/artist/:id/discography' element={<DiscographyPage />}/>
      <Route path='/album/:id' element={<AlbumPage />}/>
      <Route path='/playlist/:id' element={<PlaylistPage />}/>
      <Route path='/audiobook/:id' element={<AudiobookPage />}/>
      <Route path='/user/:id' element={<UserPage />}/>
      <Route path='/logout' element={<Logout />}/>
      <Route path='/create_playlist' element={<RequireAuth> <CreatePlaylist /> </RequireAuth>}/>
      <Route path='/update_playlist/:id' element={<RequireAuth> <UpdatePlaylist /> </RequireAuth>}/>
      <Route path='/user_playlist/:id' element={<RequireAuth> <UserPlaylistPage /> </RequireAuth>}/>
      <Route path='/confirm_playlist_delete/:id' element={<RequireAuth> <ConfirmPlaylistDelete /> </RequireAuth>}/>
      <Route path='/recent_searches' element={<RequireAuth> <RecentSearchesPage /> </RequireAuth>}/>
      <Route path='/profile' element={<RequireAuth> <Profile /> </RequireAuth>}/>
      <Route path='/update_profile' element={<RequireAuth> <UpdateProfile /> </RequireAuth>}/>
      <Route path='/confirm_delete_profile' element={<RequireAuth> <ConfirmProfileDelete /> </RequireAuth>}/>
      <Route path='/saved_playlists' element={<RequireAuth> <SavedPlaylistsPage /> </RequireAuth>}/>
      <Route path='/liked_songs' element={<RequireAuth> <LikedSongs /> </RequireAuth>}/>
      <Route path='*' element={<NotFound />}/>
    </Route>
  )
)

function App() {
  
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
