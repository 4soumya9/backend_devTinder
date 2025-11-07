#DevTinder APIs

authRouter
-POST/signup
-POST/login
-POST/logout

profile
-GET/profile/view
-PATCH/profile/edit
-PATCH/profile/password // forgot password API

connectionRequestRouter
-POST/request/send/interested/:userId
-POST/request/send/ignored/:userId
-POST/request/review/accepted/:requestId
-POST/request/review/rejected/:requestId

userRouter
-GET/user/connections
-GET/requests/received
-GET/feed - Gets you the profiles of other users on platform

Status: ignore,interested,accepeted,rejected
