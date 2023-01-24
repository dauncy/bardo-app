
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class NewUser {
    uid: string;
    phoneNumber: string;
    username?: Nullable<string>;
}

export class UpdateUsername {
    uid: string;
    username: string;
}

export class User {
    uid: string;
    username?: Nullable<string>;
    phoneNumber: string;
}

export abstract class IQuery {
    abstract getUser(uid: string): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract createUser(input: NewUser): User | Promise<User>;

    abstract updateUsername(input: UpdateUsername): Nullable<User> | Promise<Nullable<User>>;

    abstract deleteUser(uid: string): Nullable<User> | Promise<Nullable<User>>;
}

type Nullable<T> = T | null;
