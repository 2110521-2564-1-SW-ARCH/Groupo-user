import {catcher} from "groupo-shared-service/apiutils/errors";
import express from "express";
import {
    json,
    newAPIResponse,
    ProfileResponse,
    RegisterRequest,
    UpdateProfileRequest,
} from "groupo-shared-service/apiutils/messages";
import * as ProfileService from "../services/profile.service";
import {StatusCodes} from "http-status-codes";
import {getExpressRequestContext} from "groupo-shared-service/services/express";

export const register = catcher(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ctx = getExpressRequestContext<RegisterRequest>(req, false);

    await ProfileService.register(ctx);

    json(res, newAPIResponse<string>(StatusCodes.OK, ""));
    next();
});

export const getProfile = catcher(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ctx = getExpressRequestContext<undefined>(req);

    const response = await ProfileService.getProfile(ctx);

    json(res, newAPIResponse<ProfileResponse>(StatusCodes.OK, response));
    next();
});

export const updateProfile = catcher(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ctx = getExpressRequestContext<UpdateProfileRequest>(req);

    await ProfileService.updateProfile(ctx);

    json(res, newAPIResponse<string>(StatusCodes.OK, ""));
    next();
});
