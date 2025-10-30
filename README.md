# This is Node.js test practice project

## ...Lessons 1-6...

## Authentication (Lesson7)

### Registration

- Create a user model [`src/models/user.js'](https://github.com/alex-dmytriev/nodejs-test/blob/main/src/models/user.js)
  - Use `unique: true` for email
  - Add [pre-hook](https://github.com/alex-dmytriev/nodejs-test/blob/5e38a90ea3359f0f72093e10869a51811ca76e8b/src/models/user.js#L24) to use email as username if none defined
  - Delete the password from the response using [`.toJSON`](https://github.com/alex-dmytriev/nodejs-test/blob/5e38a90ea3359f0f72093e10869a51811ca76e8b/src/models/user.js#L32)
- Add `registerUserSchema` to `src/validations/authValidation.js`
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

### Sessions

- Create a model for session in `src/models/session.js`
  - `accessToken`: short-living token (15 min)
  - `accessTokenValidUntil`: when `accessToken` expires
  - `refreshToken`: long-living token (1 day)
  - `refreshTokenValidUntil`: when `refreshToken` expires
  - `userId`: session owner
- Store time constants in `src/constants/time.js` to reuse them
- Create a session in `src/services/auth.js`
- Session usage in `authControllers`:
  - Register => create a new session
  - Login => remove old session (if any), create a new one

### Cookies

- Setup cookie parser
  - `npm i cookie-parser`
  - Add it as middleware to `server.js` via `app.use(cookieParser());`
- Add cookie setup to `src/services/auth.js` (see logic inside)
- Add cookie setup to controllers `authController.js`
  - Controllers create / check the user
  - Then set cookies
- There should be two new collections in MongoDB now: users & sessions
- Note that users <> students that's why regular search by ID will not work

### Logout

- Todo 1: clear cookies (via server only)
- Todo 2: Delete session from DB
- Add `logoutUser` controller to `authController.js`
- Add `/auth/logout` route to `authRoutes.js`

## Authentication Part2 (Lesson 8)

### Session update (cookie rotation)

- Add `refreshUserSession` controller to `authController.js` (see logic)
- Add `/auth/refresh` to `authRoutes.js`

### Authenticate Middleware

- Create `src/middleware/authenticate.js` (see logic)
- Use it in `studentsRoutes.js`
  - import it
  - add it to all the routes that start with `/students`
