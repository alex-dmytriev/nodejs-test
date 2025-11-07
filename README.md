# This is Node.js test practice project

## Table of Contents

- [**Authentication (Lesson 7)**](https://github.com/alex-dmytriev/nodejs-test?tab=readme-ov-file#)
  - [Registration](https://github.com/alex-dmytriev/nodejs-test?tab=readme-ov-file#registration)
  - [Password hashing](https://github.com/alex-dmytriev/nodejs-test?tab=readme-ov-file#password-hashing)
  - [Login](https://github.com/alex-dmytriev/nodejs-test?tab=readme-ov-file#login)
  - [Sessions](https://github.com/alex-dmytriev/nodejs-test?tab=readme-ov-file#sessions)
  - [Cookies](https://github.com/alex-dmytriev/nodejs-test?tab=readme-ov-file#cookies)
  - [Logout](https://github.com/alex-dmytriev/nodejs-test?tab=readme-ov-file#logout)
- [**Authentication Part 2 (Lesson 8)**](https://github.com/alex-dmytriev/nodejs-test?tab=readme-ov-file#authentication-part2-lesson-8)
  - [Session update (cookies rotation)](https://github.com/alex-dmytriev/nodejs-test?tab=readme-ov-file#session-update-cookie-rotation)
  - [Auth Middleware](https://github.com/alex-dmytriev/nodejs-test?tab=readme-ov-file#authenticate-middleware)
  - [Model connections](https://github.com/alex-dmytriev/nodejs-test?tab=readme-ov-file#model-connections)
  - [Private Data](https://github.com/alex-dmytriev/nodejs-test?tab=readme-ov-file#private-data)

## Node.js Intro (Lesson 1)

### Initialize Node.js project

- Check node version `node --v`
- Init npm in the working folder `npm init -y`
- Add `"type": "module"` to `package.json`

### JS run out of the browser

- `npm i -D nodemon`
- Add nodemon script to `package.json`

### Working Environment Setup

- Install EditorConfig extension
- Create `.editorconfig` file
- Add config to it (see code)
- Install Prettier
- Create `.prettierrc` + config
- Install ESLint extension
- `npm init @eslint/config@latest`
- Add rules property to `eslint.config.mjs` (see code)
- Create & setup `.gitignore`

## Express (Lesson 2) ...In Progress...

### Webservice creation

- `npm i express`
- Create `/src/server.js`
- Add boilerplate code to test (see code)
- ...

## ...Lessons 3-6...

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

### Model connections

- Configure connection between `users` and `students`
- Add connection to `src/models/student.js`
  - userId with ref to "User" collection
- Add userId property to `createStudent()` in `.studentsController.js`

### Private Data

- Todo 1: return only students related to current user
- Todo 2: allow CRUD of the student only for it's related user
- Apply logic to limit actons by userId so that only authorized users and manipulate students in their group of influence in `studetsController.js`
  - **Get All students**: Add userId to Student.find()
  - **Get Student by ID**: Add `userId` to `Student.findOne()` (use `.findOne` instead of `.findOneById`)
  - **Delete student**: Add `userId` to `Student.findOneAndDelete()`
  - **Update Student**: add `userId` to `.findOneAndUpdate()`

## Email (Lesson 9)

### Email Protocols

- 📚 SMTP: to send data to email server
- 📚 POP3: to receive and store data
- 📚 Crypto versions: TLS/SSL

### Password Reseting Plan

- 📚 OTP: one time password
- 📚 JWT: JSON Web token
  - Format: header.payload.signature
  - Header contains meta data
  - Payload (claims like userId...)
  - Signature contains secret key generated with header + payload

#### Algorithm:

- Create endpoint `POST /auth/request-reset-password`
  - check user email
  - generate JWT
  - send password reset email
- Create endpoin `POST /auth/reset-password`
  - accept token and new password
  - check token
  - update user password

### Password Reset (practice)

- add validator `requestResetEmailSchema` to `authValidation.js` (just email)
- add controller `requestResetEmail` to `authController.js`
- connect validation and controller to route `/src/routes/authRoutes.js`

#### SMTP & Sending Utility

- `npm i nodemailer`
- register on Brevo.com
- add extra environment variables from Brevo.com to `.env`
- Create utility `src/utils/sendEmail.js`

#### Generate JWT for the link

- `npm i jsonwebtoken`
- add random secret string to `.env` the value may be any `JWT_SECRET`
- add token generation and email sent to the `authController.js`

### Handlebars Templator

- `npm i handlebars` helps to work with email html dynamically
- create `src/templates/reset-password-email.html`
- connect handlebars in `authController.js` (FRONTEND_DOMAIN=http://localhost:3000 temporarily)

### Password change

- use route `POST /auth/reset-password`
- add validator `resetPasswordSchema` to `authValidation.js`
- add controller `resetPassword` (see logic)
- add route, validator and controller to `authRoutes.js`

## Images (Lesson 10)

### Files Transferring

- 📚 `Content-Type: multipart/form-data` to send files via HTTP

### Avatar

- add `avatar` property to user model
- create `userController.js` and add `updateUserAvatar`
- create `userRoutes.js` and add `/users/me/avatar` route
- add new routes to `server.js`

### Multer Settings

- `npm i multer` - middleware to upload images
- create `src/middleware/multer.js` (see code)
- connect the middleware to the `PATCH /users/me/avatar` in `userRoutes.js`

#### Work with file in controller

- add file check to `userController.js`
