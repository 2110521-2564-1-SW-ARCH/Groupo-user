import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserCredentials} from "./user-credentials.model";

@Entity("user_profile")
export class UserProfile {
    @PrimaryGeneratedColumn("uuid", {name: "profile_id"})
    profileID: string;

    @Column({length: 255, name: "display_name"}) displayName: string;
    @Column({length: 255, name: "first_name"}) firstName: string;
    @Column({length: 255, name: "last_name"}) lastName: string;

    @OneToOne(() => UserCredentials)
    @JoinColumn({name: "user_credentials_email"})
    userCredentials: UserCredentials;

    constructor(displayName: string, firstName: string, lastName: string, credentials: UserCredentials) {
        this.displayName = displayName ? displayName : firstName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userCredentials = credentials;
    }
}
