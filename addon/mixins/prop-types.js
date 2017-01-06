/**
 * The PropTypesMixin definition
 */
import Ember from 'ember'
const {Mixin, get, getWithDefault, typeOf} = Ember
import config from 'ember-get-config'

import PropTypes, {logger, validators} from '../utils/prop-types'

export const settings = {
  spreadProperty: get(config, 'ember-prop-types.spreadProperty'),
  throwErrors: getWithDefault(config, 'ember-prop-types.throwErrors', false),
  validateOnUpdate: getWithDefault(config, 'ember-prop-types.validateOnUpdate', false)
}

export const helpers = {
  getMergedPropTypes (ctx) {
    const concatenatedPropTypes = get(ctx, 'propTypes')
    const mergedPropTypes = {}

    if (typeOf(concatenatedPropTypes) === 'array') {
      concatenatedPropTypes.forEach((propTypes) => {
        Object.keys(propTypes).forEach((propName) => {
          mergedPropTypes[propName] = propTypes[propName]
        })
      })
    }

    return mergedPropTypes
  },

  handleError (ctx, message) {
    logger.warn(ctx, message, settings.throwErrors)
  },

  spreadPropertyObserver () {
    const spread = get(this, settings.spreadProperty)

    if (typeOf(spread) !== 'object') {
      return
    }

    const propTypes = helpers.getMergedPropTypes(this)

    Object.keys(spread)
      .forEach((name) => {
        const def = propTypes[name]

        if (def === undefined) {
          helpers.handleError(this, `propType for ${name} is unknown`)
          return
        }

        helpers.validateProperty(this, name, def)
      })
  },

  /* eslint-disable complexity */
  validateProperty (ctx, name, def) {
    let value = get(ctx, name)

    if (value === undefined && settings.spreadProperty) {
      value = get(ctx, `${settings.spreadProperty}.${name}`)
    }

    if (value === undefined) {
      if (!def.required) {
        return
      }

      helpers.handleError(ctx, `Missing required property ${name}`)

      return
    }

    if (def.type in validators) {
      validators[def.type](ctx, name, value, def, true, settings.throwErrors)
    } else {
      helpers.handleError(ctx, `Unknown propType ${def.type}`)
    }
  },
  /* eslint-enable complexity */

  validatePropTypes (ctx) {
    if (!config || config.environment === 'production') {
      return
    }

    if (settings.spreadProperty) {
      ctx.addObserver(settings.spreadProperty, ctx, helpers.spreadPropertyObserver)
    }

    const propTypes = helpers.getMergedPropTypes(ctx)

    Object.keys(propTypes).forEach((name) => {
      const def = propTypes[name]

      if (def === undefined) {
        helpers.handleError(ctx, `propType for ${name} is unknown`)
        return
      }

      if (settings.validateOnUpdate) {
        ctx.addObserver(name, ctx, function () {
          helpers.validateProperty(this, name, def)
        })
      }

      helpers.validateProperty(ctx, name, def)
    })
  }
}

export default Mixin.create({
  concatenatedProperties: ['propTypes', 'getDefaultProps'],

  getDefaultProps () {
    // Maintain compatibility for 2.x users calling this._super
    return {}
  },

  init () {
    helpers.validatePropTypes(this)

    const keys = Object.keys(this)
    const defaults = this.get('getDefaultProps')
    defaults.forEach((propsFunction) => {
      if (typeOf(propsFunction) !== 'function') {
        return
      }

      const defaultProps = propsFunction.apply(this)
      keys.forEach((key) => {
        if (this.get(key) !== undefined) {
          delete defaultProps[key]
        }
      })

      this.setProperties(defaultProps)
    })
    this._super(...arguments)
  }
})

export {PropTypes}
