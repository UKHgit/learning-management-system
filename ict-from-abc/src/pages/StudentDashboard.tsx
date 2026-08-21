import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Video, FileText, Link as LinkIcon, 
  ChevronRight, LogOut, LayoutDashboard, User,
  PlayCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLearningData } from '../hooks/useLearningData';
import { SecureVideoPlayer } from '../components/SecureVideoPlayer';
import { ResourceCard } from '../components/ResourceCard';
import { AuthModal } from '../components/AuthModal';

export const StudentDashboard: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { subjects, modules, lessons, loading, getModulesForSubject, getLessonsForModule } = useLearningData();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const currentLesson = lessons.find(l => l.id === selectedLesson);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E63A12] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E63A12] to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ICT From ABC</h1>
                <p className="text-xs text-gray-500">Student Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isAdmin && (
                <a
                  href="/admin"
                  className="px-4 py-2 bg-[#E63A12] text-white rounded-full text-sm font-semibold hover:bg-orange-700 transition-colors"
                >
                  Admin Dashboard
                </a>
              )}
              
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-full">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user?.displayName || user?.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-[#E63A12] transition-colors"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Subjects & Modules */}
          <div className="lg:col-span-1 space-y-6">
            {/* Subjects */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#E63A12]" />
                Subjects
              </h2>
              
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => {
                      setSelectedSubject(subject.id);
                      setSelectedModule(null);
                      setSelectedLesson(null);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      selectedSubject === subject.id
                        ? 'bg-[#E63A12] text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    <div className="font-semibold">{subject.name}</div>
                    <div className={`text-xs mt-1 ${
                      selectedSubject === subject.id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {getModulesForSubject(subject.id).length} modules
                    </div>
                  </button>
                ))}
                
                {subjects.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No subjects available yet
                  </p>
                )}
              </div>
            </div>

            {/* Modules */}
            {selectedSubject && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-[#E63A12]" />
                  Modules
                </h2>
                
                <div className="space-y-2">
                  {getModulesForSubject(selectedSubject).map((module) => (
                    <button
                      key={module.id}
                      onClick={() => {
                        setSelectedModule(module.id);
                        setSelectedLesson(null);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        selectedModule === module.id
                          ? 'bg-[#E63A12] text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-orange-50'
                      }`}
                    >
                      <div className="font-semibold text-sm">{module.title}</div>
                      <div className={`text-xs mt-1 truncate ${
                        selectedModule === module.id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {getLessonsForModule(module.id).length} lessons
                      </div>
                    </button>
                  ))}
                  
                  {getModulesForSubject(selectedSubject).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No modules in this subject
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Main Content - Lessons */}
          <div className="lg:col-span-3">
            {selectedModule ? (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {modules.find(m => m.id === selectedModule)?.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {modules.find(m => m.id === selectedModule)?.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {getLessonsForModule(selectedModule).map((lesson, index) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ResourceCard
                          lesson={lesson}
                          onClick={() => setSelectedLesson(lesson.id)}
                        />
                      </motion.div>
                    ))}
                    
                    {getLessonsForModule(selectedModule).length === 0 && (
                      <p className="text-gray-500 text-center py-8 col-span-2">
                        No lessons in this module yet
                      </p>
                    )}
                  </div>
                </div>

                {/* Video Player Modal */}
                <AnimatePresence>
                  {currentLesson && currentLesson.type === 'video' && currentLesson.videoId && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                      onClick={() => setSelectedLesson(null)}
                    >
                      <div
                        className="w-full max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-white">
                            {currentLesson.title}
                          </h3>
                          <button
                            onClick={() => setSelectedLesson(null)}
                            className="text-white hover:text-[#E63A12] transition-colors"
                          >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <SecureVideoPlayer
                          videoId={currentLesson.videoId}
                          lessonId={currentLesson.id}
                          userId={user?.uid}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                <PlayCircle className="w-20 h-20 text-[#E63A12] mx-auto mb-6 opacity-50" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to Your Learning Portal
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Select a subject from the sidebar to start exploring modules and lessons.
                  Track your progress and access all learning resources.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};
