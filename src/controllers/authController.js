import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';

//* Register controller
export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(createHttpError(400, 'Email in use'));
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create a new user
  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  // Create a new session
  const newSession = await createSession(newUser._id);

  // Call and transmit the response and session
  setSessionCookies(res, newSession);

  // Response with user data without password
  res.status(201).json(newUser);
};

//* Login controller
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if this user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(createHttpError(401, 'Invalid credentials'));
  }

  // Compare pasword hash
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(createHttpError(401, 'Invalid credentials'));
  }

  // Remove the old session
  await Session.deleteOne({ userId: user._id });
  // Create a new session
  const newSession = await createSession(user._id);

  // Call, transmit response and session
  setSessionCookies(res, newSession);

  res.status(200).json(user);
};

//* Logout controller
export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send(); // 204 no content response
};

//* Refresh session controller
export const refreshUserSession = async (req, res, next) => {
  // 1. Looking for the current session by Session ID and refreshToken
  const session = await Session.findOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  // 2. If there's no session, return error
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  // 3. If session exists, validate refresh token
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  // If refresh token is expired, return error
  if (isSessionTokenExpired) {
    return next(createHttpError(401, 'Session token expired'));
  }

  // 4. If all the checks went well, delete current session
  await Session.deleteOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  // 5. Create a new session and add cookies
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({ message: 'Session refreshed' });
};

//* Password reset request controller
export const requestResetEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // if there's no user deliberately return "success response"
  if (!user) {
    {
      return res
        .status(200)
        .json({ message: 'If this email exists, a reset link has been sent' });
    }
  }

  // if there is a user, getnerate JWT and send email
  const resetToken = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
    });
  } catch {
    next(
      createHttpError(500, 'Failed to send the email, please try again later'),
    );
    return;
  }
  res
    .status(200)
    .json({ message: 'If this email exists, a reset link has been sent' });
};
