'use client';

import { useEffect, useState } from 'react';

type WorkspaceFile = {
  id: string;
  path: string;
  content: string;
  updatedAt: string;
};

type WorkspaceData = {
  workspaceId?: string;
  onboardingComplete: boolean;
  files: WorkspaceFile[];
};

export default function WorkspacePage() {
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkspace();
  }, []);

  const fetchWorkspace = async () => {
    try {
      const response = await fetch('/api/workspace');
      const data = await response.json();
      setWorkspace(data);
      if (data.files.length > 0) {
        setSelectedFile(data.files[0].path);
      }
    } catch (err) {
      setError('Failed to load workspace');
    } finally {
      setLoading(false);
    }
  };

  const selectedContent = workspace?.files.find(f => f.path === selectedFile)?.content || '';

  // Group files by directory
  const groupedFiles = workspace?.files.reduce((acc, file) => {
    const parts = file.path.split('/');
    const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : 'root';
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(file);
    return acc;
  }, {} as Record<string, WorkspaceFile[]>) || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#313338] flex items-center justify-center">
        <p className="text-gray-400">Loading workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#313338] flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!workspace?.onboardingComplete) {
    return (
      <div className="min-h-screen bg-[#313338] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl text-white font-semibold mb-4">No workspace yet</h1>
        <p className="text-gray-400 mb-6">Complete onboarding to generate your workspace files.</p>
        <a
          href="/onboarding"
          className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium"
        >
          Start Onboarding →
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#313338] flex">
      {/* Sidebar - File Tree */}
      <div className="w-64 bg-[#2B2D31] border-r border-[#1E1F22] p-4 overflow-y-auto">
        <h2 className="text-white font-semibold mb-4">📁 Workspace Files</h2>
        
        {Object.entries(groupedFiles).map(([dir, files]) => (
          <div key={dir} className="mb-4">
            {dir !== 'root' && (
              <p className="text-gray-400 text-xs uppercase mb-2 px-2">{dir}</p>
            )}
            {files.map(file => {
              const fileName = file.path.split('/').pop();
              const isSelected = file.path === selectedFile;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file.path)}
                  className={`w-full text-left px-2 py-1 rounded text-sm mb-1 transition-colors ${
                    isSelected
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'text-gray-300 hover:bg-[#383A40]'
                  }`}
                >
                  📄 {fileName}
                </button>
              );
            })}
          </div>
        ))}

        <div className="mt-8 pt-4 border-t border-[#383A40]">
          <p className="text-gray-500 text-xs">
            {workspace.files.length} files generated
          </p>
        </div>
      </div>

      {/* Main - File Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl text-white font-semibold">
              {selectedFile || 'Select a file'}
            </h1>
            <span className="text-gray-500 text-sm">
              Read-only preview
            </span>
          </div>
          
          <div className="bg-[#2B2D31] rounded-lg p-6">
            <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {selectedContent || 'No content'}
            </pre>
          </div>

          <p className="text-gray-500 text-sm mt-4">
            These files are injected into persona prompts. They define who your C-Suite is and what they know about you.
          </p>
        </div>
      </div>
    </div>
  );
}
