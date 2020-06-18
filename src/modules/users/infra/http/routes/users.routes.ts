import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import { Segments, Joi, celebrate } from 'celebrate';
import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAutheticated from '../middleware/ensureAuthenticated';

const usersRouter = Router();

const upload = multer(uploadConfig);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/avatar',
  ensureAutheticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
