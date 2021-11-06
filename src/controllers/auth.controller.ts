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
import {getExpressRequestContext} from "groupo-shared-service/services/express";

export const login: express.Handler = catcher(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ctx = getExpressRequestContext<LoginRequest>(req);
    if (!ctx.body.email) {
        throw new UnauthorizedError();
    }

    const response = await UserService.authenticate(ctx);

    json(res, newAPIResponse<LoginResponse>(StatusCodes.OK, response));
    next();
});

export const refreshAccessToken: express.Handler = catcher(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ctx = getExpressRequestContext<RefreshRequest>(req);

    if (!ctx.body.refreshToken) {
        throw new UnauthorizedError();
    }

    const response = await UserService.refreshAccessToken(ctx.body.refreshToken);

    json(res, newAPIResponse<LoginResponse>(StatusCodes.OK, response));
    next();
});
