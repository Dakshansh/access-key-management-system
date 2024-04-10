import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Model, Connection, Types, SaveOptions } from "mongoose";

import { AbstractRepository } from "@app/common";
import { AccessKey } from "../schemas/access-key.schema";

@Injectable()
export class AccessKeyRepository extends AbstractRepository<AccessKey> {
  protected readonly logger = new Logger(AccessKeyRepository.name);

  constructor(@InjectModel(AccessKey.name) accessKeyModel: Model<AccessKey>, @InjectConnection() connection: Connection) {
    super(accessKeyModel, connection);
  }

  async createPartial(document: Partial<AccessKey>, options?: SaveOptions): Promise<AccessKey> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save(options)).toJSON() as unknown as AccessKey;
  }
}
