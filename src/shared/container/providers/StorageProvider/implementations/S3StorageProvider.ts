import fs from 'fs';
import path from 'path';
import aws from 'aws-sdk';
import uploadConfig from '@config/upload';
import mime from 'mime';
import IStorageProvider from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: aws.S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  public async saveFile(file: string): Promise<string> {
    const orinalPath = path.resolve(uploadConfig.tmpFolder, file);
    const fileContent = fs.promises.readFile(orinalPath);
    const ContentType = mime.getType(orinalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }
    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();
    await fs.promises.unlink(orinalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider;
