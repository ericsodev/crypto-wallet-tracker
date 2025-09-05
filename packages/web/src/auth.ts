import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { db } from '../../common/src/database/database-connection';
import { UserRepository } from '../../common/src/database/repositories/user-repository';

const userRepository = new UserRepository(db);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  jwt: {},
  session: {
    strategy: 'jwt',
  },
  adapter: {
    async createUser(user) {
      userRepository.create({ id: user.id, name: user.name ?? 'Crypto Holder', email: user.email });
      return user;
    },
    async linkAccount(account) {
      console.log('account', account);
      await userRepository.linkAccount({
        provider: account.provider,
        providerId: account.providerAccountId,
        userId: account.userId,
      });
      return account;
    },
    async getAccount(providerAccountId, provider) {
      const user = await userRepository.getByProvider(provider, providerAccountId);
      if (!user) return null;
      return { provider, providerAccountId, type: 'oauth', userId: user.id };
    },
    async getUser(id) {
      const user = await userRepository.get(id);
      if (!user) return null;
      return { ...user, emailVerified: null };
    },

    async getUserByEmail(email) {
      const user = await userRepository.getByEmail(email);
      if (!user) return null;
      return { ...user, emailVerified: null };
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const user = await userRepository.getByProvider(provider, providerAccountId);
      if (!user) return null;
      return { ...user, emailVerified: null };
    },

    async updateUser(user) {
      const updatedUser = await userRepository.update(user.id, { email: user.email, name: user.name ?? undefined });
      if (!updatedUser) throw new Error('User not found');
      return { ...updatedUser, emailVerified: null };
    },
  },
});
