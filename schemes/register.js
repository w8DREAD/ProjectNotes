module.exports = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 3,
      maxLength: 10,
    },
    password: {
      type: 'string',
      minLength: 3,
      maxLength: 25,
    },
    email: {
      type: 'number',
      format: 'email',
    },
    telephone: {
      type: 'number',
      length: 11,
    },
    dateBirthday: {
      type: 'string',
      format: 'date',
    },
  },
  required: ['username', 'password', 'email', 'telephone', 'dateBirthday'],
};
