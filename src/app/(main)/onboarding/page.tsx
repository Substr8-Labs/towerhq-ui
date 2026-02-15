'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type OnboardingStep = {
  id: string;
  question: string;
  placeholder: string;
  field: string;
};

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'name',
    question: "First things first — what should we call you?",
    placeholder: "Your name",
    field: 'founderName',
  },
  {
    id: 'company',
    question: "What's the name of what you're building?",
    placeholder: "Company or project name",
    field: 'companyName',
  },
  {
    id: 'building',
    question: "In one or two sentences, what is it?",
    placeholder: "We're building...",
    field: 'whatBuilding',
  },
  {
    id: 'customer',
    question: "Who's your ideal customer?",
    placeholder: "Solo founders who...",
    field: 'targetCustomer',
  },
  {
    id: 'stage',
    question: "Where are you at?",
    placeholder: "",
    field: 'stage',
  },
  {
    id: 'blocker',
    question: "What's the one thing that's been stuck for more than a week?",
    placeholder: "The thing keeping me up at night...",
    field: 'biggestBlocker',
  },
];

const STAGES = [
  { value: 'idea', label: '💡 Idea stage', desc: 'Still exploring and validating' },
  { value: 'building', label: '🔨 Building', desc: 'Actively developing' },
  { value: 'launched', label: '🚀 Launched', desc: 'Live with early users' },
  { value: 'scaling', label: '📈 Scaling', desc: 'Growing and optimizing' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const isStageStep = step.id === 'stage';

  const handleNext = () => {
    if (!inputValue.trim() && !isStageStep) return;

    const newAnswers = {
      ...answers,
      [step.field]: inputValue,
    };
    setAnswers(newAnswers);
    setInputValue('');

    if (isLastStep) {
      submitOnboarding(newAnswers);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStageSelect = (stage: string) => {
    const newAnswers = {
      ...answers,
      stage,
    };
    setAnswers(newAnswers);
    setCurrentStep(currentStep + 1);
  };

  const submitOnboarding = async (finalAnswers: Record<string, string>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete onboarding');
      }

      // Redirect to main app
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="min-h-screen bg-[#313338] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex gap-1">
            {ONBOARDING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= currentStep ? 'bg-indigo-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Step {currentStep + 1} of {ONBOARDING_STEPS.length}
          </p>
        </div>

        {/* Question */}
        <div className="bg-[#2B2D31] rounded-lg p-8 shadow-xl">
          <h1 className="text-2xl font-semibold text-white mb-6">
            {step.question}
          </h1>

          {isStageStep ? (
            <div className="space-y-3">
              {STAGES.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() => handleStageSelect(stage.value)}
                  className="w-full p-4 bg-[#383A40] hover:bg-[#404249] rounded-lg text-left transition-colors"
                >
                  <span className="text-white font-medium">{stage.label}</span>
                  <span className="text-gray-400 text-sm ml-2">{stage.desc}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              {step.id === 'blocker' || step.id === 'building' ? (
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={step.placeholder}
                  className="w-full p-4 bg-[#383A40] text-white rounded-lg border-none outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={4}
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={step.placeholder}
                  className="w-full p-4 bg-[#383A40] text-white rounded-lg border-none outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              )}

              <div className="mt-6 flex justify-between items-center">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                )}
                <div className="flex-1" />
                <button
                  onClick={handleNext}
                  disabled={!inputValue.trim() || isSubmitting}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    inputValue.trim() && !isSubmitting
                      ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Creating your team...' : isLastStep ? 'Meet your team →' : 'Continue →'}
                </button>
              </div>
            </>
          )}

          {error && (
            <p className="mt-4 text-red-400 text-sm">{error}</p>
          )}
        </div>

        {/* Team preview */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Your AI C-Suite is waiting: Ada ✦ Grace 🚀 Tony 📣 Val 🛡️
          </p>
        </div>
      </div>
    </div>
  );
}
