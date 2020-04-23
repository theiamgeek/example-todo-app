import { expressResource } from '@epandco/unthink-foundation-express';
import {data, DataResult, RouteContext, view} from '@epandco/unthink-foundation';
import {TodoModel} from '../models/todo-model';
import * as Ajv from 'ajv';
import {Request, Response} from 'express';

const todoStore: TodoModel[] = [
  new TodoModel({
    id: 0,
    title: 'First things first',
    complete: true
  }),
  new TodoModel({
    id: 1,
    title: 'Next step'
  })
];

const todoModelValidationSchema = {
  '$schema': 'http://json-schema.org/draft-07/schema',
  '$id': 'http://example.com/example.json',
  'type': 'object',
  'title': 'The Root Schema',
  'description': 'The root schema comprises the entire JSON document.',
  'default': {},
  'additionalProperties': true,
  'required': [
    'title',
    'complete'
  ],
  'properties': {
    'title': {
      '$id': '#/properties/title',
      'type': 'string',
      'title': 'The Title Schema',
      'description': 'An explanation about the purpose of this instance.',
      'default': '',
      'examples': [
        'Hello world'
      ]
    },
    'complete': {
      '$id': '#/properties/complete',
      'type': 'boolean',
      'title': 'The Complete Schema',
      'description': 'An explanation about the purpose of this instance.',
      'default': false,
      'examples': [
        false
      ]
    }
  }
};

/**
 * This middleware validates the existence of the give TodoModel id,
 * and if it does exist it sets the index and the TodoModel on the locals object.
 */
async function requireTodoExists(request: Request, response: Response, next: Function): Promise<void> {
  if (!request.params.id) {
    next(DataResult.notFound());
  }
  const index = todoStore.findIndex(todo => todo.id?.toString() === request.params.id);
  if (index < 0) {
    next(DataResult.notFound());
  }
  response.locals.todoIndex = index;
  response.locals.todo = todoStore[index];
  next();
}

/**
 * This middleware validates the request body against the schema.
 */
async function validateTodoMiddleware(request: Request, response: Response, next: Function): Promise<void> {
  const validator = new Ajv();
  const valid = validator.validate(todoModelValidationSchema, request.body);
  if (!valid) {
    next(DataResult.error(validator.errorsText()));
  }
  response.locals.model = request.body;
  next();
}

export default expressResource({
  name: 'Root',
  basePath: '/',
  routes: [
    view('/', 'todo.html'),

    data('/todos', {
      // get list
      'get': async () => DataResult.ok(todoStore),

      // create new
      'post': async context => {
        const validator = new Ajv();
        const valid = validator.validate(todoModelValidationSchema, context.body);
        if (!valid) {
          return DataResult.error(validator.errorsText());
        }
        todoStore.push(new TodoModel({
          ...context.body,
          id: todoStore.length
        }));
        return DataResult.noResult();
      }
    }),

    data('/todos/:id', {
      // update
      'put': {
        handler: async function(ctx: RouteContext): Promise<DataResult> {
          const model = new TodoModel(ctx.body as TodoModel);
          const todo = ctx.local?.todo as TodoModel;
          todo.title = model.title;
          todo.complete = model.complete;
          return DataResult.noResult();
        },
        middleware: [
          requireTodoExists,
          validateTodoMiddleware
        ]
      },

      // delete
      'delete': {
        handler: async function(context: RouteContext): Promise<DataResult> {
          todoStore.splice(context.local?.todoIndex as number, 1);
          return DataResult.noResult();
        },
        middleware: [
          requireTodoExists
        ]
      }
    })
  ]
});
