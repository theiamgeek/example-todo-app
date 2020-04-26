import { TodoModel } from '../models/todo-model';
import { NotAvailable, ServiceError } from './service-wrapper';
import { getDefaultCollection } from './mongodb-service';
import { TodoSchema } from '../schemas/todo-schema';
import { ObjectId } from 'mongodb';

function mapToModel(schema: TodoSchema): TodoModel {
  return new TodoModel({
    id: schema._id?.toHexString(),
    title: schema.title,
    complete: schema.complete,
    dateCreated: schema.dateCreated
  });
}

function mapToSchema(model: TodoModel): TodoSchema {
  return new TodoSchema({
    title: model.title,
    complete: model.complete,
  });
}

export async function getTodos(): Promise<TodoModel[]> {
  const coll = await getDefaultCollection<TodoSchema>();

  const models = coll
    .find({ type: TodoSchema.SCHEME_TYPE })
    .map(mapToModel)
    .toArray();

  return models;
}

export async function getTodo(id: string): Promise<TodoModel> {
  const coll = await getDefaultCollection<TodoSchema>();

  const todoSchema = await coll.findOne({ _id: new ObjectId(id) });

  if (!todoSchema) {
    throw new NotAvailable();
  }

  const model = mapToModel(todoSchema);
  return model;
}

export async function createTodo(model: TodoModel): Promise<string> {
  const coll = await getDefaultCollection<TodoSchema>();

  const schema = mapToSchema(model);
  const result = await coll.insertOne(schema);

  if (!result.result.ok) {
    throw new ServiceError(
      'general',
      'Unable to create todo.'
    );
  }

  return result.insertedId.toHexString();
}

export async function updateTodo(id: string, model: TodoModel): Promise<void> {

  const coll = await getDefaultCollection<TodoSchema>();

  const result = await coll.updateMany(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: model.title,
        complete: model.complete
      }
    }
  );

  if (!result.result.ok) {
    throw new ServiceError(
      'general',
      'Unable to update todo!'
    );
  }

  if (result.matchedCount === 0) {
    // If no documents matched then it wasn't found
    throw new NotAvailable();
  }

  return;
}

export async function deleteTodo(id: string): Promise<void> {
  const coll = await getDefaultCollection<TodoSchema>();
  const result = await coll.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    throw new NotAvailable();
  }

  return;
}
