import { Request, Response } from 'express';
import ListPoviderDayAvailabilityService from '@modules/appointments/services/ListPoviderDayAvailabilityService';
import { container } from 'tsyringe';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.body;

    const listPoviderDayAvailabilityService = container.resolve(
      ListPoviderDayAvailabilityService,
    );

    const availability = await listPoviderDayAvailabilityService.execute({
      provider_id,
      day,
      month,
      year,
    });

    return response.json(availability);
  }
}
