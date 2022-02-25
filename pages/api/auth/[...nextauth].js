import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token) {
  try {

    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    console.log("refreshed token is ....", refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.accessToken,
      accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refreshToken ?? token.refreshToken,
    }

  } catch(error) {
    console.log(error)

    return {
      ...token,
      error: 'RefreshAccessTokenError'
      // error is handled in useSpotify hook
    }
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, account, user }) {

      // initial sign in
      if(account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
        }
      }

      // Return previous token if the access token hasn't expired
      if(Date.now() < token.accessTokenExpires) {
        console.log("Access token is valid!");
        return token;
      }

      // Access token expired, so we need to refresh it
      console.log("Access token is expired! Refreshing...");
      return await refreshAccessToken(token);

    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    }
  },
})
