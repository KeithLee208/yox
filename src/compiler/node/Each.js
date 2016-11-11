
import Node from './Node'

import * as nodeType from '../nodeType'

import * as is from '../../util/is'
import * as array from '../../util/array'
import * as object from '../../util/object'
import * as syntax from '../../config/syntax'

/**
 * each 节点
 *
 * @param {string} name
 * @param {string} index
 */
export default class Each extends Node {

  constructor(name, index) {
    super()
    this.type = nodeType.EACH
    this.name = name
    this.index = index
  }

  render(data) {

    let instance = this
    let { name, index } = instance
    let { context, keys } = data

    let iterator = context.get(name)

    let each
    if (is.array(iterator)) {
      each = array.each
    }
    else if (is.object(iterator)) {
      each = object.each
    }

    if (each) {
      keys.push(name)
      each(
        iterator,
        function (item, i) {
          if (index) {
            context.set(index, i)
          }
          keys.push(i)
          context.set(syntax.SPECIAL_KEYPATH, keys.join('.'))
          instance.renderChildren(
            object.extend({}, data, { context: context.push(item) })
          )
          keys.pop()
        }
      )
      keys.pop()
    }

  }

}
