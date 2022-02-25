import { signOut, useSession } from "next-auth/react"
import { ChevronDownIcon } from "@heroicons/react/outline"
import { useEffect, useState } from "react"
import { shuffle } from "lodash"
import { useRecoilState, useRecoilValue } from "recoil"
import { playlistIdState, playlistState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify"
import Songs from "../components/Songs"

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
]


function Center() {
  // get user session info
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const [playlist, setPlaylist] = useRecoilState(playlistState)
  const spotifyApi = useSpotify();

  // imported as a read-only value
  const playlistId = useRecoilValue(playlistIdState);


  useEffect(() =>  {
    setColor(shuffle(colors).pop())
  }, [playlistId])

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body)
      })
      .catch((err) => console.log("error: ", err));
  }, [spotifyApi, playlistId])

  console.log(playlist)

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-black text-white textspace-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-2 pr-2"
          onClick={signOut}>
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt=""
          />
          <h2 className="p-2">{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section className={`flex items-end space x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>

      <img src={playlist?.images?.[0]?.url} className="h-44 w-44 shadow-2xl" alt=""></img>

       <div>
         <p className="pl-5">PLAYLIST</p>
         <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold pl-5">{playlist?.name}</h1>
       </div>
      </section>

      {/* Songs */}
      <div>
        <Songs className="absolute l-10 r-10 b-10"/>
      </div>
    </div>
  )
}

export default Center
