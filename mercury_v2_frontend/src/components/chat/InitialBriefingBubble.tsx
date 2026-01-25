import { useState } from 'react';
import type { DesignBriefUpdate } from '../../types/api/designBrief';
import { DesignBriefForm } from '../common/DesignBrief/DesignBriefForm';
import { Sparkles, Edit2, ArrowRight } from 'lucide-react';
import { mockDesignBrief } from '../../mocks/data/designBrief';

interface InitialBriefingBubbleProps {
  briefData?: DesignBriefUpdate;
  onSave?: (data: DesignBriefUpdate) => void;
}

export const InitialBriefingBubble = ({ 
  briefData = mockDesignBrief, 
  onSave 
}: InitialBriefingBubbleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState<DesignBriefUpdate>(briefData);

  const handleSave = (data: DesignBriefUpdate) => {
    setCurrentData(data);
    setIsEditing(false);
    if (onSave) {
      onSave(data);
    }
  };

  if (isEditing) {
    return (
      <div className="mt-3 bg-white rounded-lg border border-primary-200 shadow-primary p-1 max-w-md w-full">
        <DesignBriefForm
          initialData={currentData as any} // Type assertion for mock compatibility
          onSave={handleSave}
          className="max-h-[500px]"
        />
      </div>
    );
  }

  // Summary View
  const { concept_info, shoe_spec, marketing_context } = currentData;
  
  return (
    <div className="mt-3 bg-white rounded-lg border border-primary-100 shadow-sm p-4 max-w-sm w-full hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-primary-700 font-semibold">
          <Sparkles className="w-5 h-5 text-primary-500" />
          <span>Design Brief Proposed</span>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="text-gray-400 hover:text-primary-600 transition-colors"
          title="Edit Brief"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 text-sm text-gray-600 mb-4">
        {concept_info?.theme && (
          <div className="flex gap-2">
            <span className="font-medium min-w-[60px] text-gray-500">Theme:</span>
            <span className="text-gray-800">{concept_info.theme}</span>
          </div>
        )}
        {shoe_spec?.category && (
          <div className="flex gap-2">
            <span className="font-medium min-w-[60px] text-gray-500">Category:</span>
            <span className="text-gray-800">{shoe_spec.category}</span>
          </div>
        )}
        {marketing_context?.season && (
          <div className="flex gap-2">
            <span className="font-medium min-w-[60px] text-gray-500">Season:</span>
            <span className="text-gray-800">{marketing_context.season}</span>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsEditing(true)}
        className="w-full py-2 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
      >
        Review Details
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
