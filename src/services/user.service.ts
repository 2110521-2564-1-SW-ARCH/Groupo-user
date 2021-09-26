import {generateRefreshToken, generateAccessToken, verifyToken} from "groupo-shared-service/services/authentication";
import {getConnection, Repository} from "typeorm";
import {UserCredentials} from "../models/user-credentials.model";
import {UserProfile} from "../models/user-profile.model";
import {UnauthorizedError} from "groupo-shared-service/apiutils/errors";
import {LoginResponse} from "groupo-shared-service/apiutils/messages";

const userCredentialsRepository = (): Repository<UserCredentials> => {
    return getConnection().getRepository(UserCredentials);
};

const userProfileRepository = (): Repository<UserProfile> => {
    return getConnection().getRepository(UserProfile);
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

export const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const credentials = new UserCredentials(email, password);
    await userCredentialsRepository().insert(credentials);
    const profile = new UserProfile(firstName, lastName, credentials);
    await userProfileRepository().insert(profile);
};
