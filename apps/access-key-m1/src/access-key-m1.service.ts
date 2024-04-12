import { Injectable } from '@nestjs/common';
import { CreateAccessKeyDto } from './dto/create.access-key.dto';
import { AccessKey } from '@app/common';
import { AccessKeyRepository } from '../../../libs/common/src/repositories/access-key.repository';
import { generateUniqueKey } from '@app/common';
import { UpdateAccessKeyDto } from './dto/update.access-key.dto';

@Injectable()
export class AccessKeyM1Service {
  constructor(private readonly accessKeyRepository: AccessKeyRepository) {}

  async createKey(createAccessKeyDto: CreateAccessKeyDto): Promise<AccessKey> {
    const { rateLimit, expirationDate } = createAccessKeyDto;
    const key = await this.generateUniqueKey();
    const accessKey  = await this.accessKeyRepository.create({ key, rateLimit,expirationDate: new Date(expirationDate),isActive:true });
    return accessKey;
  }

  async generateUniqueKey(): Promise<string> {
    let key;
    let exists = true;
    while(exists) {
      key = generateUniqueKey();
      exists = await this.accessKeyRepository.exists({ key });
    }
  
    return key;
  }

  async getAllKeys(): Promise<AccessKey[]> {
    return this.accessKeyRepository.find({});
  }

  async getKeyDetails(key: string): Promise<AccessKey> {
    return this.accessKeyRepository.findOne({ key });
  }

  async updateKey(key: string, updateAccessKeyDto: UpdateAccessKeyDto): Promise<AccessKey> {
    const accessKey = await this.accessKeyRepository.findOne({ key });
    accessKey.rateLimit = updateAccessKeyDto.rateLimit || accessKey.rateLimit;
    accessKey.expirationDate = updateAccessKeyDto.expirationDate ? new Date(updateAccessKeyDto.expirationDate) : accessKey.expirationDate;
    return this.accessKeyRepository.findOneAndUpdate({key},accessKey);
  }

  async deleteKey(key: string): Promise<void> {
    await this.accessKeyRepository.deleteOne({ key });
  }

  async disableKey(key: string): Promise<AccessKey> {
    return await this.accessKeyRepository.findOneAndUpdate({key},{$set:{isActive:false}});
  }
}
