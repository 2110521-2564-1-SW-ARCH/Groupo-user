import {getReasonPhrase} from "http-status-codes";

export class APIError extends Error {
    code: number

    constructor(code: number) {
        super()
        this.code = code
        this.message = getReasonPhrase(code)
    }
}