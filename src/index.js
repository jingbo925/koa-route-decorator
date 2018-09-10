import Router from 'koa-router'
import {
  resolve
} from 'path'
import _ from 'lodash'
import glob from 'glob'

const symbolPrefix = Symbol('prefix')
const routerMap = new Map()

const isArray = c => _.isArray(c) ? c : [c]

export class Route {
  constructor(app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router()
  }

  init() {
    glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)

    for (let [conf, controller] of routerMap) {
      const controllers = isArray(controller)
      const prefixPath = conf.target[symbolPrefix]
      const middlewares = conf.middlewares
      if (prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path
      this.router[conf.method](routerPath, ...middlewares, ...controllers)
    }

    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}

const normalizePath = path => path.startsWith('/') ? path : `/${path}`

const decorator = (conf, ...middlewares) => (target, key, descriptor) => {

  conf.path = normalizePath(conf.path)

  routerMap.set({
    target: target,
    middlewares: middlewares,
    ...conf,
  }, target[key])
}

export const router = path => target => (target.prototype[symbolPrefix] = path)

export const get = (path, ...middlewares)=> decorator({
  method: 'get',
  path: path,
},...middlewares)

export const post = (path, ...middlewares) => decorator({
  method: 'post',
  path: path,
},...middlewares)

export const put = (path, ...middlewares) => decorator({
  method: 'put',
  path: path,
},...middlewares)

export const del = (path, ...middlewares) => decorator({
  method: 'del',
  path: path,
},...middlewares)

export const use = (path, ...middlewares) => decorator({
  method: 'use',
  path: path,
},...middlewares)

export const all = (path, ...middlewares) => decorator({
  method: 'all',
  path: path,
},...middlewares)