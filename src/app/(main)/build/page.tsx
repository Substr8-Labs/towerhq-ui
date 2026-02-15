'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Sparkles, Download } from 'lucide-react';

const AUTOFORGE_API = process.env.NEXT_PUBLIC_AUTOFORGE_API_URL || 'http://localhost:8420';

interface ForgeJob {
  id: string;
  status: 'queued' | 'running' | 'complete' | 'failed';
  progress: number;
  currentStep: string | null;
  steps: { name: string; status: string; timestamp: string }[];
  error?: string;
}

interface BuildStep {
  name: string;
  label: string;
  icon: string;
}

const BUILD_STEPS: BuildStep[] = [
  { name: 'architect', label: 'Analyzing requirements', icon: '🔍' },
  { name: 'planner', label: 'Planning features', icon: '📋' },
  { name: 'executor', label: 'Generating code', icon: '⚡' },
  { name: 'validator', label: 'Building & validating', icon: '🔨' },
  { name: 'complete', label: 'Complete', icon: '✅' },
];

export default function BuildPage() {
  const [brief, setBrief] = useState('');
  const [job, setJob] = useState<ForgeJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [artifacts, setArtifacts] = useState<{ files: string[] } | null>(null);

  const startBuild = useCallback(async () => {
    if (!brief.trim()) return;
    
    setLoading(true);
    setJob(null);
    setArtifacts(null);
    
    try {
      // Start the job
      const response = await fetch(`${AUTOFORGE_API}/api/forge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, type: 'landing_page' }),
      });
      
      if (!response.ok) throw new Error('Failed to start build');
      
      const jobData = await response.json();
      setJob(jobData);
      
      // Poll for updates
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`${AUTOFORGE_API}/api/forge/${jobData.id}`);
          const status = await statusResponse.json();
          setJob(status);
          
          if (status.status === 'complete' || status.status === 'failed') {
            clearInterval(pollInterval);
            setLoading(false);
            
            if (status.status === 'complete') {
              // Fetch artifacts
              const artifactsResponse = await fetch(`${AUTOFORGE_API}/api/forge/${jobData.id}/artifacts`);
              const artifactsData = await artifactsResponse.json();
              setArtifacts({ files: Object.keys(artifactsData.files || {}) });
            }
          }
        } catch (e) {
          console.error('Poll error:', e);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Build error:', error);
      setLoading(false);
    }
  }, [brief]);

  const getStepStatus = (stepName: string) => {
    if (!job) return 'pending';
    
    const step = job.steps.find(s => s.name === stepName);
    if (step?.status === 'done') return 'complete';
    if (job.currentStep === stepName) return 'running';
    
    const currentIndex = BUILD_STEPS.findIndex(s => s.name === job.currentStep);
    const stepIndex = BUILD_STEPS.findIndex(s => s.name === stepName);
    
    if (stepIndex < currentIndex) return 'complete';
    return 'pending';
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            AutoForge Build
          </h1>
          <p className="text-zinc-400 mt-1">
            Describe what you want to build. I'll generate working code.
          </p>
        </div>

        {/* Input */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100">What do you want to build?</CardTitle>
            <CardDescription>
              Be specific about features, style, and functionality.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: A landing page for DataPulse, a real-time analytics dashboard for developers. Modern dark theme with purple accents. Include hero section with headline and CTA, 3 feature cards, and a pricing section with 3 tiers."
              className="min-h-[120px] bg-zinc-800 border-zinc-700 text-zinc-100"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            />
            <Button
              onClick={startBuild}
              disabled={loading || !brief.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Building...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Build
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Progress */}
        {job && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-zinc-100">Build Progress</CardTitle>
                <Badge variant={job.status === 'complete' ? 'default' : 'secondary'}>
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Progress bar */}
              <div className="w-full bg-zinc-800 rounded-full h-2 mb-6">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${job.progress}%` }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {BUILD_STEPS.map((step) => {
                  const status = getStepStatus(step.name);
                  return (
                    <div
                      key={step.name}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        status === 'running' ? 'bg-purple-900/30 border border-purple-500/50' :
                        status === 'complete' ? 'bg-zinc-800/50' :
                        'bg-zinc-800/20'
                      }`}
                    >
                      {status === 'complete' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : status === 'running' ? (
                        <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-zinc-600" />
                      )}
                      <span className="text-lg">{step.icon}</span>
                      <span className={`flex-1 ${
                        status === 'pending' ? 'text-zinc-500' : 'text-zinc-200'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Error */}
              {job.error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="text-red-200">{job.error}</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Artifacts */}
        {artifacts && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-zinc-100">Generated Artifacts</CardTitle>
                <Badge variant="default" className="bg-green-600">
                  {artifacts.files.filter(f => !f.startsWith('.next/')).length} files
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {artifacts.files
                  .filter(f => !f.startsWith('.next/') && !f.includes('node_modules'))
                  .map((file) => (
                    <div
                      key={file}
                      className="flex items-center gap-2 p-2 rounded bg-zinc-800/50 text-sm"
                    >
                      <span className="text-zinc-400">📄</span>
                      <span className="text-zinc-200 font-mono">{file}</span>
                    </div>
                  ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
