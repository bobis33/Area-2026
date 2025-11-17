import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/database/prisma.service';
import { OAuthProfile, OAuthUser } from './dto/oauth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Valide et crée/récupère un utilisateur via OAuth
   * Si l'utilisateur existe (par email ou provider+providerId) → connexion
   * Sinon → création de compte
   */
  async validateOAuthLogin(profile: OAuthProfile): Promise<OAuthUser> {
    // 1. Extraire les informations du profil OAuth
    const email = this.extractEmail(profile);
    const name = this.extractName(profile);
    const providerId = profile.id;
    const provider = profile.provider;

    if (!email) {
      throw new Error('Email not provided by OAuth provider');
    }

    // 2. Chercher l'utilisateur par provider + providerId
    let user = await this.prisma.user.findFirst({
      where: {
        provider,
        providerId,
      },
    });

    // 3. Si non trouvé, chercher par email
    if (!user) {
      user = await this.prisma.user.findUnique({
        where: { email },
      });

      // 4. Si trouvé par email, lier le compte OAuth
      if (user) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            provider,
            providerId,
            name: name || user.name,
          },
        });
      }
    }

    // 5. Si toujours pas trouvé, créer un nouveau compte
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          provider,
          providerId,
          role: 'user',
          // Pas de mot de passe pour OAuth
          password: undefined,
        },
      });
    }

    return {
      email: user.email,
      name: user.name || undefined,
      provider: user.provider || undefined,
      providerId: user.providerId || undefined,
    };
  }

  /**
   * Extrait l'email du profil OAuth
   */
  private extractEmail(profile: OAuthProfile): string | null {
    if (profile.email) {
      return profile.email;
    }

    if (profile.emails && profile.emails.length > 0) {
      // Prioriser les emails vérifiés
      const verifiedEmail = profile.emails.find((e) => e.verified);
      if (verifiedEmail) {
        return verifiedEmail.value;
      }
      // Sinon prendre le premier
      return profile.emails[0].value;
    }

    return null;
  }

  /**
   * Extrait le nom du profil OAuth
   */
  private extractName(profile: OAuthProfile): string | null {
    if (profile.displayName) {
      return profile.displayName;
    }

    if (profile.name) {
      const parts = [];
      if (profile.name.givenName) parts.push(profile.name.givenName);
      if (profile.name.familyName) parts.push(profile.name.familyName);
      if (parts.length > 0) {
        return parts.join(' ');
      }
    }

    if (profile.username) {
      return profile.username;
    }

    return null;
  }

  /**
   * Trouve un utilisateur par ID
   */
  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        created_at: true,
      },
    });
  }

  /**
   * Trouve un utilisateur par email
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        created_at: true,
      },
    });
  }
}
