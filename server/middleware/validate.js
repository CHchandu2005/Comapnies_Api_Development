const validate = (schema, property = 'body') => (req, res, next) => {
  const options = { abortEarly: false, stripUnknown: true, convert: true };
  console.log("Body data:",req[property].foundedYear);
  for (let key in req[property]) {
    console.log(`${key}: ${req[property][key]}`);
  }
  
  const { error, value } = schema.validate(req[property], options);
  console.log("Error:",error);
  if (error) {
    return res.status(400).json({ success: false, message: 'Validation error', details: error.details.map(d => d.message) });
  }
  req[property] = value;
  return next();
};

module.exports = validate;


