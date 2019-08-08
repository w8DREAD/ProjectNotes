module.exports = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      minLength: 3,
      maxLength: 500,
    },
    userId: {
      type: 'number',
    },
  },
  required: ['tag', 'text', 'userId'],
};
