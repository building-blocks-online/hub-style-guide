import { Fragment } from 'react';
import { Icon } from '../Icon/Icon';
import './flow-diagram.css';

export interface FlowStep {
  name: string;
  /** One short line on what happens here. */
  note?: string;
  /** The node the reader is looking at. Inverted to ink. At most one. */
  current?: boolean;
  /** State rides on the left edge, as everywhere else. Never a filled node. */
  tone?: 'success' | 'warning';
}

export interface FlowDiagramProps {
  steps: FlowStep[];
  /** Names the diagram for screen readers. */
  label: string;
  /** Says what the reader should take from it. */
  caption?: string;
  /** For a cycle: where it goes back to, said in words under the row. */
  loopsTo?: string;
}

/**
 * For explaining, not editing: how an app fits the family, how a run moves,
 * how a grade is earned. Five nodes at most; more than that is a canvas.
 */
export function FlowDiagram({ steps, label, caption, loopsTo }: FlowDiagramProps) {
  return (
    <figure className="hub-flow-figure">
      <ol className="hub-flow" aria-label={label}>
        {steps.map((s, i) => (
          <Fragment key={s.name}>
            {i > 0 ? <li className="hub-flow__edge" aria-hidden="true" /> : null}
            <li className="hub-flow__node" aria-current={s.current ? 'step' : undefined} data-tone={s.tone}>
              <span className="hub-flow__name">{s.name}</span>
              {s.note ? <span className="hub-flow__note">{s.note}</span> : null}
            </li>
          </Fragment>
        ))}
      </ol>
      {loopsTo ? <p className="hub-flow__loop"><Icon name="revision" />Then back to {loopsTo}</p> : null}
      {caption ? <figcaption className="hub-flow__caption">{caption}</figcaption> : null}
    </figure>
  );
}
