import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, BookOpen, Video, FileText, 
  Plus, Edit, Trash2, LogOut, User, Activity, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Subject, Module, Lesson } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user, logout, isAdmin, onlineCount } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'modules' | 'lessons'>('overview');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'subject' | 'module' | 'lesson' | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Check admin access
    if (!isAdmin) {
      navigate('/');
      return;
    }

    // Real-time listeners for data
    const unsubscribeSubjects = onSnapshot(collection(db, 'subjects'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject));
      setSubjects(data);
    });

    const unsubscribeModules = onSnapshot(collection(db, 'modules'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module));
      setModules(data);
    });

    const unsubscribeLessons = onSnapshot(collection(db, 'lessons'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
      setLessons(data);
    });

    return () => {
      unsubscribeSubjects();
      unsubscribeModules();
      unsubscribeLessons();
    };
  }, [isAdmin, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (formType === 'subject') {
        await addDoc(collection(db, 'subjects'), {
          name: formData.name,
          description: formData.description || '',
          order: subjects.length + 1,
        });
      } else if (formType === 'module') {
        await addDoc(collection(db, 'modules'), {
          subjectId: formData.subjectId,
          title: formData.title,
          description: formData.description || '',
          order: modules.filter(m => m.subjectId === formData.subjectId).length + 1,
        });
      } else if (formType === 'lesson') {
        await addDoc(collection(db, 'lessons'), {
          moduleId: formData.moduleId,
          title: formData.title,
          type: formData.type,
          videoId: formData.videoId || '',
          pdfUrl: formData.pdfUrl || '',
          zoomLink: formData.zoomLink || '',
          assignmentLink: formData.assignmentLink || '',
          content: formData.content || '',
          order: lessons.filter(l => l.moduleId === formData.moduleId).length + 1,
          viewCount: 0,
        });
      }
      
      setShowForm(false);
      setFormData({});
      setFormType(null);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  if (!isAdmin) {
    return null;
  }

  const totalViews = lessons.reduce((sum, lesson) => sum + (lesson.viewCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E63A12] to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">ICT From ABC - Content Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-semibold">{onlineCount} online</span>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-full">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
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
        {/* Stats Overview */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#E63A12]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{subjects.length}</div>
                    <div className="text-sm text-gray-600">Subjects</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{modules.length}</div>
                    <div className="text-sm text-gray-600">Modules</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{lessons.length}</div>
                    <div className="text-sm text-gray-600">Lessons</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{totalViews}</div>
                    <div className="text-sm text-gray-600">Total Views</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => { setFormType('subject'); setShowForm(true); }}
                  className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
                >
                  <Plus className="w-6 h-6 text-[#E63A12]" />
                  <span className="font-semibold text-gray-900">Add Subject</span>
                </button>
                
                <button
                  onClick={() => { setFormType('module'); setShowForm(true); }}
                  className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                >
                  <Plus className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-gray-900">Add Module</span>
                </button>
                
                <button
                  onClick={() => { setFormType('lesson'); setShowForm(true); }}
                  className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                >
                  <Plus className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold text-gray-900">Add Lesson</span>
                </button>
              </div>
            </div>

            {/* Recent Content */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Content Overview</h2>
              
              <div className="space-y-6">
                {subjects.map((subject) => (
                  <div key={subject.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900">{subject.name}</h3>
                      <button
                        onClick={() => handleDelete('subjects', subject.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {modules.filter(m => m.subjectId === subject.id).map((module) => (
                        <div key={module.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div>
                            <div className="font-medium text-gray-900">{module.title}</div>
                            <div className="text-sm text-gray-600">
                              {lessons.filter(l => l.moduleId === module.id).length} lessons
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete('modules', module.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Form Modal */}
        {showForm && formType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Add {formType.charAt(0).toUpperCase() + formType.slice(1)}
                </h2>
                <button
                  onClick={() => { setShowForm(false); setFormType(null); setFormData({}); }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {formType === 'subject' && (
                  <>
                    <input
                      type="text"
                      placeholder="Subject Name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63A12]"
                      required
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63A12]"
                      rows={3}
                    />
                  </>
                )}

                {formType === 'module' && (
                  <>
                    <select
                      value={formData.subjectId || ''}
                      onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63A12]"
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Module Title"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63A12]"
                      required
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63A12]"
                      rows={3}
                    />
                  </>
                )}

                {formType === 'lesson' && (
                  <>
                    <select
                      value={formData.moduleId || ''}
                      onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63A12]"
                      required
                    >
                      <option value="">Select Module</option>
                      {modules.map(m => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Lesson Title"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63A12]"
                      required
                    />
                    <select
                      value={formData.type || 'video'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63A12]"
                    >
                      <option value="video">Video</option>
                      <option value="pdf">PDF</option>
                      <option value="assignment">Assignment</option>
                      <option value="zoom">Zoom Session</option>
                    </select>
                    
                    {formData.type === 'video' && (
                      <input
                        type="text"
                        placeholder="YouTube Video ID (e.g., dQw4w9WgXcQ)"
                        value={formData.videoId || ''}
                        onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63A12]"
                      />
                    )}
                    
                    {formData.type === 'pdf' && (
                      <input
                        type="url"
                        placeholder="PDF URL"
                        value={formData.pdfUrl || ''}
                        onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63A12]"
                      />
                    )}
                    
                    {formData.type === 'zoom' && (
                      <input
                        type="url"
                        placeholder="Zoom Meeting Link"
                        value={formData.zoomLink || ''}
                        onChange={(e) => setFormData({ ...formData, zoomLink: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63A12]"
                      />
                    )}
                    
                    {formData.type === 'assignment' && (
                      <input
                        type="url"
                        placeholder="Assignment Link"
                        value={formData.assignmentLink || ''}
                        onChange={(e) => setFormData({ ...formData, assignmentLink: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63A12]"
                      />
                    )}
                    
                    <textarea
                      placeholder="Additional Content/Notes"
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63A12]"
                      rows={3}
                    />
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#E63A12] text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                >
                  Add {formType.charAt(0).toUpperCase() + formType.slice(1)}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
