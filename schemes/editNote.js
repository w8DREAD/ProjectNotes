module.exports = {
  type: 'object',
  properties: {
    noteText: {
      type: 'string',
      minLength: 5,
      maxLength: 500,
    },
  },
};
