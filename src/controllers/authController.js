import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(createHttpError(400, 'Email in use'));
  }

  // TODO: logic here

  res.status(201).json({});
};
