import { ObjectId } from 'mongodb';
import type { CollectionCategory, EntryStatus } from '../../contracts/collection.contracts';

export * from '../../contracts/collection.contracts';

export interface CollectionDocument {
  _id?: ObjectId;
  ownerId: string;
  title: string;
  category: CollectionCategory;
  customCategory?: string;
  description?: string;
  coverImageUrl?: string;
  isPublic: boolean;
  entriesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EntryDocument {
  _id?: ObjectId;
  collectionId: ObjectId;
  ownerId: string;
  title: string;
  status: EntryStatus;
  description?: string;
  imageUrl?: string;
  priceCents?: number;
  tags?: string[];
  rating?: number;
  dateStart?: Date;
  dateEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}
