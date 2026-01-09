import React from 'react';
import { motion } from 'framer-motion';
import StudioHeader from '@/components/studio/StudioHeader';
import AWSSidebar from '@/components/studio/AWSSidebar';
import DiagramCanvas from '@/components/studio/DiagramCanvas';
import TerraformEditor from '@/components/studio/TerraformEditor';

const Studio: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-screen flex flex-col bg-background overflow-hidden"
    >
      <StudioHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <AWSSidebar />
        <DiagramCanvas />
        <TerraformEditor />
      </div>
    </motion.div>
  );
};

export default Studio;
