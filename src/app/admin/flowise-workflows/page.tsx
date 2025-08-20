import FlowiseWorkflowManager from '@/components/flowise-workflow-manager';
import MainLayout from '@/components/layout/MainLayout';

export default function FlowiseWorkflowsPage() {
  return (
    <MainLayout currentPath="/admin/flowise-workflows">
      <div className="container mx-auto px-4 py-8">
        <FlowiseWorkflowManager />
      </div>
    </MainLayout>
  );
}

// Force recompile