require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
//const cors = require('cors')
const app = express()
const Person = require('./model/person')

const generateId = () => {
    const id = Math.floor(Math.random() * 1000)
    return id
}

app.use(express.json())
app.use(express.static('dist'))
//app.use(cors())

morgan.token('body', request => {
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = []

app.get('/', (request,response) => {
    response.send('<h1>Heippa</h1>')
})

app.get('/info', (request,response) => {

    Person.find({}).then(persons => {
        const personCount = persons.length
        const date = new Date()

        const dateTimeStr = `${date.toDateString()} ${date.toTimeString()}`
        const html =    `<p>Phonebook has info for ${personCount} people</p>
                    <p>${dateTimeStr}</p>`

        response.send(html)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    // If name is missing give error
    if(!body.name) {
        return response.status(400).json({
            error: "Name is missing!"
        })
    }

    // If number is missing give error
    if(!body.number) {
        return response.status(400).json({
            error: "Number is missing!"
        })
    }

    // If name is already in the list give error
    const nameCheck = persons.find((element) => element.name === body.name)
    if(nameCheck) {
        return response.status(400).json({
            error: "Name already exists"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
		response.json(savedPerson)
	})
})

app.get('/api/persons', (request,response) => {
    //response.json(persons)
    console.log('API get all persons')

    Person.find({}).then(persons => {

        console.log(persons)
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request,response) => {
    const id = request.params.id

    Person.findById(id).then(person => {
        if(person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => {
        console.log(error)
        response.status(400).send({error: 'malformatted id'})
    })

})

app.put('/api/persons/:id', (request,response) => {
    const id = request.params.id
    const body = request.body

    //const person = persons.find(person => person.id === id)
    //const query = { id: `${request.params.id}` }

    Person.findById(id).then(person => {
        response.json(person)
    }) 

    console.log("Query: ", query)

    const person = new Person({
        name: body.name,
        number: body.number
    })

    Person.updateOne(query, { $set: {name: body.name, number: body.number}}).then(savedPerson => {
        console.log(savedPerson)
    })
/*
    person.save().then(savedPerson => {
		response.json(savedPerson)
	})

    if(person) {
        person.name = body.name
        person.number = body.number
        response.json(person)    
    } else {
        response.status(404).end()
    }
*/
})

app.delete('/api/persons/:id', (request,response) => {
    const id = request.params.id
	//persons = persons.filter(person => person.id !== id)

     Person.findByIdAndDelete(request.params.id).then(person => {
        response.json(person)
    })

	//response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Hey, the server running on port ${PORT}`)
})