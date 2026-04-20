export default function StatusBadge({ value }) {
  return <span className={`status-badge ${value}`}>{value.replace('_', ' ')}</span>;
}
