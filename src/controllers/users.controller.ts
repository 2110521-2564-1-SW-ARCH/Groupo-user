import express from "express";
import {StatusCodes} from "http-status-codes";
import {catcher, UnauthorizedError} from "groupo-shared-service/apiutils/errors";
import * as UserService from "../services/user.service";
import {
    APIResponse,
    json,
    LoginRequest,
    LoginResponse,
    RefreshRequest,
    RegisterRequest
} from "groupo-shared-service/apiutils/messages";

export const login: express.Handler = catcher(async (req: express.Request, res: express.Response) => {
    const {email, password} = req.body as LoginRequest;
    if (!email) {
        throw new UnauthorizedError();
    }

    const {accessToken, refreshToken} = await UserService.authenticate(email, password);

    const response: APIResponse<LoginResponse> = {
        status: StatusCodes.OK,
        body: {accessToken, refreshToken},
    };
    json(res, response);
});

export const refreshAccessToken: express.Handler = catcher(async (req: express.Request, res: express.Response) => {
    const {refreshToken: token} = req.body as RefreshRequest;
    if (!token) {
        throw new UnauthorizedError();
    }

    const {accessToken, refreshToken} = await UserService.refreshAccessToken(token);

    const response: APIResponse<LoginResponse> = {
        status: StatusCodes.OK,
        body: {accessToken, refreshToken},
    };
    json(res, response);
});

export const register = catcher(async (req: express.Request, res: express.Response) => {
    const {firstName, lastName, email, password} = req.body as RegisterRequest;

    await UserService.register(firstName, lastName, email, password);

    const response: APIResponse<string> = {
        status: StatusCodes.CREATED,
        body: "",
    };
    json(res, response);
});
