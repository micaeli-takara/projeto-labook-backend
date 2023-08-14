import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './routes/UserRoutes'
import { postRouter } from './routes/PostRoutes'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT) || 3003, () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT) || 3003}`)
})

app.use("/users", userRouter) //pega o caminho inicial de users (o primeiro endpoint do users)

app.use("/posts", postRouter) //pega o caminho inicial do posts (o primeiro endpoint do posts)

app.get("/ping", (req, res) => {
    res.send("Pong!")
})

// routers das entidades