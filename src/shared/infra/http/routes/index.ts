import { Router } from 'express';
import providerRouter from '@modules/appointments/infra/http/routes/providers.routes';
import appointmentRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import userRouter from '@modules/users/infra/http/routes/users.routes';
import sessionRouter from '@modules/users/infra/http/routes/session.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

const routes = Router();

routes.use('/appointments', appointmentRouter);
routes.use('/users', userRouter);
routes.use('/session', sessionRouter);
routes.use('/password', passwordRouter);
routes.use('/profie', profileRouter);
routes.use('/provider', providerRouter);

export default routes;
