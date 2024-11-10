import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { google } from 'googleapis';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/user.birthday.read',
      ],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const people = google.people({
      version: 'v1',
      auth: oauth2Client,
    });

    const { data } = await people.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos,birthdays,biographies',
    });

    const birthday = data.birthdays?.[0]?.date;

    const user = this.authService.validateUser({
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      avatar: profile.photos[0].value,
      accessToken,
      birthdate: birthday,
    });

    return user || null;
  }
}
