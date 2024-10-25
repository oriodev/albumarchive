import { Injectable } from '@nestjs/common';

// change this to user schema later.
export type User = any;

@Injectable()
export class UsersService {
    // remove this later.
    private readonly users = [
        {
            userId: 1,
            username: 'cas',
            password: 'password'
        },
        {
            userId: 2,
            username: 'luca',
            password: 'password'
        }
    ]

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username)
    }

}
