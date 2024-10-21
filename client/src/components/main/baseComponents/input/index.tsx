import React from 'react';
import './index.css';

/**
 * Interface representing the props for the Input component.
 *
 * - title - The label to display
 * - hint - An optional hint or description displayed below the title.
 * - id - The unique identifier for the input field.
 * - mandatory - Indicates whether the input field is required. Defaults to true.
 * - val - The current value of the input field.
 * - setState - Callback function to update the state with the input field's value.
 * - err - An optional error message to display if there is an error with the input.
 */
interface InputProps {
  title: string;
  hint?: string;
  id: string;
  mandatory?: boolean;
  val: string;
  setState: (value: string) => void;
  err?: string;
}

/**
 * Input component that renders a labeled text input field with optional hint and error message.
 * It also displays an asterisk if the field is mandatory.
 *
 * @param title The label for the input field.
 * @param hint Optional hint or description for the input field.
 * @param id The unique identifier for the input field.
 * @param mandatory Indicates if the input field is required. Defaults to true.
 * @param val The current value of the input field.
 * @param setState Callback function to update the value of the input field.
 * @param err Optional error message to display below the input field.
 */
const Input = ({ title, hint, id, mandatory = true, val, setState, err }: InputProps) => (
  <>
    <div className='input_title'>
      {title}
      {mandatory ? '*' : ''}
    </div>
    {hint && <div className='input_hint'>{hint}</div>}
    <input
      id={id}
      className='input_input'
      type='text'
      value={val}
      onInput={e => {
        setState(e.currentTarget.value);
      }}
    />
    {err && <div className='input_error'>{err}</div>}
  </>
);

export default Input;
