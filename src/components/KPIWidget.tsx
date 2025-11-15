// Widget de KPI para dashboards
import React from "react";
interface KPIWidgetProps {
  title: string;
  value: number | string;
}
const KPIWidget: React.FC<KPIWidgetProps> = ({ title, value }) => (
  <div>
    <strong>{title}:</strong> {value}
  </div>
);
export default KPIWidget;