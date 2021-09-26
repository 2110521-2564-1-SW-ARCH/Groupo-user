import {generateRefreshToken, generateAccessToken, verifyToken} from "groupo-shared-service/services/authentication";
import {Repository} from "typeorm";
import {UserCredentials} from "../models/user-credentials.model";
import {getConnection} from "../datasource/mysql";
import {UserProfile} from "../models/user-profile.model";
import {UnauthorizedError} from "groupo-shared-service/apiutils/errors";

export class UserService {
    private userCredentialsRepository: Repository<UserCredentials>;
    private userProfileRepository: Repository<UserProfile>;

    constructor() {
        getConnection().then(connection => {
            this.userCredentialsRepository = connection.getRepository(UserCredentials);
            this.userProfileRepository = connection.getRepository(UserProfile);
        });
    }

    async findCredentials(email: string): Promise<UserCredentials> {
        return await this.userCredentialsRepository.findOneOrFail({where: [{email}]});
    }

    async authenticate(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }>{
        const userCredentials = await this.findCredentials(email);
        userCredentials.authenticate(password);

        userCredentials.refreshToken = generateRefreshToken(email);
        await this.userCredentialsRepository.save(userCredentials);

        return {
            accessToken: generateAccessToken(email),
            refreshToken: userCredentials.refreshToken,
        };
    }

    async refreshToken(token: string): Promise<{ accessToken: string, refreshToken: string }> {
        const payload = verifyToken(token);
        const userCredentials = await this.findCredentials(payload.email);
        if (userCredentials.refreshToken !== token) {
            throw new UnauthorizedError();
        }

        userCredentials.refreshToken = generateRefreshToken(payload.email);
        await this.userCredentialsRepository.save(userCredentials);

        return {
            accessToken: generateAccessToken(payload.email),
            refreshToken: userCredentials.refreshToken,
        };
    }

    async register(firstName: string, lastName: string, email: string, password: string) {
        const credentials = new UserCredentials(email, password);
        await this.userCredentialsRepository.insert(credentials);
        const profile = new UserProfile(firstName, lastName, credentials);
        await this.userProfileRepository.insert(profile);
    }
}

const userService: UserService = new UserService();
export default userService;