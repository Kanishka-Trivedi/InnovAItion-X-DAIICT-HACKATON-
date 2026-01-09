import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Cloud, Save, Play, Download, Share2 } from 'lucide-react';
import { GradientButton } from '@/components/ui/GradientButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useProjectStore, useStudioStore } from '@/store/useStore';
import { toast } from 'sonner';

const StudioHeader: React.FC = () => {
  const { projectId } = useParams();
  const { projects } = useProjectStore();
  const { syncStatus, terraformCode, nodes } = useStudioStore();
  
  const project = projects.find((p) => p.id === projectId);
  
  const handleSave = () => {
    toast.success('Project saved successfully');
  };
  
  const handleDeploy = () => {
    toast.info('Deployment started...');
    setTimeout(() => {
      toast.success('Infrastructure deployed successfully!');
    }, 2000);
  };
  
  const handleExport = () => {
    const blob = new Blob([terraformCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.tf';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Terraform file exported');
  };
  
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-14 bg-background border-b border-glass-border flex items-center justify-between px-4 shrink-0"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-glass/50 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Cloud className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">
              {project?.name || 'Untitled Project'}
            </h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{nodes.length} resources</span>
              <span>•</span>
              <StatusBadge 
                variant={syncStatus === 'synced' ? 'success' : 'warning'} 
                size="sm"
              >
                {syncStatus}
              </StatusBadge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleExport}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-glass/50 rounded-lg transition-all"
        >
          <Download className="w-4 h-4" />
        </button>
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-glass/50 rounded-lg transition-all">
          <Share2 className="w-4 h-4" />
        </button>
        <GradientButton variant="secondary" size="sm" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
          Save
        </GradientButton>
        <GradientButton size="sm" icon={<Play className="w-4 h-4" />} onClick={handleDeploy}>
          Deploy
        </GradientButton>
      </div>
    </motion.header>
  );
};

export default StudioHeader;
