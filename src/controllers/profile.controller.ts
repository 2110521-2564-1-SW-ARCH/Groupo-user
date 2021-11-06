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
    const {firstName, lastName, email, password} = req.body as RegisterRequest;

    await ProfileService.register(firstName, lastName, email, password);

    json(res, newAPIResponse<string>(StatusCodes.OK, ""));
    next();
});

export const getProfile = catcher(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ctx = getExpressRequestContext(req);

    const response = await ProfileService.getProfile(ctx);

    json(res, newAPIResponse<ProfileResponse>(StatusCodes.OK, response));
    next();
});

export const updateProfile = catcher(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ctx = getExpressRequestContext(req);

    const {firstName, lastName} = req.body as UpdateProfileRequest;

    await ProfileService.updateProfile(ctx, firstName, lastName);

    json(res, newAPIResponse<string>(StatusCodes.OK, ""));
    next();
});
