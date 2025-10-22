'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

interface LoginPromptProps {
  message?: string;
  ctaText?: string;
}

export function LoginPrompt({ 
  message = "Want to save this word and track your learning progress?",
  ctaText = "Sign up for free"
}: LoginPromptProps) {
  const router = useRouter();

  return (
    <div className="mt-8 p-8 bg-gradient-to-r from-purple-100 via-blue-100 to-green-100 rounded-xl border-2 border-purple-300">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          🎯 {message}
        </h3>
        <p className="text-gray-700 mb-6">
          Join thousands of learners who are mastering Chinese with our smart learning tools:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-white rounded-lg p-4">
            <div className="text-3xl mb-2">📚</div>
            <div className="font-semibold mb-1">Personal Word Bank</div>
            <div className="text-gray-600">Save and organize your vocabulary</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-3xl mb-2">🧠</div>
            <div className="font-semibold mb-1">Smart Review System</div>
            <div className="text-gray-600">Spaced repetition for better retention</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold mb-1">Progress Tracking</div>
            <div className="text-gray-600">Monitor your learning journey</div>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => router.push('/auth/signup')}
          >
            {ctaText}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => router.push('/auth/login')}
          >
            Already have an account?
          </Button>
        </div>
      </div>
    </div>
  );
}




