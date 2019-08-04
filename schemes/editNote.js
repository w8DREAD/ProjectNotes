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
      minLength: 5,
      maxLength: 500,
    },
  },
};
