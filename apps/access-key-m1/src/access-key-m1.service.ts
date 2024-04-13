import { Injectable, Logger } from '@nestjs/common';
import { CreateAccessKeyDto } from './dto/create.access-key.dto';
import { AccessKey } from '@app/common';
import { AccessKeyRepository } from '../../../libs/common/src/repositories/access-key.repository';
import { generateUniqueKey } from '@app/common';
import { UpdateAccessKeyDto } from './dto/update.access-key.dto';

@Injectable()
export class AccessKeyM1Service {
  private readonly logger = new Logger(AccessKeyM1Service.name);
  constructor(private readonly accessKeyRepository: AccessKeyRepository) {}

  async createKey(createAccessKeyDto: CreateAccessKeyDto): Promise<AccessKey> {
    try {
      const { rateLimit, expirationDate } = createAccessKeyDto;
      console.log(expirationDate, 'expiration Date');
      const key = await this.generateUniqueKey();
      const accessKey = await this.accessKeyRepository.create({
        key,
        rateLimit,
        expirationDate: new Date(expirationDate),
        isActive: true,
      });
      return accessKey;
    } catch (error) {
      this.logger.error('Error in creating key', error);
    }
  }

  async generateUniqueKey(): Promise<string> {
    try {
      let key;
      let exists = true;
      while (exists) {
        key = generateUniqueKey();
        exists = await this.accessKeyRepository.exists({ key });
      }
      return key;
    } catch (error) {
      this.logger.error('Error in generateUniqueKey', error);
    }
  }

  async getAllKeys(): Promise<AccessKey[]> {
    try {
      return this.accessKeyRepository.find({});
    } catch (error) {
      this.logger.error('Error in getAllKeys', error);
    }
  }

  async getKeyDetails(key: string): Promise<AccessKey> {
    try {
      return this.accessKeyRepository.findOne({ key });
    } catch (error) {
      this.logger.error('Error in getKeyDetails', error);
    }
  }

  async updateKey(
    key: string,
    updateAccessKeyDto: UpdateAccessKeyDto,
  ): Promise<AccessKey> {
    try {
      const accessKey = await this.accessKeyRepository.findOne({ key });
      accessKey.rateLimit = updateAccessKeyDto.rateLimit || accessKey.rateLimit;
      accessKey.expirationDate = updateAccessKeyDto.expirationDate
        ? new Date(updateAccessKeyDto.expirationDate)
        : accessKey.expirationDate;
      return this.accessKeyRepository.findOneAndUpdate({ key }, accessKey);
    } catch (error) {
      this.logger.error('Error in updateKey', error);
    }
  }

  async deleteKey(key: string): Promise<void> {
    try {
      await this.accessKeyRepository.deleteOne({ key });
    } catch (error) {
      this.logger.error('Error in deleteKey', error);
    }
  }

  async disableKey(key: string): Promise<AccessKey> {
    try {
      return await this.accessKeyRepository.findOneAndUpdate(
        { key },
        { $set: { isActive: false } },
      );
    } catch (error) {
      this.logger.error('Error in disableKey', error);
    }
  }
}
