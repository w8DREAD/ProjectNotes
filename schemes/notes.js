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
  },
  required: ['tagText', 'noteText', 'userId'],
};
