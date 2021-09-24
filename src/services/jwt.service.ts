import * as jwt from "jsonwebtoken";
import {JwtPayload} from "jsonwebtoken";

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
        const decoded = jwt.verify(token, this.secret);
        if (typeof decoded === "string") {
            return JSON.parse(decoded);
        }
        return decoded as Payload;
    }
}

const jwtService: JWTService = new JWTService();
export default jwtService;