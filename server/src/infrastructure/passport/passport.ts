import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { Request } from "express";
import User from "../../domain/models/User";
// import { userRepoI } from '../../domain/interfaces/IuserRepo';
import jwtStrategy from "./jwtStrategy";

jwtStrategy(passport);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
      passReqToCallback: true,
    },
    async (
      _req: Request,
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done
    ) => {
      try {
        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: profile.emails?.[0]?.value },
          ],
        });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails?.[0]?.value,
            isVerified: true,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
