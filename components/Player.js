import useSpotify from "../hooks/useSpotify"
import { useSession } from "next-auth/react"
import { useState } from "react"
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

  return (
    <div>
      {/* Left */}
      <div>
        <img src={songInfo?.album.images?.[0]?.url} alt="" />
      </div>
    </div>
  )
}

export default Player
