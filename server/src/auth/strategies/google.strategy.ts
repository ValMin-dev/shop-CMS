import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config/dist/config.service'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(private configService: ConfigService) {
		super({
			clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
			clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
			callbackURL:
				configService.get<string>('SERVER_URL') + '/auth/google/callback',
			scope: ['email', 'profile']
		})
	}

	async validate(
		_accessToken: string,
		_refreshToken: string,
		profile: Profile,
		done: VerifyCallback
	) {
		const { name, emails, photos } = profile
		const user = {
			email: emails[0].value,
			firstName: name?.givenName,
			lastName: name?.familyName,
			picture: photos[0].value,
			accessToken: _accessToken
		}
		done(null, user)
	}
}
