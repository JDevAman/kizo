// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { Strategy as GitHubStrategy } from "passport-github2";
// import { userRepository } from "../repositories/user.repository";
// import { AuthProvider } from "@prisma/client";

// // --- 1. Google Strategy ---
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       callbackURL: process.env.GOOGLE_REDIRECT_URI,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails?.[0].value;

//         if (!email) {
//             return done(new Error("No email found from Google"), undefined);
//         }

//         const user = await userRepository.findOrCreateOAuthUser({
//           email: email,
//           firstName: profile.name?.givenName || "User",
//           lastName: profile.name?.familyName || "",
//           avatar: profile.photos?.[0].value,
//           provider: AuthProvider.GOOGLE,
//         });

//         return done(null, user);
//       } catch (error) {
//         return done(error, undefined);
//       }
//     }
//   )
// );

// // --- 2. GitHub Strategy ---
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID as string,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
//       callbackURL: process.env.GITHUB_REDIRECT_URI,
//       scope: ["user:email"],
//     },
//     async (accessToken: string, refreshToken: string, profile: any, done: any) => {
//       try {
//         // GitHub specific logic: Email might be in a separate array if private
//         let email = profile.emails?.find((e: any) => e.primary || e.verified)?.value;

//         if (!email && profile.emails?.[0]) {
//             email = profile.emails[0].value;
//         }

//         if (!email) {
//             return done(new Error("No email found from GitHub"), undefined);
//         }

//         // GitHub names are often one string, so we split them manually
//         const [firstName, ...rest] = (profile.displayName || profile.username).split(" ");
//         const lastName = rest.join(" ") || "";

//         const user = await userRepository.findOrCreateOAuthUser({
//           email: email,
//           firstName: firstName || "User",
//           lastName: lastName,
//           avatar: profile.photos?.[0].value,
//           provider: AuthProvider.GITHUB,
//         });

//         return done(null, user);
//       } catch (error) {
//         return done(error, undefined);
//       }
//     }
//   )
// );

// export default passport;
