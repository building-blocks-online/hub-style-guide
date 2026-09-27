import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Icon } from '../Icon/Icon';
import './field.css';

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  /** Always visible, above the input. Never a placeholder standing in for a label. */
  label: string;
  /** Present from the start where a format matters, not revealed only on error. */
  help?: string;
  /** When set, the field shows the invalid treatment and `help` carries the fix. */
  invalid?: boolean;
  /** A Boxicons name for a leading icon, e.g. "search". Decoration: the label names the field. */
  icon?: string;
}

export function Field({ label, help, invalid, icon, className, ...rest }: FieldProps) {
  const id = useId();
  const helpId = help ? `${id}-help` : undefined;

  const input = (
    <input
      id={id}
      className="hub-input"
      aria-describedby={helpId}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );

  return (
    <div className={['hub-field', className].filter(Boolean).join(' ')} data-invalid={invalid || undefined}>
      <label className="hub-field__label" htmlFor={id}>{label}</label>
      {icon ? <span className="hub-input-wrap"><Icon name={icon} />{input}</span> : input}
      {help ? <p className="hub-field__help" id={helpId}>{help}</p> : null}
    </div>
  );
}
