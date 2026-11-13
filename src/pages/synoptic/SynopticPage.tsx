import { Link } from 'react-router-dom';
import { Comparison } from '../../components/Comparison';
import {
  ModulePreview,
  type ModulePageProps,
} from '../../components/ModulePreview';
import { storm } from '../../content';
import { pages } from '../../content/pages';

export function SynopticPage({ module }: ModulePageProps) {
  return (
    <ModulePreview module={module} method={pages.preview.synoptic}>
      <p className="muted">
        This is a preview. One comparison is available. More passages will be
        added later.
      </p>
      <Link className="button primary" to="/compare/calming-the-storm">
        Compare the calming of the storm
      </Link>
    </ModulePreview>
  );
}

export function StormComparisonPage() {
  return <Comparison comparison={storm} copy={pages.comparison} />;
}
