import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.error('Error middleware: ', err);

  // If an error created via http-errors
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message || err.name });
  }

  const isProd = process.env.NODE_ENV === 'production';

  // The rest of the errors are 500
  res.status(500).json({
    message: isProd
      ? 'Something went wrong, Please try again later.'
      : err.message,
  });
};
