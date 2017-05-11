import React, { Component } from 'react'


export const InputWithLabel = ({ label, type, name, defaultValue, errors }) => (
  <dl class="field">
    <dt><label for={name}>{label}</label></dt>
    <dd>
      <div class="input">
        <input type={type} name={name} defaultValue={defaultValue} />
      </div>
      <div class="errors">
        {errors.map((error, i) => <span key={i} class="error">{label} {error}</span>)}
      </div>
    </dd>
  </dl>
)
InputWithLabel.defaultProps = {
  defaultValue: "",
  errors: []
}

export const TextField = (props) => <InputWithLabel type="text" {...props} />
export const PasswordField = (props) => <InputWithLabel type="password" {...props} />
