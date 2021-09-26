import {generateAccessToken, generateRefreshToken, verifyToken} from "groupo-shared-service/services/authentication";
import {getConnection, Repository} from "typeorm";
import {UserCredentials} from "../models/user-credentials.model";
import {UnauthorizedError} from "groupo-shared-service/apiutils/errors";
import {LoginResponse} from "groupo-shared-service/apiutils/messages";

const userCredentialsRepository = (): Repository<UserCredentials> => {
    return getConnection().getRepository(UserCredentials);
};

const findCredentials = async (email: string): Promise<UserCredentials> => {
    return await userCredentialsRepository().findOneOrFail({where: [{email}]});
};

export const authenticate = async (email: string, password: string): Promise<LoginResponse> => {
    const userCredentials = await findCredentials(email);
    userCredentials.authenticate(password);

    userCredentials.refreshToken = generateRefreshToken(email);
    await userCredentialsRepository().save(userCredentials);

    return {
        accessToken: generateAccessToken(email),
        refreshToken: userCredentials.refreshToken,
    };
};

export const refreshAccessToken = async (token: string): Promise<LoginResponse> => {
    const payload = verifyToken(token);
    const userCredentials = await findCredentials(payload.email);
    if (userCredentials.refreshToken !== token) {
        throw new UnauthorizedError();
    }

    userCredentials.refreshToken = generateRefreshToken(payload.email);
    await userCredentialsRepository().save(userCredentials);

    return {
        accessToken: generateAccessToken(payload.email),
        refreshToken: userCredentials.refreshToken,
    };
};
