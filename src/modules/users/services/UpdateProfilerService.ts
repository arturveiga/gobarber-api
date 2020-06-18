import { injectable, inject } from 'tsyringe';

import User from '../infra/typeorm/entities/User';

import AppError from '../../../shared/erros/AppErros';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/hashProvider/models/IHashProvider';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequestDTO): Promise<User> {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found !');
    }

    const userWithUpdatedemail = await this.userRepository.findByEmail(email);

    if (userWithUpdatedemail && userWithUpdatedemail.id !== user_id) {
      throw new AppError('E-mail already in user.');
    }

    user.name = name;
    user.email = email;
    if (password && !old_password) {
      throw new AppError('You need to inform the old password');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password not match');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.userRepository.save(user);
  }
}

export default UpdateProfileService;
