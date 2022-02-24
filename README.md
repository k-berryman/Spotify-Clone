# Spotify Clone
Based on a tutorial from Sonny! https://www.youtube.com/watch?v=3xrko3GpYoU&t=1s&ab_channel=SonnySangha

Nextjs12, TailwindCSS, SpotifyAPI, NextAuth, Recoil

Nextjs 12 is a huge upgrade — it adds Middleware & server-rendered components
Debouncing is a technique to prevent ourselves from spamming APIs
JWT OAuth tokens persist log-in state. We'll talk about refreshing user tokens in a secure way. Particularly access/refresh tokens\
Recoil manages state
We'll use flexbox & cssgrid
Nextjs has a built in router, so we don't need react-router when we use Nextjs

# Setting Up
`npx create-next-app -e with-tailwindcss spotify-clone`
`cd spotify-clone`
Open it up in Atom

Go to `https://developer.spotify.com/dashboard/` , login, create an app

# Initializing the Build
`npm run dev`
Go to `pages/index.js`, which is actually `index.tsx` in my case, which is a TypeScript file written using JSX syntax

# Build Layout
Edit `index.tsx` to have comments where the components will go such as `{/* Sidebar */}`
Create `components` dir

# Build the Sidebar Component
Under `components`, create `Sidebar.js`

    function Sidebar() {
      return(
        <div>
          <h1> I am a side bar </h1>

        </div>
      )
    }

    export default Sidebar


In `index.tsx`,
`import Sidebar from '../components/Sidebar'`
`<Sidebar />`

heroicons (https://heroicons.com/)
`npm i @heroicons/react`
