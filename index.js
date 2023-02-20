//config inicial
const express = require('express')
const app = express()
const mongoose = require('mongoose')

const Person = require('./models/Person')

//forma de ler JSON / middlewares
app.use(
    express.urlencoded({
        extended: true
    }),
)

app.use(express.json())
//rota inicial / endpoint
app.get('/', (req,res) =>{
    res.json({message: "oi Express"})
})
//senha banco 7ubgCswPWhxDHmbx
//mongodb+srv://<fabriciolidani>:<7ubgCswPWhxDHmbx>@apiclusternfe.liy6tgi.mongodb.net/?retryWrites=true&w=majority


// rotas
app.post('/person', async (req, res) => {
    const { name, salary, approved } = req.body
  
    const person = {
      name,
      salary,
      approved,
    }
  
    try {
      await Person.create(person)
  
      res.status(201).json({ message: 'Pessoa inserida no sistema com sucesso!' })
    } catch (error) {
      if (res.status == "ValidatorError") {
        res.status(201).json({ message: 'Erro na validação' })
      }else{
        //res.status(500).json({ erro: error.name })
        //res.status(500).json({ erro: error.name })
        if(error.name == 'ValidationError')
        {
        res.status(201).json({ message: error.name })
        }else{
          res.status(201).json({ message: "teste" })
        }
      }
    }
  })
  
  app.get('/person', async (req, res) => {
    try {
      
      const people = await Person.find()
      //const peopleName = people.name
      
      res.status(200).json(people)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  })
  
  app.get('/person/:id', async (req, res) => {
    const id = req.params.id
  
    try {
      const person = await Person.findOne({ _id: id })
  
      if (!person) {
        res.status(422).json({ message: 'Usuário não encontrado!' })
        return
      }
  
      res.status(200).json(person)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  })
  
  app.patch('/person/:id', async (req, res) => {
    const id = req.params.id
  
    const { name, salary, approved } = req.body
  
    const person = {
      name,
      salary,
      approved,
    }
  
    try {
      const updatedPerson = await Person.updateOne({ _id: id }, person)
  
      if (updatedPerson.matchedCount === 0) {
        res.status(422).json({ message: 'Usuário não encontrado!' })
        return
      }
  
      res.status(200).json(person)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  })
  
  app.delete('/person/:id', async (req, res) => {
    const id = req.params.id
  
    const person = await Person.findOne({ _id: id })
  
    if (!person) {
      res.status(422).json({ message: 'Usuário não encontrado!' })
      return
    }
  
    try {
      await Person.deleteOne({ _id: id })
  
      res.status(200).json({ message: 'Usuário removido com sucesso!' })
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  })
  
  app.get('/', (req, res) => {
    res.json({ message: 'Oi Express!' })
  })

// entregar porta para disponibilizar aplicação, escutar...
mongoose.connect('mongodb+srv://fabriciolidani:7ubgCswPWhxDHmbx@apiclusternfe.liy6tgi.mongodb.net/?retryWrites=true&w=majority'
).then(() => {
    console.log('Inicializando...' + '\n' + 'Conexão com o banco realizada com sucesso!')
    app.listen(3000)
  })
  .catch((err) => 
    console.log('Inicializando...' + '\n' + 'Não foi possível se conectar ao banco! Erro: ' + err))
