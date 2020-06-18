import { container } from 'tsyringe';

import IHashProvider from './hashProvider/models/IHashProvider';
import BCrypt from './hashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCrypt);
