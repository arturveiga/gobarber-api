import { Router } from 'express';

import { Segments, Joi, celebrate } from 'celebrate';
import ProfileController from '../controllers/ProfileController';
import ensureAutheticated from '../middleware/ensureAuthenticated';

const profileRouter = Router();
profileRouter.use(ensureAutheticated);

const profileController = new ProfileController();
profileRouter.get('/', profileController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);

export default profileRouter;
