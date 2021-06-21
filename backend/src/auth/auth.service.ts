import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as ClientOAuth2 from 'client-oauth2';
import * as needle from 'needle';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import {Response, Request} from 'express';

const intra42auth = new ClientOAuth2({
  clientId: process.env.API_ID,
	clientSecret: process.env.API_SECRET,
	accessTokenUri: 'https://api.intra.42.fr/oauth/token',
	authorizationUri: 'https://api.intra.42.fr/oauth/authorize',
	redirectUri: `http://localhost:3000/auth/callback`,
	scopes: ['public']
})

@Injectable()
export class AuthService {
  constructor( private jwtService: JwtService ){}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
   return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  login() {
    const url = intra42auth.code.getUri()
    return url;
  }
  
  public async callback(code: string, res: Response) {
    let url = `http://localhost:3000/auth/callback?code=${code}`
    try {
      let user_connected = await intra42auth.code.getToken(url);
      let response = await user_connected.sign({
        method: 'get',
        url: 'https://api.intra.42.fr/v2/me',
        headers: {}
      })
      const req = await needle('get', response.url, {}, { headers: response.headers });
      let user = await User.findOne({ login: req.body.login});
      if (!user){
        const usrDto1 = new CreateUserDto();
        usrDto1.login = req.body.login;
        usrDto1.nickname = "Nick_" + req.body.login;
        usrDto1.wins = 0;
        usrDto1.looses = 0;
        usrDto1.current_status = "none";
        await User.create(usrDto1).save();
      }
      const payload = {
        login: req.body.login,
      };
      const jwt = await this.jwtService.sign(payload);
      return {
        "access_token" : jwt
      };
		} catch (error) {
      console.log("Error: " + error);
      res.redirect("/");
    }
  }
}