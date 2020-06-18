import AppError from '@shared/erros/AppErros';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListPoviderDayAvailabilityService from './ListPoviderDayAvailabilityService';

let listPoviderDayAvailabilityService: ListPoviderDayAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listPoviderDayAvailabilityService = new ListPoviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list providers day availability', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '123123',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const availability = await listPoviderDayAvailabilityService.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
      ]),
    );
  });
});
