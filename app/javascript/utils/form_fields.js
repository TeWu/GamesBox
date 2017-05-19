import React, { Component } from 'react'
import { capitalize } from 'utils/utils'


export const TextField = (props) => <InputWithLabel type="text" {...props} />
export const PasswordField = (props) => <InputWithLabel type="password" {...props} />

export const InputWithLabel = ({ label, type, name, defaultValue, errors }) => (
  <FormFieldContainer
    labelElem={<label for={name}>{label}</label>}
    fieldElem={
      <div class="input">
        <input {...{ type, name, defaultValue }} />
      </div>
    }
    errorElem={createErrorElem(label, errors)}
  />
)
InputWithLabel.defaultProps = {
  defaultValue: "",
  errors: []
}

export const CheckboxField = ({ label, name, values, isChecked, object, errors }) => {
  if (label == undefined) label = capitalize(name)
  const checkboxes = values.map((value, i) =>
    <span key={i} class="checkbox">
      <Checkbox isChecked={isChecked[i]} {...{ name, value, object }} />
    </span>
  )
  return <FormFieldContainer
    labelElem={<label>{label}</label>}
    fieldElem={<div class="input">{checkboxes}</div>}
    errorElem={createErrorElem(label, errors)}
  />
}
CheckboxField.defaultProps = {
  isChecked: [],
  errors: []
}

export const Checkbox = ({ label, id, name, value, isChecked, object }) => {
  if (id == undefined) id = `${name}_${value}`
  const defaultChecked = isChecked || (object && name in object && (typeof object[name].indexOf === 'function') && object[name].indexOf(value) !== -1)
  return (
    <label for={id}>
      <input type="checkbox" id={id} name={name} value={value} defaultChecked={defaultChecked} />{label || value}
    </label>
  )
}

function createErrorElem(label, errors) {
  const errorSpans = errors.map((error, i) => <span key={i} class="error">{label} {error}</span>)
  return <div class="errors">{errorSpans}</div>
}

export const FormFieldContainer = ({ labelElem, fieldElem, errorElem }) => (
  <dl class="field">
    <dt>{labelElem}</dt>
    <dd>
      {fieldElem}
      {errorElem}
    </dd>
  </dl>
)