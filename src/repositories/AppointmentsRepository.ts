import { isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

interface CreateAppointmentRequest {
  provider: string;
  date: Date;
}

class AppoitmentsRepository {
  private appointments: Appointment[] = [];

  constructor() {
    this.appointments = [];
  }

  public findByDate(date: Date): Appointment | null {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(date, appointment.date),
    );

    return findAppointment || null;
  }

  public create({ provider, date }: CreateAppointmentRequest): Appointment {
    const appointment = new Appointment({ provider, date });

    this.appointments.push(appointment);

    return appointment;
  }

  public all(): Appointment[] {
    return this.appointments;
  }
}

export default AppoitmentsRepository;
