import { atom } from "recoil"

export const playlistState = atom({
  key: 'playlistState',
  default: null
})

export const playlistIdState = atom({
  key: 'playlistIdState',
  // default will be my INSPIRED playlist
  default: '48qBpOjH3UVpoCNmpsgigK'
})
