module.exports = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      minLength: 1,
      maxLength: 150,
    },
    userId: {
      type: 'number',
    },
    id: {
      type: 'number',
    },
    author: {
      type: 'string',
    },
  },
  required: ['text', 'id', 'userId', 'author'],
};
