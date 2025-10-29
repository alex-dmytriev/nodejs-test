import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

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
  res.status(201).json({ newUser });
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
