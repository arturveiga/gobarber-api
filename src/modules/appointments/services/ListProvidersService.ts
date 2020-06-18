import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequestDto {
  user_id: string;
}
@injectable()
class ListProviderService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async execute({ user_id }: IRequestDto): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `provider-list:${user_id}`,
    );
    if (!users) {
      users = await this.userRepository.findAllProviers({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(`provider-list:${user_id}`, users);
    }

    return users;
  }
}

export default ListProviderService;
