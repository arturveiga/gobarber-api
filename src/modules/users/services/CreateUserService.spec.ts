import AppError from '@shared/errors/AppError';

import FakeRedisCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeRedisCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeRedisCacheProvider: FakeRedisCacheProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeRedisCacheProvider = new FakeRedisCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeRedisCacheProvider,
    );
  });

  it('should be able to create a new User', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'jhondoe@email.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should be able to create a new User with same email from another', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'jhondoe@email.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'jhondoe@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
