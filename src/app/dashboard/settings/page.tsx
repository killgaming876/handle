import { DashboardShell } from '@/components/DashboardShell';
import { QualitySettings } from '@/components/QualitySettings';

export default function Page() {
  return <DashboardShell active="Settings"><QualitySettings /></DashboardShell>;
}
