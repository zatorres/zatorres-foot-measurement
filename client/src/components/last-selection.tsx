import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, ArrowLeft, ArrowRight, CheckCircle, Footprints, Star, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SizingCalculator, SizeRecommendation } from '@/lib/sizing-calculator';
import { lastDisplayNames } from '@/lib/sizing-data';
import { getLastDescription, LastDescription } from '@/lib/last-descriptions';
import { getLastVisual } from '@/lib/last-visuals';
import LastIllustration from './last-illustration';

interface LastSelectionProps {
  footLengthMm: number;
  ballGirthMm: number;
  onBack: () => void;
  onLastSelect: (lastType: string, recommendations: SizeRecommendation[], confidence: number) => void;
  leftFootLengthMm?: number;
  leftBallGirthMm?: number;
  rightFootLengthMm?: number;
  rightBallGirthMm?: number;
}

export default function LastSelection({ 
  footLengthMm, 
  ballGirthMm, 
  onBack, 
  onLastSelect,
  leftFootLengthMm,
  leftBallGirthMm,
  rightFootLengthMm,
  rightBallGirthMm
}: LastSelectionProps) {
  const [selectedLast, setSelectedLast] = useState<string>('');
  const [allRecommendations, setAllRecommendations] = useState<Record<string, { recommendations: SizeRecommendation[], confidence: number }>>({});
  
  const sizingCalculator = new SizingCalculator();
  const lastTypes = Object.keys(lastDisplayNames);

  // Calculate recommendations for all lasts
  const calculateAllRecommendations = () => {
    const recommendations: Record<string, { recommendations: SizeRecommendation[], confidence: number }> = {};
    
    lastTypes.forEach(lastType => {
      const result = sizingCalculator.calculateSize(lastType, footLengthMm, ballGirthMm);
      recommendations[lastType] = {
        recommendations: result.recommendations,
        confidence: result.confidence
      };
    });
    
    setAllRecommendations(recommendations);
  };

  // Calculate recommendations when component mounts
  useEffect(() => {
    calculateAllRecommendations();
  }, []);

  const handleLastSelect = (lastType: string) => {
    setSelectedLast(lastType);
    const result = allRecommendations[lastType];
    if (result) {
      onLastSelect(lastType, result.recommendations, result.confidence);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Excellent Fit';
    if (confidence >= 0.6) return 'Good Fit';
    return 'Limited Options';
  };

  const determineLargerFoot = () => {
    if (!leftFootLengthMm || !rightFootLengthMm) return 'larger';
    
    if (leftFootLengthMm > rightFootLengthMm) return 'left';
    if (rightFootLengthMm > leftFootLengthMm) return 'right';
    
    // If lengths are equal, check ball girth
    if (leftBallGirthMm && rightBallGirthMm) {
      return leftBallGirthMm >= rightBallGirthMm ? 'left' : 'right';
    }
    
    return 'larger';
  };

  const largerFoot = determineLargerFoot();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-8 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-2 border-zatorres-sage text-zatorres-sage px-4 py-2 rounded-lg hover:bg-zatorres-sage hover:text-white transition-all duration-200"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Measurements
        </Button>
        
        <h2 className="font-playfair text-2xl font-bold text-zatorres-green text-center">
          Select Your Preferred Last
        </h2>
        
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Measurements Summary */}
      <div className="mb-6 p-4 bg-zatorres-cream rounded-lg">
        <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-3 text-center">
          <Footprints className="inline mr-2 text-zatorres-gold" size={20} />
          Your Measurements
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-3">
          <div className="bg-white p-3 rounded border border-zatorres-sage">
            <h4 className="font-semibold text-zatorres-green mb-2">Left Foot</h4>
                    <p className="text-sm text-zatorres-sage">
          Length: {leftFootLengthMm}mm | Foot Width: {leftBallGirthMm}mm
        </p>
          </div>
          <div className="bg-white p-3 rounded border border-zatorres-sage">
            <h4 className="font-semibold text-zatorres-green mb-2">Right Foot</h4>
                    <p className="text-sm text-zatorres-sage">
          Length: {rightFootLengthMm}mm | Foot Width: {rightBallGirthMm}mm
        </p>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-zatorres-green">
            <strong>Using {largerFoot === 'left' ? 'left' : largerFoot === 'right' ? 'right' : 'larger'} foot measurements:</strong> {footLengthMm}mm length × {ballGirthMm}mm foot width
          </p>
          <p className="text-xs text-zatorres-sage mt-1">
            This ensures optimal comfort for both shoes
          </p>
        </div>
      </div>

      {/* Last Selection Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {lastTypes.map((lastType, index) => {
          const result = allRecommendations[lastType];
          const bestFit = result?.recommendations.find(r => r.fit === 'best');
          
          return (
            <motion.div
              key={lastType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                selectedLast === lastType 
                  ? 'border-zatorres-gold bg-zatorres-gold bg-opacity-10' 
                  : 'border-zatorres-sage bg-zatorres-cream hover:border-zatorres-gold hover:bg-zatorres-gold hover:bg-opacity-5'
              }`}
              onClick={() => handleLastSelect(lastType)}
            >
              {selectedLast === lastType && (
                <CheckCircle className="absolute top-2 right-2 text-zatorres-gold" size={20} />
              )}
              
              <div className="text-center mb-4">
                <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-3">
                  {lastDisplayNames[lastType]}
                </h3>
                
                {/* Last Illustration */}
                <div className="mb-4">
                  <LastIllustration lastName={lastType} className="w-full" />
                </div>
                
                {getLastDescription(lastType) && (
                  <div className="mt-3 text-left">
                    <p className="text-xs text-zatorres-sage leading-relaxed mb-2">
                      {getLastDescription(lastType)?.description}
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 text-zatorres-gold" />
                      <span className="text-xs font-medium text-zatorres-green">
                        {getLastDescription(lastType)?.style}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {getLastDescription(lastType)?.characteristics.slice(0, 2).map((char, index) => (
                        <span key={index} className="px-1.5 py-0.5 bg-zatorres-cream text-xs text-zatorres-gray rounded">
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {result && (
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-zatorres-sage">Best Fit</p>
                    <p className="font-bold text-lg text-zatorres-green">
                      {bestFit?.size.us} {bestFit?.width}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                      {getConfidenceText(result.confidence)}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Results for Selected Last */}
      {selectedLast && allRecommendations[selectedLast] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-zatorres-cream rounded-lg p-6 border border-zatorres-sage"
        >
          <h3 className="font-playfair text-xl font-semibold text-zatorres-green mb-4 text-center">
            Detailed Results for {lastDisplayNames[selectedLast]}
          </h3>
          
          {/* Selected Last Illustration */}
          <div className="mb-6">
            <LastIllustration lastName={selectedLast} className="max-w-md mx-auto" />
          </div>
          
          {getLastDescription(selectedLast) && (
            <div className="mb-6 p-4 bg-white rounded-lg border border-zatorres-sage">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-zatorres-gold" />
                <h4 className="font-semibold text-zatorres-green">
                  {getLastDescription(selectedLast)?.displayName} Characteristics
                </h4>
              </div>
              <p className="text-sm text-zatorres-sage mb-3 leading-relaxed">
                {getLastDescription(selectedLast)?.description}
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-zatorres-green mb-2">Style & Fit</h5>
                  <p className="text-xs text-zatorres-sage mb-2">{getLastDescription(selectedLast)?.fit}</p>
                  <div className="flex flex-wrap gap-1">
                    {getLastDescription(selectedLast)?.characteristics.map((char, index) => (
                      <span key={index} className="px-2 py-1 bg-zatorres-cream text-xs text-zatorres-gray rounded">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-zatorres-green mb-2">Perfect For</h5>
                  <div className="flex flex-wrap gap-1">
                    {getLastDescription(selectedLast)?.occasions.map((occasion, index) => (
                      <span key={index} className="px-2 py-1 bg-zatorres-green/10 text-xs text-zatorres-green rounded">
                        {occasion}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {allRecommendations[selectedLast].recommendations.map((rec, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-zatorres-sage">
                <h4 className="font-semibold text-zatorres-green mb-2 text-center">
                  {rec.fit === 'best' ? 'Best Fit' : rec.fit === 'snugger' ? 'Half Size Down' : 'Half Size Up'}
                </h4>
                <div className="text-center">
                  <p className="text-2xl font-bold text-zatorres-green">
                    {rec.size.us} {rec.width}
                  </p>
                  <p className="text-sm text-zatorres-sage mt-1">
                    EU: {rec.size.eu} | UK: {rec.size.uk}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => handleLastSelect(selectedLast)}
              className="bg-zatorres-green text-white px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <ArrowRight className="mr-2" size={16} />
              Select {lastDisplayNames[selectedLast]}
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 