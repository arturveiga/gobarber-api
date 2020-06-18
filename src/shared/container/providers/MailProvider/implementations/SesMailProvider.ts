import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { Transporter } from 'nodemailer';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import { injectable, inject } from 'tsyringe';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
export default class EtherealMaiProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTelmplateProvier')
    private mailTemplateProvider: IMailTemplateProvider,
  ) { }

  public async sendMail({
    to,
    subject,
    from,
    templateData,
  }: ISendMailDTO): Promise<void> {
    console.log('CHEGOU AQUI');
  }
}
