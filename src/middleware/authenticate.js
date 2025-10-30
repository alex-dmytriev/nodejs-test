import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  // 1. Check if accessToken exists
  if (!req.cookies.accessToken) {
    return next(createHttpError(401, 'Missing access token'));
  }

  // 2. If accessToken exists, search for session
  const session = await Session.findOne({
    accessToken: req.cookies.accessToken,
  });

  // 3. If there's no session, return error
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  // 4. Check accessToken expiration
  const isSessionTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isSessionTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  // 5. If both token and session OK, search for the user
  const user = await User.findById(session.userId);
  // 6. If user not found
  if (!user) {
    return next(createHttpError(401), 'User not found');
  }

  // 7. If user exists, add it to the query
  req.user = user;

  // 8. Move forward
  next();
};
