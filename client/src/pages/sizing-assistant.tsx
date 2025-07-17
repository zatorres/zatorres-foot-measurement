import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Crown, Settings, Info } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { SizingCalculator, SizeRecommendation } from '@/lib/sizing-calculator';
import { lastDisplayNames } from '@/lib/sizing-data';
import StepIndicator from '@/components/step-indicator';
import MeasurementGuide from '@/components/measurement-guide';
import MeasurementForm from '@/components/measurement-form';
import SizeResults from '@/components/size-results';

interface FormData {
  lastType: string;
  footLengthMm: number;
  ballGirthMm: number;
}

export default function SizingAssistant() {
  const [currentStep, setCurrentStep] = useState(1);
  const [recommendations, setRecommendations] = useState<SizeRecommendation[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const sizingCalculator = new SizingCalculator();

  const calculateSizeMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Calculate size recommendations
      const result = sizingCalculator.calculateSize(
        data.lastType,
        data.footLengthMm,
        data.ballGirthMm
      );

      // Save calculation to backend
      await apiRequest('POST', '/api/size-calculation', {
        lastType: data.lastType,
        footLength: data.footLengthMm,
        ballGirth: data.ballGirthMm,
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

  const handleFormSubmit = (data: FormData) => {
    setCurrentStep(2);
    calculateSizeMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-zatorres-cream">
      {/* Header */}
      <header className="bg-zatorres-green text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-playfair text-2xl md:text-3xl font-bold tracking-wide"
            >
              <svg className="inline w-6 h-6 mr-3 text-zatorres-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Zatorres Sizing Assistant
            </motion.h1>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mt-2 text-zatorres-sage text-sm"
          >
            Find your perfect fit with precision measurements
          </motion.p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Measurement Instructions */}
        {currentStep >= 1 && <MeasurementGuide />}

        {/* Measurement Form */}
        {currentStep >= 1 && (
          <MeasurementForm 
            onSubmit={handleFormSubmit} 
            isLoading={calculateSizeMutation.isPending}
          />
        )}

        {/* Results Section */}
        {showResults && (
          <SizeResults 
            recommendations={recommendations}
            confidence={confidence}
          />
        )}

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
            <div>
              <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-4">
                <Settings className="inline mr-2 text-zatorres-gold" size={18} />
                Customizable Widths
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-zatorres-cream rounded-full flex items-center justify-center text-sm font-bold text-zatorres-green mr-3">
                    D
                  </span>
                  <span className="text-sm">Standard width for most foot shapes</span>
                </div>
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-zatorres-cream rounded-full flex items-center justify-center text-sm font-bold text-zatorres-green mr-3">
                    EE
                  </span>
                  <span className="text-sm">Wide width for broader feet</span>
                </div>
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-zatorres-cream rounded-full flex items-center justify-center text-sm font-bold text-zatorres-green mr-3">
                    EEE
                  </span>
                  <span className="text-sm">Extra wide for maximum comfort</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-4">
                <Info className="inline mr-2 text-zatorres-gold" size={18} />
                Sizing Notes
              </h3>
              <ul className="space-y-2 text-sm text-zatorres-green">
                <li>• Available in sizes 5-18 (US) with half sizes</li>
                <li>• Each last has unique characteristics</li>
                <li>• Measurements are taken from our workshop</li>
                <li>• Contact us for special sizing requests</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-zatorres-green text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-4"
          >
            <Crown className="text-zatorres-gold mr-2" size={20} />
            <span className="font-playfair text-lg">Zatorres</span>
          </motion.div>
          <p className="text-zatorres-sage text-sm">
            Handcrafted luxury footwear since 1892
          </p>
        </div>
      </footer>
    </div>
  );
}
