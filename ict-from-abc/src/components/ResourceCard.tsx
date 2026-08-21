import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, Link as LinkIcon } from 'lucide-react';
import { Lesson } from '../types';

interface ResourceCardProps {
  lesson: Lesson;
  onClick?: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ lesson, onClick }) => {
  const getIcon = () => {
    switch (lesson.type) {
      case 'video':
        return <Video className="w-8 h-8 text-[#E63A12]" />;
      case 'pdf':
        return <FileText className="w-8 h-8 text-[#E63A12]" />;
      case 'assignment':
        return <BookOpen className="w-8 h-8 text-[#E63A12]" />;
      case 'zoom':
        return <LinkIcon className="w-8 h-8 text-[#E63A12]" />;
      default:
        return <BookOpen className="w-8 h-8 text-[#E63A12]" />;
    }
  };

  const getTypeLabel = () => {
    switch (lesson.type) {
      case 'video':
        return 'Video Lesson';
      case 'pdf':
        return 'PDF Tutorial';
      case 'assignment':
        return 'Assignment';
      case 'zoom':
        return 'Live Session';
      default:
        return 'Lesson';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 cursor-pointer hover:shadow-xl hover:border-[#E63A12] transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-orange-100 text-[#E63A12] text-xs font-semibold rounded-full uppercase tracking-wide">
              {getTypeLabel()}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
            {lesson.title}
          </h3>
          
          {lesson.content && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {lesson.content}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {lesson.viewCount !== undefined && (
              <span>{lesson.viewCount} views</span>
            )}
            <span>Order #{lesson.order}</span>
          </div>
        </div>
      </div>

      {lesson.type === 'pdf' && lesson.pdfUrl && (
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={lesson.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#E63A12] text-white rounded-full text-sm font-semibold hover:bg-orange-700 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <FileText size={16} />
          Download PDF
        </motion.a>
      )}

      {lesson.type === 'zoom' && lesson.zoomLink && (
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={lesson.zoomLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#E63A12] text-white rounded-full text-sm font-semibold hover:bg-orange-700 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <LinkIcon size={16} />
          Join Session
        </motion.a>
      )}

      {lesson.type === 'assignment' && lesson.assignmentLink && (
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={lesson.assignmentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#E63A12] text-white rounded-full text-sm font-semibold hover:bg-orange-700 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <BookOpen size={16} />
          View Assignment
        </motion.a>
      )}
    </motion.div>
  );
};
