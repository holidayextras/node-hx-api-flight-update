const express = require('express')
const bodyParser = require('body-parser')
const inputSchema = require('../../schema/input.json')
const Ajv = require('ajv')

const ajv = new Ajv({allErrors: true})
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))
const validate = ajv.compile(inputSchema)
const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json())

//Listen for booking updates and respond
app.post('/flightUpdate', (req, res, next) => {
  console.log(req.body)
  const valid = validate(req.body)
  if (!valid) { // If input is not valid use error handler
    return next(validate.errors)
  }
  const outJson = req.body.map((item) => {
    return {
      partner_booking_ref: item.partner_booking_ref,
      status: 'OK',
      message: 'Success'
    }
  })
  res.json(outJson)
})

// Error handler
app.use((err, req, res, next) => {
  const responseData = {
    statusText: 'Bad Request',
    validations: err
  }
  console.error(JSON.stringify(responseData, null, 2))
  res.status(400)
  res.json(responseData)
})

app.listen(port, () => {
  console.log('Listening on port: ', port)
})
