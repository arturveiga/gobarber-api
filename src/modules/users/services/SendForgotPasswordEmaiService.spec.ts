import AppError from '@shared/erros/AppErros';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';

let fakeUser: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRespository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUser = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRespository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUser,
      fakeMailProvider,
      fakeUserTokenRespository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeUser.create({
      name: 'john Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com',
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to generate token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRespository, 'generate');

    const user = await fakeUser.create({
      name: 'john Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
