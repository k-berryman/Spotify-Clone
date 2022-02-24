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

Now add the Spotify logo
Now add a JSX block `{ }` to map over each provider and make a button for them 