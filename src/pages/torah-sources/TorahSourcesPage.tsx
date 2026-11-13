import {
  ModulePreview,
  type ModulePageProps,
} from '../../components/ModulePreview';

export function TorahSourcesPage({ module }: ModulePageProps) {
  return <ModulePreview module={module} />;
}
