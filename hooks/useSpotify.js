import { useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import spotifyApi from '../lib/spotify'

function useSpotify() {
  const { data: session, status } = useSession();

  // this will run on mount and whenever session changes
  useEffect(() => {
    if(session) {
      // handle error from pages/api/auth/[...nextauth].js
      if(session.error === 'RefreshAccessTokenError') {
        signIn();
      }

      // spotifyApi is from lib/spotify.js
      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [session]);

  return spotifyApi;
}

export default useSpotify
