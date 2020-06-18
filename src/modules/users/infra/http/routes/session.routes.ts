import { Router } from 'express';
import { Segments, Joi, celebrate } from 'celebrate';
import SessionsController from '../controllers/SessionsController';

const sessionRouter = Router();
const sessionsController = new SessionsController();

sessionRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

export default sessionRouter;
