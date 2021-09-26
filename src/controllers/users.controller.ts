import express from "express";
import userService, {UserService} from "../services/user.service";
import {StatusCodes} from "http-status-codes";
import {UnauthorizedError} from "groupo-shared-service/apiutils/errors";
import {LoginRequest, RefreshRequest, RegisterRequest, APIResponse, LoginResponse, json} from "groupo-shared-service/apiutils/messages";

export class UserController {
    userService: UserService;

    constructor(u: UserService) {
        this.userService = u;
    }

    login: express.Handler = async (req: express.Request, res: express.Response) => {
        const {email, password} = req.body as LoginRequest;
        if (!email) {
            throw new UnauthorizedError();
        }

        const {accessToken, refreshToken} = await this.userService.authenticate(email, password);

        const response: APIResponse<LoginResponse> = {
            status: StatusCodes.OK,
            body: {accessToken, refreshToken},
        };
        json(res, response);
    }

    refreshToken: express.Handler = async (req: express.Request, res: express.Response) => {
        const {refreshToken: token} = req.body as RefreshRequest;
        if (!token) {
            throw new UnauthorizedError();
        }

        const {accessToken, refreshToken} = await this.userService.refreshToken(token);

        const response: APIResponse<LoginResponse> = {
            status: StatusCodes.OK,
            body: {accessToken, refreshToken},
        };
        json(res, response);
    }

    register: express.Handler = async (req: express.Request, res: express.Response) => {
        const {firstName, lastName, email, password} = req.body as RegisterRequest;

        await this.userService.register(firstName, lastName, email, password);

        const response: APIResponse<string> = {
            status: StatusCodes.CREATED,
            body: "",
        };
        json(res, response);
    }
}

const userController: UserController = new UserController(userService);
export default userController;