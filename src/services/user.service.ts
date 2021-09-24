import jwtService, {JWTService} from "./jwt.service";
import {Repository} from "typeorm";
import {AuthenticationError, UserCredentials} from "../models/user-credentials.model";
import {getConnection} from "../datasource/mysql";

export class UserService {
    private jwtService: JWTService;
    private userCredentialsRepository: Repository<UserCredentials>;

    constructor(j: JWTService) {
        this.jwtService = j;
        getConnection().then(connection => {
            this.userCredentialsRepository = connection.getRepository(UserCredentials);
        });
    }

    async findCredentials(email: string): Promise<UserCredentials> {
        return await this.userCredentialsRepository.findOneOrFail({where: [{email}]});
    }

    async authenticate(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }>{
        const userCredentials = await this.findCredentials(email);
        userCredentials.authenticate(password);

        userCredentials.refreshToken = this.jwtService.generateRefreshToken({email});
        await this.userCredentialsRepository.save(userCredentials);

        return {
            accessToken: this.jwtService.generateAccessToken({email}),
            refreshToken: userCredentials.refreshToken,
        };
    }

    async refreshToken(token: string): Promise<{ accessToken: string, refreshToken: string }> {
        const payload = this.jwtService.verify(token);
        const userCredentials = await this.findCredentials(payload.email);
        if (userCredentials.refreshToken !== token) {
            throw new AuthenticationError();
        }

        userCredentials.refreshToken = this.jwtService.generateRefreshToken({email: payload.email});
        await this.userCredentialsRepository.save(userCredentials);

        return {
            accessToken: this.jwtService.generateAccessToken({email: payload.email}),
            refreshToken: userCredentials.refreshToken,
        };
    }
}

const userService: UserService = new UserService(jwtService);
export default userService;