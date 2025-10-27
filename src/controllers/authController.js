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
