import {getReasonPhrase, StatusCodes} from "http-status-codes";
import express from "express";
import {BaseResponse, sendResponse} from "./controllers/responses/base.response";

export const asyncErrorHandling = (handler: express.Handler): express.Handler => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};

export class APIError extends Error {
    code: number;

    constructor(code: number) {
        super();
        this.code = code;
        this.message = getReasonPhrase(code);
    }

    response(): BaseResponse<string> {
        return {
            status: this.code,
            body: this.message,
        };
    }
}

export class InternalServerError extends APIError {
    constructor() {
        super(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export const errorHandler: express.ErrorRequestHandler = (err: any, req: express.Request, res: express.Response, next) => {
    switch (true) {
        case err instanceof APIError:
            const apiError = err as APIError;
            sendResponse(res, apiError.response());
            break;
        default:
            console.log("internal server error:", err.message);
            const internalError = new InternalServerError();
            sendResponse(res, internalError.response());
    }
}