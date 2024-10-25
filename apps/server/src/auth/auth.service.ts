import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService  
  ) {}  

  async validateUser({username, password}: AuthPayloadDto): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === password) {
      const { password, ...userDetails } = user;
      return this.jwtService.sign(userDetails);
    }

    return null;
  }
}
