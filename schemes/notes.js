module.exports = {
  type: 'object',
  properties: {
    tagText: {
      type: 'string',
      minLength: 3,
      maxLength: 30,
    },
    noteText: {
      type: 'string',
      minLength: 3,
      maxLength: 500,
    },
    userId: {
      type: 'number',
    },
    author: {
      type: 'string',
    },
  },
  required: ['tagText', 'noteText', 'userId', 'author'],
};
