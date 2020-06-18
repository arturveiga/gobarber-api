import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import nodemailer, { Transporter } from 'nodemailer';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import { injectable, inject } from 'tsyringe';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
export default class EtherealMaiProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTelmplateProvier')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendMail({
    to,
    subject,
    from,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log('Message sent %s', message.messageId);
    console.log('Preview URL %s', nodemailer.getTestMessageUrl(message));
  }
}
