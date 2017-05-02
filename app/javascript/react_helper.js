import React from 'react'
import ReactDOM from 'react-dom'


const components = requireAndRegister(
  'application/main_app',
)


function requireAndRegister(...componentPaths) {
  return componentPaths.reduce((map, path) => {
    const name = pathToClassName(path)
    const ctor = require('./' + path).default
    map[name] = ctor
    return map
  }, {})
}

function pathToClassName(path) {
  const parts = path.split('/')
  const lastPart = parts[parts.length - 1]
  return capitalize(snakeToCamelCase(lastPart))
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
function snakeToCamelCase(s) {
  return s.replace(/([_\-]\w)/g, (m) => m[1].toUpperCase())
}

function mountReactComponent(componentName, elemId, componentProps) {
  document.addEventListener('DOMContentLoaded', () => {
    const elem = document.getElementById(elemId)
    const component = React.createElement(components[componentName], componentProps)
    ReactDOM.render(component, elem)
  })
}


window.mountReactComponent = mountReactComponent