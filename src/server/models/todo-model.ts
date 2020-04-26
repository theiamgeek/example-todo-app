
export const todoModelValidationSchema = {
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

export class TodoModel {
  id?: string;
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
