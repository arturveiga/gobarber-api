import AppError from '@shared/erros/AppErros';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUser: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('Update Profile', () => {
  beforeEach(() => {
    fakeUser = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUser);
  });

  it('should be able to show profile', async () => {
    const user = await fakeUser.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const profile = await showProfileService.exec({ user_id: user.id });

    expect(profile.email).toBe('johndoe@example.com');
  });

  it('should be able to show profile that not exist', async () => {
    await expect(
      showProfileService.exec({ user_id: 'not_exist' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
