# This is Node.js test practice project

## ...Lessons 1-6...

## Authentication (Lesson7)

### Registration

- Create a user model [`src/models/user.js'](https://github.com/alex-dmytriev/nodejs-test/blob/main/src/models/user.js)
- Email should be unique, use `unique: true`
- Add [pre-hook](https://github.com/alex-dmytriev/nodejs-test/blob/5e38a90ea3359f0f72093e10869a51811ca76e8b/src/models/user.js#L24) to use email as username if none defined
- Delete the password from the response using [`.toJSON`](https://github.com/alex-dmytriev/nodejs-test/blob/5e38a90ea3359f0f72093e10869a51811ca76e8b/src/models/user.js#L32)
- Add validation schema to `src/validations/authValidation.js`
  - Use email validation `email: Joi.string().email().required()`
- Create the controller: `src/controllers/authController.js`
  - Add check for existing email
- Create route: `src/routes/authRoutes.js`
  - Add validation via `celebrate` and controller
- Connect auth route to `server.js` right before `studentsRoutes`

### Password hashing

- `npm i bcrypt` for hashing
- In `authController.js` hash the pass with [`bcrypt.hash()`](https://github.com/alex-dmytriev/nodejs-test/blob/5e38a90ea3359f0f72093e10869a51811ca76e8b/src/controllers/authController.js#L14)
- In `authController.js` Create a new user with `User.create`
- In `authController.js` Response without password

### Login

- Login algorithm:
  - Search for existing user by email
  - Compare the input password with the hash in DB
  - Return response if success or error if failed
- add [`loginUserSchema`](https://github.com/alex-dmytriev/nodejs-test/blob/dfd1e9659c2fc2d4d5b138b25b35efa6fc7d0049/src/validations/authValidation.js#L10) to `authValidation.js`
- add [`loginUser`](https://github.com/alex-dmytriev/nodejs-test/blob/dfd1e9659c2fc2d4d5b138b25b35efa6fc7d0049/src/controllers/authController.js#L25) controller to `authController.js`
- connect validator & controller to the route in `authRoutes.js`
