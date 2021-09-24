import {LoginRequest} from "./requests/login.request";
import express from "express";
import {AuthenticationError, UserCredentials} from "../models/user-credentials.model";
import {LoginResponse} from "./responses/login.response";
import userService, {UserService} from "../services/user.service";
import {RefreshRequest} from "./requests/refresh.request";

export class UserController {
    userService: UserService;

    constructor(u: UserService) {
        this.userService = u;
    }

    login: express.Handler = async (req: express.Request, res: express.Response) => {
        const {email, password} = req.body() as LoginRequest;
        if (!email) {
            throw new AuthenticationError();
        }

        const {accessToken, refreshToken} = await this.userService.authenticate(email, password);

        const response: LoginResponse = {accessToken, refreshToken};
        res.json(response);
    }

    refreshToken: express.Handler = async (req: express.Request, res: express.Response) => {
        const {refreshToken: token} = req.body() as RefreshRequest;
        if (!token) {
            throw new AuthenticationError();
        }

        const {accessToken, refreshToken} = await this.userService.refreshToken(token);

        const response: LoginResponse = {accessToken, refreshToken};
        res.json(response);
    }
}

const userController: UserController = new UserController(userService);
export default userController;