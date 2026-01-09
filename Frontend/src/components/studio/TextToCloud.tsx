import React, { useState } from 'react';
import { useStudioStore } from '@/store/useStore';
import { convertTextToCloud } from '@/lib/textToCloudService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

interface TextToCloudProps {
  className?: string;
}

const TextToCloud: React.FC<TextToCloudProps> = ({ className }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addNode, setNodes } = useStudioStore();

  const handleConvert = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter a description of your infrastructure');
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await convertTextToCloud(inputText);
      
      if (result.success && result.nodes.length > 0) {
        // Add the generated nodes to the existing nodes
        const existingNodes = useStudioStore.getState().nodes;
        const updatedNodes = [...existingNodes, ...result.nodes];
        
        setNodes(updatedNodes);
        
        toast.success(`Successfully created ${result.nodes.length} infrastructure components!`);
      } else {
        toast.error(result.message || 'Failed to generate infrastructure from your description');
      }
    } catch (error) {
      console.error('Error converting text to cloud:', error);
      toast.error('An error occurred while generating infrastructure');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleConvert();
    }
  };

  return (
    <div className={cn("p-4 bg-glass border border-glass-border rounded-xl", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Wand2 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-sm">AI Infrastructure Generator</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="infrastructure-description" className="text-xs text-muted-foreground">
            Describe your infrastructure
          </Label>
          <div className="relative mt-1">
            <Input
              id="infrastructure-description"
              placeholder="e.g., 'Create a secure web server with an S3 bucket for images'"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-10"
              disabled={isProcessing}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleConvert} 
          disabled={isProcessing || !inputText.trim()}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Infrastructure
            </>
          )}
        </Button>
      </div>
      
      <div className="mt-3 text-xs text-muted-foreground">
        <p className="mb-1">Examples:</p>
        <ul className="space-y-1">
          <li>• "Create a web server with a database"</li>
          <li>• "Build a secure VPC with EC2 instances"</li>
          <li>• "Set up S3 storage with CloudFront distribution"</li>
        </ul>
      </div>
    </div>
  );
};

export default TextToCloud;