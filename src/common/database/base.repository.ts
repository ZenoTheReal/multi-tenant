import { Document, Model } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const createdEntity = new this.model(data);
    return createdEntity.save();
  }

  async findOne(filterQuery: Record<string, any>): Promise<T | null> {
    return this.model.findOne(filterQuery).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async find(filterQuery: Record<string, any> = {}): Promise<T[]> {
    return this.model.find(filterQuery).exec();
  }

  async update(filterQuery: Record<string, any>, updateData: Record<string, any>): Promise<T | null> {
    return this.model.findOneAndUpdate(filterQuery, updateData, { new: true }).exec();
  }

  async delete(filterQuery: Record<string, any>): Promise<boolean> {
    const deleteResult = await this.model.deleteOne(filterQuery).exec();
    return deleteResult.deletedCount >= 1;
  }
}

