import express from 'express'
const app = express()
const port = 8081

app.get('/', async (req, res) => {
  
  res.send('OK')
})

app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
