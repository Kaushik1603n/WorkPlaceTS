// hooks/useProject.ts
import { useState, useEffect, useCallback } from 'react';
import type{ Project } from '../project-submission/types/project';

export const useProject = (projectId: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/projects/${projectId}`);
      const data = await response.json();
      setProject(data);
    } catch (err) {
      setError('Failed to fetch project data');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const submitWork = async (milestoneId: number) => {
    try {
      await fetch(`/api/projects/${projectId}/submit-work`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId })
      });
      fetchProject(); // Refresh project data
    } catch (err) {
      setError('Failed to submit work');
    }
  };

  const requestPayment = async () => {
    try {
      await fetch(`/api/projects/${projectId}/request-payment`, {
        method: 'POST'
      });
      fetchProject(); // Refresh project data
    } catch (err) {
      setError('Failed to request payment');
    }
  };

  const requestExtension = async (newDeadline: string) => {
    try {
      await fetch(`/api/projects/${projectId}/extend-deadline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newDeadline })
      });
      fetchProject(); // Refresh project data
    } catch (err) {
      setError('Failed to request extension');
    }
  };

  const reportIssue = async (message: string) => {
    try {
      await fetch(`/api/projects/${projectId}/report-issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
    } catch (err) {
      setError('Failed to report issue');
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await fetch(`/api/projects/${projectId}/upload-file`, {
        method: 'POST',
        body: formData
      });
      fetchProject(); // Refresh project data
    } catch (err) {
      setError('Failed to upload file');
    }
  };

  return { 
    project, 
    loading, 
    error,
    actions: {
      submitWork,
      requestPayment,
      requestExtension,
      reportIssue,
      uploadFile
    },
    refresh: fetchProject
  };
};