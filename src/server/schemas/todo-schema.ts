import { BaseSchema } from './base-schema';
import { ObjectId } from 'mongodb';


export class TodoSchema extends BaseSchema {
  public static SCHEME_TYPE: string = 'TODO';
  _id: ObjectId;
  type: string = TodoSchema.SCHEME_TYPE;
  title: string;
  complete: boolean = false;
  dateCreated: Date = new Date();


  constructor(init: Partial<TodoSchema>) {
    super();

    if (!init._id) {
      this._id = new ObjectId();
    }

    if (init.title && typeof init.title === 'string') {
      this.title = init.title;
    }

    if (init.complete && typeof init.complete === 'boolean') {
      this.complete = init.complete;
    }

    if (init.dateCreated && typeof init.dateCreated === 'string') {
      this.dateCreated = new Date(init.dateCreated);
    }
  }
}