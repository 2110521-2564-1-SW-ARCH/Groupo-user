import * as bcrypt from "bcrypt";
import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {APIError} from "../error";
import {StatusCodes} from 'http-status-codes';

export class AuthenticationError extends APIError {
    constructor() {
        super(StatusCodes.UNAUTHORIZED);
    }
}

@Entity("user_credentials")
export class UserCredentials {
    @PrimaryColumn({length: 255, name: "email"}) email: string;
    @Column({length: 255, name: "password"}) password: string;
    @Column({length: 255, name: "refresh_token"}) refreshToken: string = "";

    constructor(email: string, password: string) {
        this.email = email;
        if (!!password) {
            this.password = bcrypt.hashSync(password, 10);
        }
    }

    authenticate(password: string) {
        if (this.password === "") {
            throw new AuthenticationError();
        }
        if (!bcrypt.compareSync(password, this.password)) {
            throw new AuthenticationError();
        }
    }
}

