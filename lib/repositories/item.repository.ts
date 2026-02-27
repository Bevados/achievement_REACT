/*
  Репозиторий для работы с коллекцией `items` в MongoDB.

  Этот слой выполняет операции низкого уровня (CRUD) напрямую с базой данных.
  Изолированная логика упрощает тестирование и замену базы (например, на другую в будущем).
*/
import { ObjectId } from 'mongodb';
import { getCollection } from '../../api/_mongodb';
import type { Item } from '../types/item.types';

export async function findUserItems(userId: string) {
  const collection = await getCollection<Item>('items');

  return collection.find({ owner: userId }).sort({ createdAt: -1 }).toArray();
}

export async function createItem(data: Item) {
  const collection = await getCollection<Item>('items');
  return collection.insertOne(data);
}

export async function updateItem(id: string, userId: string, updateData: Partial<Item>) {
  const collection = await getCollection<Item>('items');

  return collection.updateOne({ _id: new ObjectId(id), owner: userId }, { $set: updateData });
}

export async function deleteItem(id: string, userId: string) {
  const collection = await getCollection<Item>('items');

  return collection.deleteOne({
    _id: new ObjectId(id),
    owner: userId,
  });
}
