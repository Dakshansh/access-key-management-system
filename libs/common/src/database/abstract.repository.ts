import { ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
  SaveOptions,
  Connection,
  QueryOptions,
  MongooseBulkWriteOptions,
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';
export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  async create(
    document: Omit<TDocument, '_id'>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    try {
      const createdDocument = new this.model({
        ...document,
        _id: new Types.ObjectId(),
      });
      return (
        await createdDocument.save(options)
      ).toJSON() as unknown as TDocument;
    } catch (err) {
      if (err && err.code === 11000) {
        throw new ForbiddenException();
      }
      throw err;
    }
  }

  async createPartial(
    document: Partial<TDocument>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    try {
      const createdDocument = new this.model({
        ...document,
        _id: new Types.ObjectId(),
      });
      return (
        await createdDocument.save(options)
      ).toJSON() as unknown as TDocument;
    } catch (err) {
      if (err && err.code === 11000) {
        throw new ForbiddenException();
      }
      throw err;
    }
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    options?: QueryOptions,
  ): Promise<TDocument> {
    const document = await this.model.findOne(
      filterQuery,
      {},
      { ...options, lean: true },
    );

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options?: SaveOptions,
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      new: true,
      ...options,
    });

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async deleteOne(filterQuery: FilterQuery<TDocument>, options?: SaveOptions) {
    const response: any = await this.model.deleteOne(filterQuery, options);

    if (response.deletedCount === 0) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      throw new NotFoundException('Document not found.');
    }
  }

  async updateMany(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options?: SaveOptions,
  ) {
    const result = await this.model.updateMany(filterQuery, update, options);
    return result;
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
    options?: SaveOptions,
  ) {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
      ...options,
    });
  }

  async bulkWrite(batch: Array<any>, options?: MongooseBulkWriteOptions) {
    return this.model.bulkWrite(batch, { ...options });
  }

  async aggregate(pipeline: Array<any>, options?: any) {
    return this.model.aggregate(pipeline, options);
  }

  async distinct(field: string, filterQuery: FilterQuery<TDocument>) {
    return this.model.distinct(field, filterQuery);
  }

  async find(
    filterQuery: FilterQuery<TDocument>,
    fields: any = {},
    options?: QueryOptions,
  ) {
    return this.model.find(filterQuery, fields, { lean: true, ...options });
  }

  async count(filterQuery: FilterQuery<TDocument>, options?: QueryOptions) {
    return this.model.countDocuments(filterQuery, options);
  }

  async exists(filterQuery: FilterQuery<TDocument>, options?: SaveOptions) {
    try {
      const docs = await this.findOne(filterQuery, { ...options });
      if (docs) return true;
      return false;
    } catch (err) {
      return false;
    }
  }
}
