import express from 'express'
import cors from 'cors'

import routesMarcas from './routes/marcas'
import routesSapatos from './routes/sapatos'
import routesClientes from './routes/clientes'
import routesLogin from './routes/login'
import routesPropostas from './routes/propostas'
import routesDashboard from './routes/dashboard'
import routesAdminLogin from './routes/adminLogin'
import routesAdmins from './routes/admins'
import routesEstoques from './routes/estoques'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use("/marcas", routesMarcas)
app.use("/sapatos", routesSapatos)
app.use("/clientes", routesClientes)
app.use("/clientes/login", routesLogin)
app.use("/propostas", routesPropostas)
app.use("/dashboard", routesDashboard)
app.use("/admins/login", routesAdminLogin)
app.use("/admins", routesAdmins)
app.use("/estoques", routesEstoques)

app.get('/', (req, res) => {
  res.send('API: Revenda de Sapatos')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})

export default app;