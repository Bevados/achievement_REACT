import { ObjectId } from 'mongodb';

/*
  Тип TypeScript для документа в коллекции `items`.
  Используется во всех слоях (репозиторий, сервис, контроллер) для строгой типизации.
  Поля:
    - _id: MongoDB ObjectId (опционально при создании)
    - name: название задания/предмета
    - description: дополнительное описание
    - owner: UID пользователя из Firebase
    - completed: флаг завершения
    - createdAt / updatedAt: метки времени
*/
export interface Item {
  _id?: ObjectId;
  name: string;
  description?: string;
  owner: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/*
  DTO для создания item на уровне API.
  owner/createdAt/updatedAt заполняются на сервере, поэтому с клиента не принимаются.
*/
export interface CreateItemDto {
  name: string;
  description?: string;
  completed?: boolean;
}

/*
  DTO для частичного обновления item.
  Все поля опциональны, так как PATCH обновляет только переданные поля.
*/
export interface UpdateItemDto {
  name?: string;
  description?: string;
  completed?: boolean;
}
