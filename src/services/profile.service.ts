import {UserCredentials} from "../models/user-credentials.model";
import {UserProfile} from "../models/user-profile.model";
import {ProfileResponse} from "groupo-shared-service/apiutils/messages";
import {getConnection, Repository} from "typeorm";

const userCredentialsRepository = (): Repository<UserCredentials> => {
    return getConnection().getRepository(UserCredentials);
};

const userProfileRepository = (): Repository<UserProfile> => {
    return getConnection().getRepository(UserProfile);
};

const getUserProfile = async (email: string): Promise<UserProfile> => {
    return await getConnection()
        .createQueryBuilder(UserProfile, "userProfile").where("userProfile.user_credentials_email=:email", {email}).getOne();
}

export const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const credentials = new UserCredentials(email, password);
    await userCredentialsRepository().insert(credentials);
    const profile = new UserProfile(firstName, lastName, credentials);
    await userProfileRepository().insert(profile);
};

export const getProfile = async (email: string): Promise<ProfileResponse> => {
    const {firstName, lastName} = await getUserProfile(email);
    return {firstName, lastName, email};
};

export const updateProfile = async (email: string, firstName: string, lastName: string) => {
    const profile = await getUserProfile(email);
    profile.firstName = firstName;
    profile.lastName = lastName;
    await userProfileRepository().save(profile);
};
