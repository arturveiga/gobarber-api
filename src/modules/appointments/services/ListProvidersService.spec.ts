import AppError from '@shared/erros/AppErros';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderService from './ListProvidersService';

let fakeUser: FakeUsersRepository;
let listProviderService: ListProviderService;
let fakeCacheProvider: FakeCacheProvider;

describe('list Providers', () => {
  beforeEach(() => {
    fakeUser = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderService = new ListProviderService(fakeUser, fakeCacheProvider);
  });

  it('should be able to list providers', async () => {
    const user1 = await fakeUser.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user2 = await fakeUser.create({
      name: 'John Tre',
      email: 'johnTre@example.com',
      password: '123456',
    });

    const loggedUser = await fakeUser.create({
      name: 'Vitor',
      email: 'vitor@example.com',
      password: '123456',
    });

    const users = await listProviderService.execute({ user_id: loggedUser.id });

    expect(users).toEqual([user1, user2]);
  });
});
