const columns = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // top header, Jan to Dec
const rows = ['', 'Mon', '', 'Wed', '', 'Fri', '']; // left header
const WEEKS_PER_MONTH = 5; // each month header spans this many week columns
export type Day = { date: string; count: number }; // date: 'YYYY-MM-DD'

const DAY_MS = 86_400_000;

// Count for one cell. Each month block starts on the Sunday on/before the 1st.
// Returns undefined for days that belong to another month (empty cell).
function decorateCell(counts: Record<string, number>, year: number, month: number, week: number, day: number) {
  const first = new Date(Date.UTC(year, month, 1));
  const date = new Date(first.getTime() + (week * 7 + day - first.getUTCDay()) * DAY_MS);
  if (date.getUTCMonth() !== month) return undefined;
  return counts[date.toISOString().slice(0, 10)] ?? 0;
}

// Cell background for a count: none / 0 / low / medium / high
function colorFor(count: number | undefined) {
  if (count === undefined || count === 0) return 'rgba(128, 128, 128, 0.3)'; // day of another month
  if (count <= 1) return '#fed7aa';
  if (count <= 2) return '#fdba74';
  if (count <= 3) return '#fb923c';
  return '#ea580c';
}

// Current month +-3 (7 months). Date.UTC rolls month -2 back to Nov of last year, 12 to Jan of next.
function getDisplayMonths() {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const first = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 3 + i, 1));
    const month = first.getUTCMonth();
    return { label: columns[month], year: first.getUTCFullYear(), month };
  });
}

export default function ActivityHeatmap({ data }: { data: Day[] }) {
  const counts = Object.fromEntries(data.map((d) => [d.date, d.count])); // { '2026-01-03': 2, ... }
  const months = getDisplayMonths();

  return (
    <div style={{border: '1px solid gray', padding: '10px', display: 'inline-block', borderRadius: '8px', fontFamily: 'sans-serif', fontSize: '12px'}}>
      <table style={{ borderCollapse: 'separate', borderSpacing: '4px' }}>
        <thead>
          <tr>
            <td></td>
            {months.map(({ label, year, month }) => (
              <th key={`${year}-${month}`} scope="col" colSpan={WEEKS_PER_MONTH} style={{textAlign: 'start'}}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <th scope="row">{row}</th>
              {months.flatMap(({ year, month }) =>
                Array.from({ length: WEEKS_PER_MONTH }, (_, week) => {
                  const count = decorateCell(counts, year, month, week, i);
                  return (
                    <td key={`${year}-${month}-${week}`} style={{ borderRadius: '4px', backgroundColor: colorFor(count), minWidth: '18px', height: '18px', textAlign: 'center' }}>
                      {/* {count} */}
                    </td>
                  );
                }),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
