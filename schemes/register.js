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
      format: 'email',
    },
    telephone: {
      type: 'number',
    },
    dateBirthday: {
      type: 'string',
      format: 'date',
    },
  },
  required: ['username', 'password', 'email', 'telephone', 'dateBirthday'],
};
