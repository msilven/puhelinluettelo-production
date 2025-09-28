const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log("USAGE: node mongo.js <password> | <name> <number>\n\nGive atleast password as an argument")
    process.exit(1)
}

if(process.argv.length > 3 && process.argv.length < 5) {
    console.log('USAGE:node mongo.js <password> | <name> <number>\n\nGive both name and number')
    process.exit(1)
}

const password = process.argv[2]
const argName = process.argv[3]
const argNumber = process.argv[4]

insertMode = (process.argv.length == 3) ? false : true;

//FQ4CpHHHDkHHDuVP
const url = `mongodb+srv://mikkoasilvennoinen_db_user:${password}@cluster0.qg2epmn.mongodb.net/puhelinluetteloApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// The collection for phonebook is called persons
const Person = mongoose.model('persons', personSchema)

const person = new Person({
    name: argName,
    number: argNumber
})

if(insertMode) {
    person.save().then(resuld => {
        console.log(`added ${argName} number ${argNumber} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        console.log('Phonebook')

        result.forEach(person => {
            console.log(`${person['name']} ${person['number']}`)
        })
        mongoose.connection.close()
    })
}
