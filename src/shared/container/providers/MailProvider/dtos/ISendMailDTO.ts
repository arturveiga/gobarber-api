import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMainContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: IMainContact;
  from?: IMainContact;
  subject: string;
  templateData: IParseMailTemplateDTO;
}
