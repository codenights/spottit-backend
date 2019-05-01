import Koa from 'koa'
import dotenv from 'dotenv'

dotenv.config()

const app = new Koa()

app.use(ctx => {
  // eslint-disable-next-line no-param-reassign
  ctx.body = 'Hello Koa'
})

app.listen(process.env.PORT)
