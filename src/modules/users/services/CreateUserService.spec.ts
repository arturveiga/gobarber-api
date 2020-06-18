import AppError from '@shared/erros/AppErros';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserServices from './CreateUserService';
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider';

let fakeUser: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserServices;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUser = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUserService = new CreateUserServices(
      fakeUser,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new User', async () => {
    const user = await createUserService.exec({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with same email', async () => {
    await createUserService.exec({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      createUserService.exec({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
