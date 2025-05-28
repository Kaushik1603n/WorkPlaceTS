import { Strategy as JwtStrategy, StrategyOptions } from "passport-jwt";
import { Request } from "express";
import { PassportStatic } from "passport";
import User from "../../domain/models/User"; // Ensure this has TypeScript types

const cookieExtractor = (req: Request): string | null => {
  return req.cookies?.accessToken || null;
};

const jwtStrategy = (passport: PassportStatic) => {
  const opts: StrategyOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
  };

  passport.use(
    new JwtStrategy(opts, async (payload: any, done) => {
      try {
        const user = await User.findById(payload.userId);
        if (user) done(null, user);
        else done(null, false);
      } catch (error) {
        done(error, false);
      }
    })
  );
};

export default jwtStrategy;