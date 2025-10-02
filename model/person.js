const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('Connecting to ', url)

mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB: ', result)
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: [true, 'Name is required field for a person'] },
  number: {
    type: String,
    minlength: 8,
    required: [true, 'Number is required field for a person'],
    validate: {
      validator: function(value) {
        return /^\d{2,3}-[0-9]+/.test(value)
      },
      message: props => `${props.value} is not valid phonenumber. Valid format example: 040-1234567`
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('persons', personSchema)
