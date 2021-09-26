import express from "express";
import {StatusCodes} from "http-status-codes";
import {catcher, UnauthorizedError} from "groupo-shared-service/apiutils/errors";
import * as UserService from "../services/auth.service";
import {
    json,
    LoginRequest,
    LoginResponse,
    newAPIResponse,
    RefreshRequest,
} from "groupo-shared-service/apiutils/messages";

export const login: express.Handler = catcher(async (req: express.Request, res: express.Response) => {
    const {email, password} = req.body as LoginRequest;
    if (!email) {
        throw new UnauthorizedError();
    }

    const response = await UserService.authenticate(email, password);

    json(res, newAPIResponse<LoginResponse>(StatusCodes.OK, response));
});

export const refreshAccessToken: express.Handler = catcher(async (req: express.Request, res: express.Response) => {
    const {refreshToken: token} = req.body as RefreshRequest;
    if (!token) {
        throw new UnauthorizedError();
    }

    const response = await UserService.refreshAccessToken(token);

    json(res, newAPIResponse<LoginResponse>(StatusCodes.OK, response));
});
