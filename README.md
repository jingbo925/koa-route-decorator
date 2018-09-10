## install
```
npm i koa2-route-decorator
```

## Decorators

- @router(path)
- @get(path, middleware)
- @post(path, middleware)
- @put(path, middleware)
- @del(path, middleware)
- @use
- @all

## demo

```
index.js

import {Route} from 'koa2-route-decorator'
import Koa from 'koa'
import { resolve } from 'path'

const app = new Koa()
const apiPath = resolve(__dirname, '../routes')
const router = new Route(app, apiPath)
router.init()
```

```
import {router, get, post, put } from 'koa2-route-decorator'

@router('/user')
export class userController {
  @get('/' )
  async login(ctx, next) {

    const user = await User.findOne()


    const token = createToken(user.dataValues)
    ctx.body = {
      data: token
    }
  }

  @post('/sign', checkToken())
  async sign(ctx, next) {
    const user = ctx.user
    ctx.body = {
      data: user
    }
  }
}
```