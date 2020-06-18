import AppError from '@shared/erros/AppErros';
import FakeHashProvider from '../providers/hashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfilerService';

let fakeUser: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('Update Profile', () => {
  beforeEach(() => {
    fakeUser = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(fakeUser, fakeHashProvider);
  });

  it('should be able to update to Profile', async () => {
    const user = await fakeUser.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'john Trê',
      email: 'johntre@example.com',
    });

    expect(updateUser.name).toBe('john Trê');
    expect(updateUser.email).toBe('johntre@example.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUser.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const user = await fakeUser.create({
      name: 'test',
      email: 'test@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUser.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updateUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'john Trê',
      email: 'johntre@example.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updateUser.password).toBe('123123');
  });

  it('should not be able to update profile that not exist', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'not-exist',
        name: 'john Trê',
        email: 'johntre@example.com',
        password: '123123',
        old_password: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUser.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'john Trê',
        email: 'johndoe@example.com',
        password: '123123',
        old_password: 'wrong-old-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password  with not old password', async () => {
    const user = await fakeUser.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'john Trê',
        email: 'johndoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
