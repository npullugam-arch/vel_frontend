export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted-text">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}