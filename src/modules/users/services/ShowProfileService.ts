import AppError from '@shared/erros/AppErros';
import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface IRequestDto {
  user_id: string;
}
@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,
  ) { }

  public async exec({ user_id }: IRequestDto): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    return user;
  }
}

export default ShowProfileService;
