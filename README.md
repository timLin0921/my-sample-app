# my-sample app

## Dashboard Features

- [x] Sign up with eamil and password:
  - [x] Form validation(email/password)
  - [x] Register (/user/register)
  - [x] Sign in (/user/login)
  - [x] Email Verification
- [x] Oauth2:
  - [x] Sign up/sign in with google(/auth/google)
  - [x] Sign up/sign in with facebook(/auth/facebook)
- [x] User profile
  - [x] Reset password
  - [x] Reset user name
- [x] logout (/user/logout)
- [x] User Database Dashboard
  - [x] Timestamp of user sign up.
  - [x] Number of times logged in.
  - [x] Timestamp of the last user session.
  - [x] User Statistics
    - [x] Total number of users who have signed up.
    - [x] Total number of users with active sessions today.
    - [x] Average number of active session users in the last 7 days rolling.

## API Features

- [x] Sign up with eamil and password:
  - [x] Register (post: /api/register)
  - [x] Sign in (post: /api/login)
  - [x] Resend email verification (get: /api/resend/email/verification)
- [x] User profile (get: /api/user/profile)
  - [x] Reset password(/api/reset/password)
  - [x] Reset user name(post: /api/user/profile)
- [x] logout (get: /api/logout)
- [x] User Database Dashboard (get: /api/statistics/data)
  - [x] Timestamp of user sign up.
  - [x] Number of times logged in.
  - [x] Timestamp of the last user session.
  - [x] User Statistics
    - [x] Total number of users who have signed up.
    - [x] Total number of users with active sessions today.
    - [x] Average number of active session users in the last 7 days rolling.
