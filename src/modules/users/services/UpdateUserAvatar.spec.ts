import AppError from '@shared/erros/AppErros';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateAvatarService from './UpdateUserAvatarService';

let fakeUser: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateAvatarService: UpdateAvatarService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUser = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateAvatarService = new UpdateAvatarService(
      fakeUser,
      fakeStorageProvider,
    );
  });

  it('should be able to create a new User', async () => {
    const user = await fakeUser.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update a avatar from non existing user', async () => {
    await expect(
      updateAvatarService.execute({
        user_id: 'nouser',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should deleteold avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUser.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toBeCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
