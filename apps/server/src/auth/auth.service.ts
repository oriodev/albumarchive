import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService 
  ) {}  

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { username, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
          const user = await this.userModel.create({
            username,
            email,
            password: hashedPassword
          })
      
          const token = this.jwtService.sign({ id: user._id })
      
          return { token };
       
    } catch (error) {

      if (error.code === 11000) {
        const duplicateField = 
          error.errmsg.match(/dup key: { email: "(.*)" }/) || 
          error.errmsg.match(/dup key: { username: "(.*)" }/);

        const fieldname = duplicateField[0].includes('email') ? 'email' : 'username'

        if (fieldname === 'email') {
          throw new ConflictException('this email already exists')
        }

        if (fieldname === 'username') {
          throw new ConflictException('this username already exists')
        }
      }
      
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    
    const user = await this.userModel.findOne({ email })

    if (!user) {
      throw new UnauthorizedException('invalid email')
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (!isPasswordMatched) {
      throw new UnauthorizedException('invalid password')
    }

    const token = this.jwtService.sign({ id: user._id })

    return { token };
     
  }

}
