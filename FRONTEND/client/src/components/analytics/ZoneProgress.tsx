interface Props {
  label: string;
  percent: number;
  color: string;
}

const ZoneProgress = ({ label, percent, color }: Props) => {
  return (
    <div style={{ marginBottom: 18 }}>
      <div className="zone-row">
        <span>{label}</span>
        <span style={{ color }}>{percent}%</span>
      </div>

      <div className="zone-progress">
        <div
          className="zone-progress-fill"
          style={{
            width: `${percent}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
};

export default ZoneProgress;
