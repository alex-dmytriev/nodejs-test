import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';

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

  // Response with user data without password
  res.status(201).json({ newUser });
};

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

  res.status(200).json(user);
};
