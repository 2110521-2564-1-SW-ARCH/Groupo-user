import * as jwt from "jsonwebtoken";
import {JwtPayload} from "jsonwebtoken";
import {APIError} from "../error";
import {StatusCodes} from "http-status-codes";

export class AccessTokenExpired extends APIError {
    constructor() {
        super(StatusCodes.UNAUTHORIZED);
        this.message = "Access Token Expired";
    }
}

export interface Payload extends JwtPayload {
    email: string;
}

export class JWTService {
    private secret: string = process.env.JWT_SECRET;

    generateAccessToken(token: Payload): string {
        return jwt.sign(token, this.secret, {expiresIn: "1h"});
    }

    generateRefreshToken(token: Payload): string {
        return jwt.sign(token, this.secret);
    }

    verify(token: string): Payload {
        try {
            const decoded = jwt.verify(token, this.secret);
            if (typeof decoded === "string") {
                return JSON.parse(decoded);
            }
            return decoded as Payload;
        } catch (e) {
            if (e.message === "jwt expired") {
                throw new AccessTokenExpired();
            }
            throw e;
        }
    }
}

const jwtService: JWTService = new JWTService();
export default jwtService;