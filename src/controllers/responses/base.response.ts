import express from "express";

export interface BaseResponse<T> {
    status: number;
    body: T;
}

export const sendResponse = <T>(res: express.Response, response: BaseResponse<T>) => {
    res.status(response.status).json(response);
}