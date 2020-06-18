import { Router } from 'express';
import { Segments, Joi, celebrate } from 'celebrate';

import ensureAutheticated from '@modules/users/infra/http/middleware/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProvidersAppointmentController';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAutheticated);
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
