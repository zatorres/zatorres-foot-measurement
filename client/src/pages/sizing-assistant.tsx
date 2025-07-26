import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import MeasurementGuide from '@/components/measurement-guide';
import { MeasurementForm } from '@/components/measurement-form';
import LastSelection from '@/components/last-selection';
import SizeResults from '@/components/size-results';
import StepIndicator from '@/components/step-indicator';
import { ZatorresLogo } from '@/components/icons/zatorres-logo';

type Step = 'guide' | 'measurements' | 'last' | 'results';

interface MeasurementData {
  leftFootLength: string;
  leftFootWidth: string;
  rightFootLength: string;
  rightFootWidth: string;
}

interface LastData {
  lastType: string;
}

export default function SizingAssistant() {
  const [currentStep, setCurrentStep] = useState<Step>('guide');
  const [measurements, setMeasurements] = useState<MeasurementData | null>(null);
  const [lastSelection, setLastSelection] = useState<LastData | null>(null);
  const [results, setResults] = useState<any>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when step changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentStep]);

  const handleMeasurementSubmit = (data: MeasurementData) => {
    setMeasurements(data);
    setCurrentStep('last');
  };

  const handleLastSubmit = (data: LastData) => {
    setLastSelection(data);
    
    // Calculate results
    if (measurements && data.lastType) {
      const leftLength = parseFloat(measurements.leftFootLength);
      const leftWidth = parseFloat(measurements.leftFootWidth);
      const rightLength = parseFloat(measurements.rightFootLength);
      const rightWidth = parseFloat(measurements.rightFootWidth);
      
      // Use the larger foot measurements
      const footLength = Math.max(leftLength, rightLength);
      const footWidth = Math.max(leftWidth, rightWidth);
      
      // Simple size calculation (you can make this more sophisticated)
      const sizeResult = {
        lastType: data.lastType,
        footLength,
        footWidth,
        recommendedSize: calculateSize(footLength, footWidth, data.lastType),
        confidence: calculateConfidence(footLength, footWidth)
      };
      
      setResults(sizeResult);
      setCurrentStep('results');
    }
  };

  const calculateSize = (length: number, width: number, lastType: string) => {
    // Simple size calculation - you can make this more sophisticated
    const baseSize = Math.round((length - 220) / 10) + 6; // Rough conversion
    return Math.max(6, Math.min(14, baseSize)); // Clamp between 6-14
  };

  const calculateConfidence = (length: number, width: number) => {
    // Simple confidence calculation
    if (length >= 220 && length <= 320 && width >= 80 && width <= 120) {
      return 'Perfect Fit';
    } else if (length >= 200 && length <= 350 && width >= 70 && width <= 130) {
      return 'Excellent Fit';
    } else if (length >= 180 && length <= 370 && width >= 60 && width <= 140) {
      return 'Good Fit';
    } else {
      return 'Limited Options';
    }
  };

  const handleReset = () => {
    setMeasurements(null);
    setLastSelection(null);
    setResults(null);
    setCurrentStep('guide');
  };

  const getStepNumber = (step: Step): number => {
    switch (step) {
      case 'guide': return 1;
      case 'measurements': return 1;
      case 'last': return 2;
      case 'results': return 3;
      default: return 1;
    }
  };

  const steps = [
    { id: 'guide', label: 'Guide' },
    { id: 'measurements', label: 'Measurements' },
    { id: 'last', label: 'Last Selection' },
    { id: 'results', label: 'Results' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zatorres-cream via-white to-zatorres-cream">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-zatorres-sage/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <ZatorresLogo variant="full" className="h-8 md:h-10" />
          </div>
        </div>
      </header>

      {/* Fixed Step Indicator */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-zatorres-sage/10 shadow-sm">
        <div className="max-w-4xl mx-auto px-2">
          <StepIndicator currentStep={getStepNumber(currentStep)} />
        </div>
      </div>

      {/* Main Content */}
      <main 
        ref={mainRef}
        className="pt-32 pb-8 min-h-screen"
        style={{ paddingTop: '8rem' }}
      >
        <div className="max-w-4xl mx-auto px-4">
          {currentStep === 'guide' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <MeasurementGuide />
            </motion.div>
          )}

          {currentStep === 'measurements' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <MeasurementForm onSubmit={handleMeasurementSubmit} />
            </motion.div>
          )}

          {currentStep === 'last' && measurements && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <LastSelection 
                footLengthMm={Math.max(parseFloat(measurements.leftFootLength), parseFloat(measurements.rightFootLength))}
                ballGirthMm={Math.max(parseFloat(measurements.leftFootWidth), parseFloat(measurements.rightFootWidth))}
                leftFootLengthMm={parseFloat(measurements.leftFootLength)}
                leftBallGirthMm={parseFloat(measurements.leftFootWidth)}
                rightFootLengthMm={parseFloat(measurements.rightFootLength)}
                rightBallGirthMm={parseFloat(measurements.rightFootWidth)}
                onBack={() => setCurrentStep('measurements')}
                onLastSelect={(lastType, recommendations, confidence) => {
                  setLastSelection({ lastType });
                  setResults({ recommendations, confidence, lastType });
                  setCurrentStep('results');
                }}
              />
            </motion.div>
          )}

          {currentStep === 'results' && results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <SizeResults 
                recommendations={results.recommendations || []}
                confidence={results.confidence || 0}
                leftFootLengthMm={measurements ? parseFloat(measurements.leftFootLength) : undefined}
                leftBallGirthMm={measurements ? parseFloat(measurements.leftFootWidth) : undefined}
                rightFootLengthMm={measurements ? parseFloat(measurements.rightFootLength) : undefined}
                rightBallGirthMm={measurements ? parseFloat(measurements.rightFootWidth) : undefined}
              />
            </motion.div>
          )}
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-zatorres-sage/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="text-center">
            <p className="text-sm text-zatorres-green font-medium">
              Handcrafted luxury footwear
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
