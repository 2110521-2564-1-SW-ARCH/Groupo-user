## User Service

<hr>

### Environment Variable

mysql configuration

- `MYSQL_HOST`, to select mysql host.
- `MYSQL_USER`, to select mysql user.
- `MYSQL_PASSWORD`, to authenticate mysql connection.
- `MYSQL_DB`, to select default database when initiate connection.

jwt configuration
- `JWT_SECRET`, to verify JWT access token and refresh token.

gRPC configuration
- `GRPC_SERVER_HOST`, to select gRPC server host.
- `GRPC_SERVER_PORT`, to select gRPC server port.

<hr>

### API Interface

open endpoint (authentication is not required)

- `POST /auth/login (LoginRequest => LoginResponse)`, to get access token and refresh token.


- `POST /auth/refresh (RefreshRequest => LoginResponse)`, to refresh access token with refresh token.


- `POST /profile (RegisterRequest => EMPTY)`, to register a new user.


authentication required endpoint, `Authorization` header must be provided with `Bearer` token.

- `GET /profile (EMPTY => ProfileResponse)`, to get user profile.


- `PATCH /profile (UpdateProfileRequest => EMPTY)`, to update user profile.
