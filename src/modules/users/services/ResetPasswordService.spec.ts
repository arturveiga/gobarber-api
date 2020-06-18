import AppError from '@shared/erros/AppErros';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider';

let fakeUser: FakeUsersRepository;

let fakeUserTokenRespository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUser = new FakeUsersRepository();
    fakeUserTokenRespository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUser,
      fakeUserTokenRespository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUser.create({
      name: 'john Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const genertatedHash = jest.spyOn(fakeHashProvider, 'generateHash');
    const { token } = await fakeUserTokenRespository.generate(user.id);

    await resetPasswordService.execute({ password: '123123', token });

    const updateUser = await fakeUser.findById(user.id);

    expect(genertatedHash).toHaveBeenCalledWith('123123');
    expect(updateUser?.password).toBe('123123');
  });

  it('should not be able to reset a password of a token not existing', async () => {
    await expect(
      resetPasswordService.execute({
        password: '123123',
        token: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset a password of a user not existing', async () => {
    const { token } = await fakeUserTokenRespository.generate('not-existing');

    await expect(
      resetPasswordService.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUser.create({
      name: 'john Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const { token } = await fakeUserTokenRespository.generate(user.id);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: '123123',
      }),
    );
  });
});
