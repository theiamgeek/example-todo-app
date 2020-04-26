import { expressResource } from '@epandco/unthink-foundation-express';
import { data, DataResult, view } from '@epandco/unthink-foundation';
import { TodoModel, todoModelValidationSchema } from '../models/todo-model';
import * as Ajv from 'ajv';
import {Request, Response} from 'express';
import { NotAvailable, serviceWrapper } from '../services/service-wrapper';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../services/todo-service';


/**
 * Compile the validate function once
 */
const validator = new Ajv();
const validate = validator.compile(todoModelValidationSchema);

/**
 * This middleware validates the request body against the schema.
 */
async function validateTodoMiddleware(request: Request, response: Response, next: Function): Promise<void> {
  const valid = validate(request.body);
  if (!valid) {
    next(DataResult.error({
      type: 'validation',
      message: validator.errorsText(validate.errors)
    }));
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
      'get': async () => serviceWrapper(getTodos),
      // create new
      'post': {
        handler: async (ctx): Promise<DataResult> => serviceWrapper( () => createTodo(ctx.body as TodoModel)),
        middleware: [
          validateTodoMiddleware
        ]
      }
    }),
    data('/todos/:id', {
      // update
      'put': {
        handler: async (ctx): Promise<DataResult> => serviceWrapper(() => {
          if (!ctx.params) {
            throw new NotAvailable();
          }

          const model = new TodoModel(ctx.body as TodoModel);
          return updateTodo(ctx.params.id?.toString(), model);
        }),
        middleware: [
          validateTodoMiddleware
        ]
      },

      // delete
      'delete': async ctx => serviceWrapper(() => {
        if (!ctx.params) {
          throw new NotAvailable();
        }

        return deleteTodo(ctx.params.id?.toString());
      })
    })
  ]
});
