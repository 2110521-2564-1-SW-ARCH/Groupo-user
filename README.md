## User Service

<hr>

### API Interface

all interfaces are in `common-shared-service`.

##### Open Interface

- `POST /auth/login (LoginRequest => LoginResponse)`, get access token and refresh token


- `POST /auth/refresh (RefreshRequest => LoginResponse)`, to refresh access token with refresh token



- `POST /profile (RegisterRequest => EMPTY)`, to register a new user


##### Auth Required Interface

to use these interface, `Authorization` Header must be provided with `Bearer` token

- `GET /profile (EMPTY => ProfileResponse)`, to get user profile

- `PATCH /profile (UpdateProfileRequest => EMPTY)`, to get user profile
