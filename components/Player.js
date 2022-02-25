import useSpotify from "../hooks/useSpotify"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRecoilState } from "recoil"
import useSongInfo from "../hooks/useSongInfo"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const songInfo = useSongInfo()

  const [volume, setVolume] = useState(50)

  const fetchCurrentSong = () => {
    if(!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id)

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing)
        })
      })
    }
  }

  useEffect(() => {
    if(spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50)
    }
  }, [currentTrackId, spotifyApi, session])

  return (
    <div>
      {/* Left */}
      <div>
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt="" />
      </div>
    </div>
  )
}

export default Player
