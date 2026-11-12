import ActivityHeatmap from '@/components/ui/ActivityHeatmap';
import { mockActivity } from '@/lib/mockActivity';

export default function Fitness() {
  return (
    <div className="p-4">
      <ActivityHeatmap data={mockActivity} />
    </div>
  );
}
