/**
 *  MDX to reactElement Json,  reactElement Json to reactElement.
 * 
 *  eq, writing with MDX, stored with reactElement Json, and rendered with reactElement, a perfect way.
 */

import React from "react";
import { renderToString } from 'react-dom/server';
import parse from 'html-react-parser';

export function serialize(element) {
  const replacer = (key, value) => {
    switch (key) {
      case "_owner":
      case "_store":
      case "ref":
      case "key":
        return
      default:
        return value
    }
  }

  return JSON.stringify(parse(renderToString(element)), replacer)
}

export function deserialize(data, options) {
  if (typeof data === "string") {
    data = JSON.parse(data)
  }
  if (data instanceof Object) {
    return deserializeElement(data, options)
  }
  throw new Error("Deserialization error: incorrect data type")
}

function deserializeElement(element, options = {}, key) {
  let { components = {}, reviver } = options

  if (typeof element !== "object") {
    return element
  }

  if (element === null) {
    return element
  }

  if (element instanceof Array) {
    return element.map((el, i) => deserializeElement(el, options, i))
  }

  // Now element has following shape { type: string, props: object }

  let { type, props } = element

  if (typeof type !== "string") {
    throw new Error("Deserialization error: element type must be string")
  }

  type = components[type] || type.toLowerCase()

  if (props.children) {
    props = { ...props, children: deserializeElement(props.children, options) }
  }

  if (reviver) {
    ; ({ type, props, key, components } = reviver(type, props, key, components))
  }

  return React.createElement(type, { ...props, key })
}
