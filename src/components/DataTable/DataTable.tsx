import type { ReactNode } from 'react';
import './data-table.css';

export interface Column {
  key: string;
  label: string;
  /** Right-aligns and sets tabular figures. Use for anything countable. */
  numeric?: boolean;
  /** Sets JetBrains Mono. Only where characters must line up: IDs, codes, hashes. */
  mono?: boolean;
}

export type Row = Record<string, ReactNode>;

export interface DataTableProps {
  columns: Column[];
  rows: Row[];
  /** Says where the numbers come from. Every table of real figures needs one. */
  caption?: string;
  /**
   * The table is wider than the page on a laptop, so it always scrolls
   * sideways and its header scrolls away with the page. Leave it off and the
   * table scrolls sideways only on phones, with a pinned header above 720px.
   */
  wide?: boolean;
}

export function DataTable({ columns, rows, caption, wide = false }: DataTableProps) {
  return (
    <div className={wide ? 'hub-table-scroll' : 'hub-table-scroll hub-table-scroll--narrow'}>
      <table className="hub-table">
        {caption ? <caption className="hub-table__caption">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={c.numeric ? 'is-num' : undefined}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={[c.numeric ? 'is-num' : null, c.mono ? 'is-mono' : null]
                    .filter(Boolean).join(' ') || undefined}
                >
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
