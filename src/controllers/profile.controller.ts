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
import {verifyAuthorizationHeader} from "groupo-shared-service/services/authentication";

export const register = catcher(async (req: express.Request, res: express.Response) => {
    const {firstName, lastName, email, password} = req.body as RegisterRequest;

    await ProfileService.register(firstName, lastName, email, password);

    json(res, newAPIResponse<string>(StatusCodes.OK, ""));
});

export const getProfile = catcher(async (req: express.Request, res: express.Response) => {
    const {email} = verifyAuthorizationHeader(req);

    const response = await ProfileService.getProfile(email);

    json(res, newAPIResponse<ProfileResponse>(StatusCodes.OK, response));
});

export const updateProfile = catcher(async (req: express.Request, res: express.Response) => {
    const {email} = verifyAuthorizationHeader(req);

    const {firstName, lastName} = req.body as UpdateProfileRequest;

    await ProfileService.updateProfile(email, firstName, lastName);

    json(res, newAPIResponse<string>(StatusCodes.OK, ""));
});
