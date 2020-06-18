import path from 'path';
import fs from 'fs';

import { injectable, inject } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import User from '../infra/typeorm/entities/User';
import uploadConfig from '../../../config/upload';
import AppError from '../../../shared/erros/AppErros';
import IUserRepository from '../repositories/IUserRepository';

interface IRequestDTO {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) { }

  public async execute({
    user_id,
    avatarFilename,
  }: IRequestDTO): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticaded users can change avatar ', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }
    const filename = await this.storageProvider.saveFile(avatarFilename);
    user.avatar = filename;

    await this.userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
