import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Subject, Module, Lesson } from '../types';

export const useLearningData = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subjects
        const subjectsQuery = query(collection(db, 'subjects'), orderBy('order'));
        const subjectsSnapshot = await getDocs(subjectsQuery);
        const subjectsData: Subject[] = subjectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Subject));
        setSubjects(subjectsData);

        // Fetch modules
        const modulesQuery = query(collection(db, 'modules'), orderBy('order'));
        const modulesSnapshot = await getDocs(modulesQuery);
        const modulesData: Module[] = modulesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Module));
        setModules(modulesData);

        // Fetch lessons
        const lessonsQuery = query(collection(db, 'lessons'), orderBy('order'));
        const lessonsSnapshot = await getDocs(lessonsQuery);
        const lessonsData: Lesson[] = lessonsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Lesson));
        setLessons(lessonsData);
      } catch (error) {
        console.error('Error fetching learning data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getModulesForSubject = (subjectId: string) => {
    return modules.filter(m => m.subjectId === subjectId);
  };

  const getLessonsForModule = (moduleId: string) => {
    return lessons.filter(l => l.moduleId === moduleId);
  };

  return {
    subjects,
    modules,
    lessons,
    loading,
    getModulesForSubject,
    getLessonsForModule,
  };
};
