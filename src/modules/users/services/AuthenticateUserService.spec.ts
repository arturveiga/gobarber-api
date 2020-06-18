import AppError from '@shared/erros/AppErros';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUser: FakeUsersRepository;
let fakeHasheProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUser = new FakeUsersRepository();
    fakeHasheProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(fakeUser, fakeHasheProvider);
  });

  it('should be able to Authenticate', async () => {
    const user = await fakeUser.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const reponse = await authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(reponse).toHaveProperty('token');
    expect(reponse.user).toEqual(user);
  });

  it('should not be able to Authenticate inexistente User', async () => {
    expect(
      authenticateUser.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to Authenticate with wrong password', async () => {
    await fakeUser.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(
      authenticateUser.execute({
        email: 'johndoe@example.com',
        password: 'not',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
