import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Settings, Info, Loader2 } from 'lucide-react';
import ZatorresLogo from '@/components/icons/zatorres-logo';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { SizingCalculator, SizeRecommendation } from '@/lib/sizing-calculator';
import { lastDisplayNames } from '@/lib/sizing-data';
import StepIndicator from '@/components/step-indicator';
import MeasurementGuide from '@/components/measurement-guide';
import MeasurementForm from '@/components/measurement-form';
import LastSelection from '@/components/last-selection';
import SizeResults from '@/components/size-results';

interface FormData {
  lastType: string;
  leftFootLengthMm: number;
  leftBallGirthMm: number;
  rightFootLengthMm: number;
  rightBallGirthMm: number;
}

interface MeasurementData {
  leftFootLengthMm: number;
  leftBallGirthMm: number;
  rightFootLengthMm: number;
  rightBallGirthMm: number;
}

export default function SizingAssistant() {
  const [currentStep, setCurrentStep] = useState(1);
  const [measurements, setMeasurements] = useState<MeasurementData | null>(null);
  const [recommendations, setRecommendations] = useState<SizeRecommendation[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [selectedLast, setSelectedLast] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();
  const mainRef = useRef<HTMLDivElement>(null);
  const prevStep = useRef(currentStep);

  useEffect(() => {
    if (prevStep.current !== currentStep && mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    prevStep.current = currentStep;
  }, [currentStep]);

  const sizingCalculator = new SizingCalculator();

  const calculateSizeMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Calculate size recommendations
      const result = sizingCalculator.calculateSize(
        data.lastType,
        data.leftFootLengthMm,
        data.leftBallGirthMm
      );

      // Save calculation to backend
      await apiRequest('POST', '/api/size-calculation', {
        lastType: data.lastType,
        leftFootLength: data.leftFootLengthMm,
        leftBallGirth: data.leftBallGirthMm,
        rightFootLength: data.rightFootLengthMm,
        rightBallGirth: data.rightBallGirthMm,
        recommendedSize: result.recommendations.find(r => r.fit === 'best')?.size.us?.toString() || 'N/A',
        recommendedWidth: result.recommendations.find(r => r.fit === 'best')?.width || 'N/A',
      });

      return result;
    },
    onSuccess: (result) => {
      if (result.recommendations.length > 0) {
        setRecommendations(result.recommendations);
        setConfidence(result.confidence);
        setShowResults(true);
        setCurrentStep(3);
        toast({
          title: "Size Calculated Successfully",
          description: "Your personalized size recommendations are ready!",
        });
      } else {
        toast({
          title: "No Size Found",
          description: result.message || "Unable to find a suitable size for your measurements.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error('Size calculation error:', error);
      toast({
        title: "Calculation Error",
        description: "There was an error calculating your size. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleMeasurementSubmit = (data: MeasurementData) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setMeasurements(data);
      setCurrentStep(2);
      setIsTransitioning(false);
    }, 300);
  };

  const handleLastSelect = (lastType: string, lastRecommendations: SizeRecommendation[], lastConfidence: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedLast(lastType);
      setRecommendations(lastRecommendations);
      setConfidence(lastConfidence);
      setShowResults(true);
      setCurrentStep(3);
      setIsTransitioning(false);
    }, 300);
    
    // Save to backend
    if (measurements) {
      apiRequest('POST', '/api/size-calculation', {
        lastType: lastType,
        leftFootLength: measurements.leftFootLengthMm,
        leftBallGirth: measurements.leftBallGirthMm,
        rightFootLength: measurements.rightFootLengthMm,
        rightBallGirth: measurements.rightBallGirthMm,
        recommendedSize: lastRecommendations.find(r => r.fit === 'best')?.size.us?.toString() || 'N/A',
        recommendedWidth: lastRecommendations.find(r => r.fit === 'best')?.width || 'N/A',
      }).catch(console.error);
    }
  };

  const handleBackToMeasurements = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(1);
      setMeasurements(null);
      setIsTransitioning(false);
    }, 300);
  };

  const handleReset = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(1);
      setMeasurements(null);
      setRecommendations([]);
      setConfidence(0);
      setSelectedLast('');
      setShowResults(false);
      setIsTransitioning(false);
    }, 300);
  };

  // Get the larger foot measurements for calculations
  const getLargerFootMeasurements = () => {
    if (!measurements) return { footLengthMm: 0, ballGirthMm: 0 };
    
    const leftFootLength = measurements.leftFootLengthMm;
    const rightFootLength = measurements.rightFootLengthMm;
    const leftBallGirth = measurements.leftBallGirthMm;
    const rightBallGirth = measurements.rightBallGirthMm;
    
    // Use the foot with the larger length, and if equal, use the one with larger ball girth
    if (leftFootLength > rightFootLength) {
      return { footLengthMm: leftFootLength, ballGirthMm: leftBallGirth };
    } else if (rightFootLength > leftFootLength) {
      return { footLengthMm: rightFootLength, ballGirthMm: rightBallGirth };
    } else {
      // If lengths are equal, use the one with larger ball girth
      return leftBallGirth >= rightBallGirth 
        ? { footLengthMm: leftFootLength, ballGirthMm: leftBallGirth }
        : { footLengthMm: rightFootLength, ballGirthMm: rightBallGirth };
    }
  };

  return (
    <div className="min-h-screen bg-zatorres-cream">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-zatorres-green text-white py-4 md:py-6 shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-normal font-bodoni text-white text-center"
                style={{
                  textShadow: `
                    -0.2px -0.2px 0 #d4af37,
                    0.2px -0.2px 0 #d4af37,
                    -0.2px 0.2px 0 #d4af37,
                    0.2px 0.2px 0 #d4af37
                  `
                }}
              >
                Zatorres
              </motion.h1>
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs md:text-sm lg:text-base font-light tracking-normal text-zatorres-sage font-bodoni"
            >
              Sizing Guide
            </motion.h2>
          </div>
        </div>
      </header>

      {/* Fixed Step Indicator */}
      <div className="fixed top-24 md:top-28 left-0 right-0 bg-white shadow-md z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4 flex items-center justify-center">
          <StepIndicator currentStep={currentStep} />
        </div>
      </div>

      {/* Main Content with Top Padding */}
      <main ref={mainRef} className="max-w-4xl mx-auto px-2 py-4 md:px-4 md:py-8 mt-28 md:mt-36">
        {/* Loading Overlay */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-lg p-6 shadow-xl flex items-center space-x-3"
              >
                <Loader2 className="animate-spin text-zatorres-gold" size={24} />
                <span className="text-zatorres-green font-medium">Processing...</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <MeasurementGuide />
              <MeasurementForm 
                onSubmit={() => {}} // Dummy function for required prop
                onMeasurementSubmit={handleMeasurementSubmit}
                measurementOnly={true}
                onReset={handleReset}
                isLoading={isTransitioning}
              />
            </motion.div>
          )}

          {currentStep === 2 && measurements && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <LastSelection
                footLengthMm={getLargerFootMeasurements().footLengthMm}
                ballGirthMm={getLargerFootMeasurements().ballGirthMm}
                leftFootLengthMm={measurements.leftFootLengthMm}
                leftBallGirthMm={measurements.leftBallGirthMm}
                rightFootLengthMm={measurements.rightFootLengthMm}
                rightBallGirthMm={measurements.rightBallGirthMm}
                onBack={handleBackToMeasurements}
                onLastSelect={handleLastSelect}
              />
            </motion.div>
          )}

          {currentStep === 3 && showResults && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <SizeResults 
                recommendations={recommendations}
                confidence={confidence}
                leftFootLengthMm={measurements?.leftFootLengthMm}
                leftBallGirthMm={measurements?.leftBallGirthMm}
                rightFootLengthMm={measurements?.rightFootLengthMm}
                rightBallGirthMm={measurements?.rightBallGirthMm}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <h2 className="font-playfair text-2xl font-bold text-zatorres-green mb-6 text-center">
            About Zatorres Sizing
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-4">
                <Settings className="inline mr-2 text-zatorres-gold" size={18} />
                Customizable Widths
              </h3>
              <div className="space-y-3">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="w-8 h-8 bg-zatorres-cream rounded-full flex items-center justify-center text-sm font-bold text-zatorres-green mr-3">
                    D
                  </span>
                  <span className="text-sm">Standard width for most foot shapes</span>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="w-8 h-8 bg-zatorres-cream rounded-full flex items-center justify-center text-sm font-bold text-zatorres-green mr-3">
                    EE
                  </span>
                  <span className="text-sm">Wide width for broader feet</span>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="w-8 h-8 bg-zatorres-cream rounded-full flex items-center justify-center text-sm font-bold text-zatorres-green mr-3">
                    EEE
                  </span>
                  <span className="text-sm">Extra wide for maximum comfort</span>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-4">
                <Info className="inline mr-2 text-zatorres-gold" size={18} />
                Sizing Notes
              </h3>
              <ul className="space-y-2 text-sm text-zatorres-green">
                <motion.li 
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  • Available in sizes 5-18 (US) with half sizes
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  • Each last has unique characteristics
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  • Measurements are taken from our workshop
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  • We use your larger foot for optimal fit
                </motion.li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-zatorres-green text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-4"
          >
            <span className="font-playfair text-lg">Zatorres</span>
          </motion.div>
          <p className="text-zatorres-sage text-sm">
            Handcrafted luxury footwear
          </p>
        </div>
      </footer>
    </div>
  );
}
