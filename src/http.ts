/* eslint-disable new-cap */

import * as assert from 'assert'
import * as _ from 'lodash'
import * as jayson from 'jayson'
import {JbcoinAPI} from './api'


/* istanbul ignore next */
function createHTTPServer(options, httpPort) {
  const jbcoinAPI = new JbcoinAPI(options)

  const methodNames = _.filter(_.keys(JbcoinAPI.prototype), k => {
    return typeof JbcoinAPI.prototype[k] === 'function'
    && k !== 'connect'
    && k !== 'disconnect'
    && k !== 'constructor'
    && k !== 'JbcoinAPI'
  })

  function applyPromiseWithCallback(fnName, callback, args_) {
    try {
      let args = args_
      if (!_.isArray(args_)) {
        // @ts-ignore
        const fnParameters = jayson.Utils.getParameterNames(jbcoinAPI[fnName])
        args = fnParameters.map(name => args_[name])
        const defaultArgs = _.omit(args_, fnParameters)
        assert(_.size(defaultArgs) <= 1,
          'Function must have no more than one default argument')
        if (_.size(defaultArgs) > 0) {
          args.push(defaultArgs[_.keys(defaultArgs)[0]])
        }
      }
      Promise.resolve(jbcoinAPI[fnName](...args))
        .then(res => callback(null, res))
        .catch(err => {
          callback({code: 99, message: err.message, data: {name: err.name}})
        })
    } catch (err) {
      callback({code: 99, message: err.message, data: {name: err.name}})
    }
  }

  const methods = {}
  _.forEach(methodNames, fn => {
    // @ts-ignore
    methods[fn] = jayson.Method((args, cb) => {
      applyPromiseWithCallback(fn, cb, args)
    }, {collect: true})
  })

  // @ts-ignore
  const server = jayson.server(methods)
  let httpServer = null

  return {
    server: server,
    start: function() {
      if (httpServer !== null) {
        return Promise.reject('Already started')
      }
      return new Promise(resolve => {
        jbcoinAPI.connect().then(() => {
          httpServer = server.http()
          httpServer.listen(httpPort, resolve)
        })
      })
    },
    stop: function() {
      if (httpServer === null) {
        return Promise.reject('Not started')
      }
      return new Promise<void>(resolve => {
        jbcoinAPI.disconnect()
        httpServer.close(() => {
          httpServer = null
          resolve()
        })
      })
    }
  }
}

export {
  createHTTPServer
}
