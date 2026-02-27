/*
  Сервисный слой для операций с "items".

  Этот модуль является промежуточным между контроллерами (API) и репозиторием
  (прямой доступ к базе). Здесь можно размещать бизнес-логику, валидацию,
  преобразование данных и т.п. В текущем простом примере большая часть логики
  сосредоточена в контроллерах и репозиториях, но слой оставлен для масштабируемости.
*/
import * as repository from '../repositories/item.repository';
import type { Item } from '../types/item.types';

export async function getItems(userId: string) {
  return repository.findUserItems(userId);
}

export async function createNewItem(userId: string, data: any) {
  const item: Item = {
    ...data,
    owner: userId,
    completed: data.completed ?? false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return repository.createItem(item);
}

export async function updateExistingItem(id: string, userId: string, data: any) {
  return repository.updateItem(id, userId, {
    ...data,
    updatedAt: new Date(),
  });
}

export async function removeItem(id: string, userId: string) {
  return repository.deleteItem(id, userId);
}
