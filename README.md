# my-sample app

  

## Dashboard Features

  

-  [x] Sign up with eamil and password:

	-  [x] Form validation(email/password)

	-  [x] Register (/user/register)

	-  [x] Sign in (/user/login)

	-  [x] Email Verification

-  [x] Oauth2:

	- [x] Sign up/sign in with google(/auth/google)

	-  [x] Sign up/sign in with facebook(/auth/facebook)

-  [x] User profile

	-  [x] Reset password

	-  [x] Reset user name

	-  [x] logout (/user/logout)

-  [x] User Database Dashboard

	-  [x] Timestamp of user sign up.

	-  [x] Number of times logged in.

	-  [x] Timestamp of the last user session.

-  [x] User Statistics

	-  [x] Total number of users who have signed up.

	-  [x] Total number of users with active sessions today.

	-  [x] Average number of active session users in the last 7 days rolling.

  

## API Features

- [x] Sign up with eamil and password:

	-  [x] Register (post: /api/register)

	-  [x] Sign in (post: /api/login)

	-  [x] Resend email verification (get: /api/resend/email/verification)

-  [x] User profile (get: /api/user/profile)

	-  [x] Reset password(/api/reset/password)

	-  [x] Reset user name(post: /api/user/profile)

-  [x] logout (get: /api/logout)

-  [x] User Database Dashboard (get: /api/statistics/data)

	-  [x] Timestamp of user sign up.

	-  [x] Number of times logged in.

	-  [x] Timestamp of the last user session.

	-  [x] User Statistics

	-  [x] Total number of users who have signed up.

	-  [x] Total number of users with active sessions today.

	-  [x] Average number of active session users in the last 7 days rolling.

 
 ### Quick Start :
 >  - You must refer to .example.env to create .env
 >  - Get Oauth2 ClienID & SecretID from google/facebook
 >  - You can use mkcert to create SSL([https://github.com/FiloSottile/mkcert/blob/master/README.md#supported-root-stores])
 #### docker-compose
```bash
# clone the repo
git clone https://github.com/timLin0921/my-sample-app.git

# change directory to our repo
cd my-sample-app

# docker-compose 
docker-compose up -d

```
> go to [https://0.0.0.0:3000](https://0.0.0.0:3000) or [https://localhost:3000](https://localhost:3000) in your browser

#### Docker
> If you want to run web app only.
```bash
cd my-sample-app
docker build -t my-sample-app .
docker run -it -d -p 3000:3000 --name my-sample-app my-sample-app
```
### Swagger Doc Url : 
 > https://localhost:3000/swagger