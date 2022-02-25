# Spotify Clone
Based on a tutorial from Sonny! https://www.youtube.com/watch?v=3xrko3GpYoU&t=1s&ab_channel=SonnySangha

Nextjs12, TailwindCSS, SpotifyAPI, NextAuth, Recoil

Nextjs 12 is a huge upgrade — it adds Middleware & server-rendered components
Debouncing is a technique to prevent ourselves from spamming APIs
JWT OAuth tokens persist log-in state. We'll talk about refreshing user tokens in a secure way. Particularly access/refresh tokens\
Recoil manages state
We'll use flexbox & cssgrid
Nextjs has a built in router, so we don't need react-router when we use Nextjs

## Setting Up
`npx create-next-app -e with-tailwindcss spotify-clone`
`cd spotify-clone`
Open it up in Atom

Go to `https://developer.spotify.com/dashboard/` , login, create an app

## Initializing the Build
`npm run dev`
Go to `pages/index.js`, which is actually `index.tsx` in my case, which is a TypeScript file written using JSX syntax

## Build Layout
Edit `index.tsx` to have comments where the components will go such as `{/* Sidebar */}`
Create `components` dir

## Build the Sidebar Component
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

## Understanding NextAuth Authentication
In the `pages` dir, create `login.js`

    function Login() {
       return(
         <div>
           <h1> this is the login page </h1>
         </div>
       )
     }

     export default Login

Go to http://localhost:3000/login and see the h1. Routing is already done!

We need to log in using the correct Spotify credentials and keep track of access tokens. The access token expires every hour and needs to be recreated with the refresh token.

## Implementing NextAuth Authentication
Go to https://next-auth.js.org/ and click get started. We're going to use v4. Click introduction and read around
Install by `npm i next-auth@beta`
Make sure it's  `"next-auth": "^4.0.0-beta.7",` in `package.json` .. it'll break otherwise

In `pages/api`, create a folder called `auth`
In `pages/api/auth` create a file named `[...nextauth].js`

Create a `.env` to keep track of all private info. On our local machine, use test values. In Vercel, set to production.

### Set up environment variables
In main dir, create file `.env.local`

Grab `CLIENT_ID` from Spotify Dashboard and set it to `NEXT_PUBLIC_CLIENT_ID`. Do the same for Client Secret.

Now access the environment variables by 1. restarting the server with `npm run dev` then 2. typing `process.env.CLIENT_IDxyz` in files when needed


## Implementing Spotify Web API

Alright now in the main dir, create `lib` folder for utility files/helpful files
In `lib`, create a helper file called `spotify.js`

Install spotify web api node
`npm i spotify-web-api-node`

In `spotify.js`, `import SpotifyWebApi from "spotify-web-api-node"`
`const scopes` are essentially the permissions, as in what're we asking for from Spotify

`params` will go on the end of an url search

## Implementing NextAuth Authentication (Continued)
Continue in  `[...nextauth].js` after the providers arr, add secret to encrypt the JWT tokens

We're going to make a custom login page. Map it like this

    pages: {
        signIn: '/login'
      }

JWT - Spotify gives us a JWT token. Let's get some values -

    callbacks: {
        aysnc jwt({ token, account, user })
      }

(this is regarding NextAuth Refresh Token Rotation - Google it)
We can check if it's the first sign in with if(account && user)

`accessTokenExpires: account.expires_at * 1000` handles the expiration time in milliseconds

**Our access token lasts an hour, then we need to refresh it.
Our refresh token doesn't expire** (unless revoked)

Meaning check if there's a new refresh token, but there will probably not be one

This line
`const { body: refreshedToken } = await spotifyApi.refreshAccessToken();`

Sends our current access & refresh tokens to Spotify and says give me a new one! So it gives us a new access token

This updates our token and sets expiration time one hour from now

      return {
      ...token,
      accessToken: refreshedToken.accessToken,
      accessTokenExpires: Date.now + refreshedToken.expires_in * 1000
    }

The above is all the auth. Below connects to what the client can see

This ..

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
    }
Allows the client to see the access token. Give them the hidden cookies!

Now for a **Server Side Render** (ssr).. Add

    export async function getServerSideProps() {

    }
 after `export default Login;` in `login.js`

This runs on the server before the page gets delivered every time.
Render it on the server, then deliver it to the client

## Customizing the Signin Page
In `login.js`
Now add the Spotify logo
Now add a JSX block `{ }` to map over each provider and make a button for them

`items-center` className adjusts horizontal axis
`justify-center` className adjusts vertical axis

Add `             onClick={() => signIn(provider.id, { callbackUrl: "/" })}
` to the button to handle the click

Now go back to the Spotify Developer Dashboard and go to settings, under redirect URIs enter http://localhost:3000/api/auth/callback/spotify, click add, click save

** ALSO DO THE ABOVE WHEN DEPLOYING **

Now `scopes` generates a permissions agreement, just agree

To sign out, add a button with `onClick={() => signOut()`
and import `import { signOut } from "next-auth/react";`

## Persisting State

If I'm logged out, it currently lets us still have access to the home page

To use `useSession` in `Sidebar.js` go to `_app.js` and add in a session provider with `import { SessionProvider } from "next-auth/react"` and add `<SessionProvider>` as a higher order component (it's higher order because it wraps the rest of the app).

This will allow us to persist our logged in state as we navigate through our app.

Back in `Sidebar.js` add in



         const { data: session, status } = useSession();
         console.log(session)

and test if the data persists... it does!!!! that's crazy!!!!
logging in and out works!!!!!

## Middleware

A powerful part of Next.js 12.
Every single time a user makes a request to our site, pass it through a server which checks it, this is called middleware. Our middleware checks for a token. If no token, get redirected! Gets caught between when messages are sent from client to server and vise verca.

In `pages` folder add a file named `_middleware.js`
This logic just checks if it's a request or if a token is present, if so, they can go on. If not, we don't let them in!!!

Restart the server

## Build the Center Component
In `components` folder, create `Center.js`

In `index.tsx`, get rid of the placeholder comment (`{/* Center */}`) with `<Center />` and import it

`npm install tailwind-scrollbar-hide`

Go to `tailwind.config.js` under plugins add `require("tailwind-scrollbar-hide")`

Installing Lodash `npm i lodash` to shuffle

## Implementing the useSpotify Custom Hook
Create `hooks` folder. In that, create `useSpotify.js`

This sets the session's access token by accessing methods in our spotifyApi

We're initializing the Spotify object once, then we reuse it throughout the app

Include spotifyApi in Sidebar.js by using the new hook `const spotifyApi = useSpotify()`

## Finalizing the Sidebar

        // dependencies are session & spotifyApi
      useEffect(() => {
        // if the access token is set
        if(spotifyApi.getAccessToken()) {
          // retrieve and set playlists
          spotifyApi.getUserPlaylists().then((data) => {
            setPlaylists(data.body.items)
          })
        }
      }, [session, spotifyApi])

      console.log(playlists)


    {/* Playlists */}
            {playlists.map((playlist) => (
              <p key={playlist.id} className="cursor-pointer hover:text-white">{playlist.name}</p>
            ))}

What if we want to store which playlist is click? You coulddd use useState, but that only saves it at the component level. This is where we need something like Redux, a ContextAPI, or Recoil

## Implementing Recoil
Recoil is a simple way to have global state management
Go to https://recoiljs.org/ and click get started
`npm install recoil`
also wrap our app in `<RecoilRoot></RecoilRoot>` in `_app.tsx`

      <SessionProvider session={session}>
          <RecoilRoot>
            <Component {...pageProps} />
          </RecoilRoot>
        </SessionProvider>

We have a global store that can be pushed or pulled into/from

We're going to create something called an Atom, which are sections that have context. Create a folder called `atoms`
Create `playlistAtom.js`

Atoms need unique keys
