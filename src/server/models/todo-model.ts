
export class TodoModel {
  id?: number;
  title: string;
  complete: boolean = false;
  dateCreated: Date = new Date();

  constructor(init: Partial<TodoModel>) {
    Object.assign(this, init);
    if (init.dateCreated && typeof init.dateCreated === 'string') {
      this.dateCreated = new Date(init.dateCreated);
    }
  }
}
