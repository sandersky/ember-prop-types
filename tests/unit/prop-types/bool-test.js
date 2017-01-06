/**
 * Unit test for the PropTypes.bool validator
 */
import Ember from 'ember'
import SpreadMixin from 'ember-spread'
import {afterEach, beforeEach, describe} from 'mocha'
import sinon from 'sinon'

import {
  itValidatesOnUpdate,
  itValidatesTheProperty,
  spyOnValidateMethods
} from 'dummy/tests/helpers/validator'

import PropTypesMixin, {PropTypes} from 'ember-prop-types/mixins/prop-types'

const requiredDef = {
  required: true,
  type: 'bool'
}

const notRequiredDef = {
  isRequired: requiredDef,
  required: false,
  type: 'bool'
}

describe('Unit / validator / PropTypes.bool', function () {
  const ctx = {propertyName: 'bar'}
  let sandbox, Foo

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    spyOnValidateMethods(sandbox)
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('when required', function () {
    beforeEach(function () {
      ctx.def = requiredDef
      Foo = Ember.Object.extend(SpreadMixin, PropTypesMixin, {
        propTypes: {
          bar: PropTypes.bool.isRequired
        }
      })
    })

    describe('when initialized with boolean value', function () {
      beforeEach(function () {
        ctx.instance = Foo.create({bar: true})
      })

      itValidatesTheProperty(ctx, false)
      itValidatesOnUpdate(ctx, 'bool', 'Expected property bar to be a boolean')
    })

    describe('when initialized with number value', function () {
      beforeEach(function () {
        ctx.instance = Foo.create({bar: 1})
      })

      itValidatesTheProperty(ctx, false, 'Expected property bar to be a boolean')
      itValidatesOnUpdate(ctx, 'bool', 'Expected property bar to be a boolean')
    })

    describe('when initialized without value', function () {
      beforeEach(function () {
        ctx.instance = Foo.create()
      })

      itValidatesTheProperty(ctx, false, 'Missing required property bar')
      itValidatesOnUpdate(ctx, 'bool', 'Expected property bar to be a boolean')
    })

    describe('when initialized with boolean value via spread property', function () {
      beforeEach(function () {
        ctx.instance = Foo.create({
          options: {
            bar: true
          }
        })
        ctx.spread = true
      })

      itValidatesTheProperty(ctx, false)
      itValidatesOnUpdate(ctx, 'bool', 'Expected property bar to be a boolean')
    })

    describe('when initialized with number value via spread property', function () {
      beforeEach(function () {
        ctx.instance = Foo.create({
          options: {
            bar: 1
          }
        })
        ctx.spread = true
      })

      itValidatesTheProperty(ctx, false, 'Expected property bar to be a boolean')
      itValidatesOnUpdate(ctx, 'bool', 'Expected property bar to be a boolean')
    })

    describe('when initialized without value via spread property', function () {
      beforeEach(function () {
        ctx.instance = Foo.create({
          options: {}
        })
        ctx.spread = true
      })

      itValidatesTheProperty(ctx, false, 'Missing required property bar')
      itValidatesOnUpdate(ctx, 'bool', 'Expected property bar to be a boolean')
    })
  })

  describe('when not required', function () {
    beforeEach(function () {
      ctx.def = notRequiredDef
      Foo = Ember.Object.extend(SpreadMixin, PropTypesMixin, {
        propTypes: {
          bar: PropTypes.bool
        }
      })
    })

    describe('when initialized with boolean value', function () {
      beforeEach(function () {
        ctx.instance = Foo.create({bar: true})
      })

      itValidatesTheProperty(ctx, false)
      itValidatesOnUpdate(ctx, 'bool', 'Expected property bar to be a boolean')
    })

    describe('when initialized with number value', function () {
      beforeEach(function () {
        ctx.instance = Foo.create({bar: 1})
      })

      itValidatesTheProperty(ctx, false, 'Expected property bar to be a boolean')
      itValidatesOnUpdate(ctx, 'bool', 'Expected property bar to be a boolean')
    })

    describe('when initialized without value', function () {
      beforeEach(function () {
        ctx.instance = Foo.create()
      })

      itValidatesTheProperty(ctx, false)
      itValidatesOnUpdate(ctx, 'bool', 'Expected property bar to be a boolean')
    })

    describe('when initialized with boolean value via spread property', function () {
      beforeEach(function () {
        ctx.instance = Foo.create({
          options: {
            bar: true
          }
        })
        ctx.spread = true
      })

      itValidatesTheProperty(ctx, false)
      itValidatesOnUpdate(ctx, 'bool', 'Expected property bar to be a boolean')
    })

    describe('when initialized with number value via spread property', function () {
      beforeEach(function () {
        ctx.instance = Foo.create({
          options: {
            bar: 1
          }
        })
        ctx.spread = true
      })

      itValidatesTheProperty(ctx, false, 'Expected property bar to be a boolean')
      itValidatesOnUpdate(ctx, 'bool', 'Expected property bar to be a boolean')
    })

    describe('when initialized without value via spread property', function () {
      beforeEach(function () {
        ctx.instance = Foo.create({
          options: {}
        })
        ctx.spread = true
      })

      itValidatesTheProperty(ctx, false)
      itValidatesOnUpdate(ctx, 'bool', 'Expected property bar to be a boolean')
    })
  })
})
