import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AccessKeyM1Service } from './access-key-m1.service';
import { CreateAccessKeyDto } from './dto/create.access-key.dto';
import { AccessKey } from '@app/common';
import { UpdateAccessKeyDto } from './dto/update.access-key.dto';

@Controller("/api/access-keys")
export class AccessKeyM1Controller {
  constructor(private readonly accessKeyM1Service: AccessKeyM1Service) {}

  @Post("create-key")
  createAccessKey(@Body() createAccessKeyDto: CreateAccessKeyDto): Promise<AccessKey> {
    return this.accessKeyM1Service.createKey(createAccessKeyDto);
  }

  @Get("get-all-keys")
  getAllAccessKeys(): Promise<AccessKey[]> {
    return this.accessKeyM1Service.getAllKeys();
  }

  @Get('get-user-plan/:key')
  getAccessKeyDetails(@Param('key') key: string): Promise<AccessKey> {
    return this.accessKeyM1Service.getKeyDetails(key);
  }

  @Put('update-key/:key')
  updateAccessKey(@Param('key') key: string,@Body() updateAccessKeyDto: UpdateAccessKeyDto): Promise<AccessKey> {
    return this.accessKeyM1Service.updateKey(key, updateAccessKeyDto);
  }

  @Delete('delete-key/:key')
  deleteAccessKey(@Param('key') key: string): Promise<void> {
    return this.accessKeyM1Service.deleteKey(key);
  }

  @Put('disable-key/:key')
  disableAccessKey(@Param('key') key: string): Promise<AccessKey> {
    return this.accessKeyM1Service.disableKey(key);
  }
}
