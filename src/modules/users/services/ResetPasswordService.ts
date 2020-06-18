import AppError from '@shared/erros/AppErros';
import { injectable, inject } from 'tsyringe';
import { addHours, isAfter } from 'date-fns';

import IUserRepository from '../repositories/IUserRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/hashProvider/models/IHashProvider';

interface IRequestDto {
  token: string;
  password: string;
}
@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('UserTokensRepository')
    private userTokensReposirory: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({ token, password }: IRequestDto): Promise<void> {
    const userToken = await this.userTokensReposirory.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists');
    }

    const user = await this.userRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) throw new AppError('Token expired');

    user.password = await this.hashProvider.generateHash(password);
    await this.userRepository.save(user);
  }
}

export default ResetPasswordService;
