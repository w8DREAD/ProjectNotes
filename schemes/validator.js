const Ajv = require('ajv');

const ajv = new Ajv();

function validator(schema, data) {
  const valid = ajv.validate(schema, data);
  if (valid) {
    return false;
  }
  return `${ajv.errors[0].dataPath} ${ajv.errors[0].message}`;
}

module.exports = validator;
