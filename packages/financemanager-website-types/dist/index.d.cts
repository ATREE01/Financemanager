interface Register {
    username: string;
    email: string;
    password: string;
}

interface User {
    id: string;
    profile: {
        email: string;
        username: string;
    };
}

interface CreateUser {
    username: string;
    email: string;
    hashedPassword: string;
}

export type { CreateUser, Register, User };
