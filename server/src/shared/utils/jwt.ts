import jwt from "jsonwebtoken";

interface JwtPayloadWithUserId extends jwt.JwtPayload {
  userId: string;
  email:string
}

const generateTokens = (userId: string, email: string) => {
  const accessToken = jwt.sign(
    { userId, email },
    process.env.ACCESS_TOKEN_SECRET !,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET !, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const verifyAccessToken = (token:string) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET !,);
};

const verifyRefreshToken = (token:string):JwtPayloadWithUserId => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET !) as JwtPayloadWithUserId;
};

export { generateTokens, verifyAccessToken,verifyRefreshToken};
