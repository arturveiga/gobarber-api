import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProvider from '../dtos/IFindAllInMonthFromProvider';
import IFindAllInDayFromProvider from '../dtos/IFindAllInDayFromProvider';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProvider,
  ): Promise<Appointment[]>;

  findAllInDayFromProvider(
    data: IFindAllInDayFromProvider,
  ): Promise<Appointment[]>;
}
