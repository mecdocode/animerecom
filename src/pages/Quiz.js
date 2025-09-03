import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Heart, Zap, Clock, Shield, Target } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const Quiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      id: 'vibe',
      title: 'What vibe are you feeling?',
      icon: Heart,
      type: 'single',
      options: [
        { value: 'wholesome', label: 'Wholesome & Heartwarming', emoji: '🌸' },
        { value: 'action', label: 'Action & Adventure', emoji: '⚔️' },
        { value: 'mystery', label: 'Mystery & Thriller', emoji: '🔍' },
        { value: 'scifi', label: 'Sci-Fi & Fantasy', emoji: '🚀' },
        { value: 'romance', label: 'Romance & Drama', emoji: '💕' },
        { value: 'comedy', label: 'Comedy & Fun', emoji: '😄' }
      ]
    },
    {
      id: 'pace',
      title: 'What\'s your preferred pace?',
      icon: Zap,
      type: 'slider',
      min: 1,
      max: 5,
      labels: ['Slow & Relaxing', 'Moderate', 'Fast-Paced']
    },
    {
      id: 'era',
      title: 'Classic or modern anime?',
      icon: Clock,
      type: 'slider',
      min: 1995,
      max: 2024,
      labels: ['Classic (90s-2000s)', 'Mixed', 'Modern (2010s+)']
    },
    {
      id: 'violence',
      title: 'Content comfort level?',
      icon: Shield,
      type: 'single',
      options: [
        { value: 'low', label: 'Light & Family-Friendly', emoji: '🌈' },
        { value: 'medium', label: 'Some Action & Violence', emoji: '⚡' },
        { value: 'high', label: 'Intense & Mature Themes', emoji: '🔥' }
      ]
    },
    {
      id: 'focus',
      title: 'What draws you in most?',
      icon: Target,
      type: 'single',
      options: [
        { value: 'character', label: 'Character Development', emoji: '👥' },
        { value: 'world', label: 'World Building', emoji: '🌍' },
        { value: 'plot', label: 'Plot Twists', emoji: '🎭' },
        { value: 'visual', label: 'Visual Spectacle', emoji: '✨' }
      ]
    }
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    const question = questions[currentQuestion];
    if (!answers[question.id]) {
      toast.warning('Please answer the question before continuing!');
      return;
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Navigate to recommendations with quiz answers
      navigate('/recommend', { 
        state: { 
          type: 'quiz', 
          data: answers 
        } 
      });
    } catch (error) {
      toast.error('Failed to process your answers. Please try again.');
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];
  const Icon = question.icon;

  return (
    <div className="min-h-screen bg-paper-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-paper-100 px-4 py-2 rounded-full mb-4"
          >
            <Sparkles className="text-crimson-600" size={20} />
            <span className="font-medium text-ink-900">Anime Personality Quiz</span>
          </motion.div>
          
          <h1 className="font-display text-3xl md:text-4xl text-ink-900 mb-2">
            Let's Find Your Perfect Match
          </h1>
          <p className="text-ink-700">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-paper-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-crimson-600 to-cobalt-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Question Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-paper-100 rounded-2xl p-8 ink-border panel-shadow mb-8"
          >
            {/* Question Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-cobalt-600 rounded-full flex items-center justify-center">
                <Icon className="text-paper-50" size={24} />
              </div>
              <h2 className="font-display text-2xl text-ink-900">{question.title}</h2>
            </div>

            {/* Question Content */}
            {question.type === 'single' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {question.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(question.id, option.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      answers[question.id] === option.value
                        ? 'border-crimson-600 bg-crimson-600/10'
                        : 'border-ink-900/20 hover:border-cobalt-600 hover:bg-cobalt-600/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="font-medium text-ink-900">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {question.type === 'slider' && (
              <div className="space-y-6">
                <div className="px-4">
                  <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    value={answers[question.id] || Math.floor((question.min + question.max) / 2)}
                    onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
                    className="w-full h-3 bg-paper-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div className="flex justify-between text-sm text-ink-700 px-2">
                  {question.labels.map((label, index) => (
                    <span key={index} className="text-center flex-1">
                      {label}
                    </span>
                  ))}
                </div>
                
                {question.id === 'era' && answers[question.id] && (
                  <div className="text-center">
                    <span className="inline-block bg-cobalt-600/10 text-cobalt-600 px-3 py-1 rounded-full text-sm font-medium">
                      {answers[question.id]}
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              currentQuestion === 0
                ? 'text-ink-700/50 cursor-not-allowed'
                : 'text-ink-900 hover:bg-paper-100'
            }`}
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentQuestion
                    ? 'bg-crimson-600'
                    : index < currentQuestion
                    ? 'bg-cobalt-600'
                    : 'bg-paper-200'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>
              {currentQuestion === questions.length - 1 ? 'Get Recommendations' : 'Next'}
            </span>
            {currentQuestion === questions.length - 1 ? (
              <Sparkles size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Custom slider styles */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #E11D48;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(225, 29, 72, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #E11D48;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(225, 29, 72, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Quiz;
