import * as bcrypt from "bcrypt";
import {Column, Entity, PrimaryColumn} from "typeorm";
import {UnauthorizedError} from "groupo-shared-service/apiutils/errors";

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
            throw new UnauthorizedError();
        }
        if (!bcrypt.compareSync(password, this.password)) {
            throw new UnauthorizedError();
        }
    }
}

