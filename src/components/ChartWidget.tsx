// Widget de gráfico para dashboards
import React from "react";
interface ChartWidgetProps {
  title: string;
  data: any[];
}
const ChartWidget: React.FC<ChartWidgetProps> = ({ title }) => (
  <div>
    <strong>{title}</strong>
    <div>Gráfico (pendiente de implementación)</div>
  </div>
);
export default ChartWidget;