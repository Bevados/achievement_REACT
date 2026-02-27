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
