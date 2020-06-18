import { Request, Response } from 'express';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { container } from 'tsyringe';

export default class ProviderAppointmentController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.body;

    const listPoviderDayAvailabilityService = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listPoviderDayAvailabilityService.execute({
      provider_id,
      day,
      month,
      year,
    });

    return response.json(appointments);
  }
}
