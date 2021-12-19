export interface NewUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    age: number;
}

export interface NewUserRes {
    userId: number;
}