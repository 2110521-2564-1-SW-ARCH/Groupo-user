import {UserCredentials} from "../models/user-credentials.model";
import {UserProfile} from "../models/user-profile.model";
import {ProfileResponse, RegisterRequest, UpdateProfileRequest} from "groupo-shared-service/apiutils/messages";
import {getConnection, Repository} from "typeorm";
import {ExpressRequestCtx} from "groupo-shared-service/types/express";

const userCredentialsRepository = (): Repository<UserCredentials> => {
    return getConnection().getRepository(UserCredentials);
};

const userProfileRepository = (): Repository<UserProfile> => {
    return getConnection().getRepository(UserProfile);
};

const getUserProfile = async (email: string): Promise<UserProfile> => {
    return await getConnection()
        .createQueryBuilder(UserProfile, "userProfile").where("userProfile.user_credentials_email=:email", {email}).getOne();
};

export const register = async (ctx: ExpressRequestCtx<RegisterRequest>) => {
    const credentials = new UserCredentials(ctx.body.email, ctx.body.password);
    await userCredentialsRepository().insert(credentials);
    const profile = new UserProfile(ctx.body.firstName, ctx.body.lastName, credentials);
    await userProfileRepository().insert(profile);
};

export const getProfile = async (ctx: ExpressRequestCtx<undefined>): Promise<ProfileResponse> => {
    const {firstName, lastName} = await getUserProfile(ctx.email);
    return {firstName, lastName, email: ctx.email};
};

export const updateProfile = async (ctx: ExpressRequestCtx<UpdateProfileRequest>) => {
    const profile = await getUserProfile(ctx.email);
    profile.firstName = ctx.body.firstName;
    profile.lastName = ctx.body.lastName;
    await userProfileRepository().save(profile);
};
