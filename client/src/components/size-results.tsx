import { motion } from 'framer-motion';
import { Star, ArrowUp, ArrowDown, Info, Crown, Mail, Phone, Footprints } from 'lucide-react';
import { SizeRecommendation } from '@/lib/sizing-calculator';
import { Button } from '@/components/ui/button';

interface SizeResultsProps {
  recommendations: SizeRecommendation[];
  confidence: number;
  leftFootLengthMm?: number;
  leftBallGirthMm?: number;
  rightFootLengthMm?: number;
  rightBallGirthMm?: number;
}

export default function SizeResults({ 
  recommendations, 
  confidence,
  leftFootLengthMm,
  leftBallGirthMm,
  rightFootLengthMm,
  rightBallGirthMm
}: SizeResultsProps) {
  const getBestRecommendation = () => recommendations.find(r => r.fit === 'best');
  const getSnuggerRecommendation = () => recommendations.find(r => r.fit === 'snugger');
  const getRoomierRecommendation = () => recommendations.find(r => r.fit === 'roomier');

  const bestFit = getBestRecommendation();
  const snuggerFit = getSnuggerRecommendation();
  const roomierFit = getRoomierRecommendation();

  if (!bestFit) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg shadow-lg p-8 mb-8"
      >
        <div className="text-center">
          <h2 className="font-playfair text-2xl font-bold text-zatorres-green mb-4">
            No Size Recommendations
          </h2>
          <p className="text-zatorres-sage">
            Unable to find suitable size recommendations for your measurements. 
            Please verify your measurements and try again.
          </p>
        </div>
      </motion.div>
    );
  }

  const formatSize = (size: number) => {
    return size % 1 === 0 ? size.toString() : size.toFixed(1);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLuxuryFitLabel = (confidence: number) => {
    if (confidence >= 0.95) return 'Perfect Fit';
    if (confidence >= 0.85) return 'Excellent Fit';
    if (confidence >= 0.7) return 'Good Fit';
    return 'Limited Options';
  };

  const getExplanation = (recommendation: SizeRecommendation) => {
    const size = recommendation.size.us;
    const width = recommendation.width;
    
    if (recommendation.fit === 'best') {
      return `You are a ${formatSize(size)} ${width} because your measurements match our sizing data most closely. This size provides the optimal balance of comfort and elegance for your foot dimensions.`;
    } else if (recommendation.fit === 'snugger') {
      return `A ${formatSize(size)} ${width} offers a more fitted feel. This option is ideal if you prefer a closer, more precise fit that emphasizes the elegant silhouette of your shoes.`;
    } else {
      return `A ${formatSize(size)} ${width} provides additional room for comfort. This option is perfect if you prefer a more relaxed fit or have wider feet.`;
    }
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
      <h2 className="font-playfair text-2xl font-bold text-zatorres-green mb-6 text-center">
        Your Perfect Fit
      </h2>

      {/* Confidence Level */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-6 p-4 bg-zatorres-cream rounded-lg text-center"
      >
        <p className={`text-lg font-semibold ${getConfidenceColor(confidence)}`}>
          {getLuxuryFitLabel(confidence)}
        </p>
      </motion.div>

      {/* Foot Measurements Summary */}
      {leftFootLengthMm && rightFootLengthMm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 p-4 bg-zatorres-gold bg-opacity-10 rounded-lg border border-zatorres-gold"
        >
          <div className="text-center mb-3">
            <Footprints className="inline mr-2 text-zatorres-gold" size={20} />
            <h3 className="font-playfair text-lg font-semibold text-zatorres-green">
              Measurements Used
            </h3>
          </div>
          
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
              <strong>Recommendations based on {largerFoot === 'left' ? 'left' : largerFoot === 'right' ? 'right' : 'larger'} foot measurements</strong>
            </p>
            <p className="text-xs text-zatorres-sage mt-1">
              This ensures optimal comfort for both shoes in your pair
            </p>
          </div>
        </motion.div>
      )}
      
      {/* Size Recommendations */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Snugger Fit */}
        {snuggerFit && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-zatorres-cream p-6 rounded-lg border-2 border-transparent hover:border-zatorres-sage transition-colors"
          >
            <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-3 text-center">
              <ArrowDown className="inline mr-2" size={16} />
              Snugger Fit
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-zatorres-green mb-2">
                {formatSize(snuggerFit.size.us)}
              </div>
              <div className="text-sm text-zatorres-sage">US Size</div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>EU:</span>
                <span>{formatSize(snuggerFit.size.eu)}</span>
              </div>
              <div className="flex justify-between">
                <span>UK:</span>
                <span>{formatSize(snuggerFit.size.uk)}</span>
              </div>
              <div className="flex justify-between">
                <span>Width:</span>
                <span>{snuggerFit.width}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded border border-zatorres-sage">
              <p className="text-xs text-zatorres-green leading-relaxed">
                {getExplanation(snuggerFit)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Best Fit */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-zatorres-gold bg-opacity-20 p-6 rounded-lg border-2 border-zatorres-gold"
        >
          <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-3 text-center">
            <Star className="inline mr-2" size={16} />
            Recommended Size
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-zatorres-green mb-2">
              {formatSize(bestFit.size.us)}
            </div>
            <div className="text-sm text-zatorres-sage">US Size</div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>EU:</span>
              <span>{formatSize(bestFit.size.eu)}</span>
            </div>
            <div className="flex justify-between">
              <span>UK:</span>
              <span>{formatSize(bestFit.size.uk)}</span>
            </div>
            <div className="flex justify-between">
              <span>Width:</span>
              <span>{bestFit.width}</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded border border-zatorres-gold">
            <p className="text-xs text-zatorres-green leading-relaxed">
              {getExplanation(bestFit)}
            </p>
          </div>
        </motion.div>

        {/* Roomier Fit */}
        {roomierFit && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-zatorres-cream p-6 rounded-lg border-2 border-transparent hover:border-zatorres-sage transition-colors"
          >
            <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-3 text-center">
              <ArrowUp className="inline mr-2" size={16} />
              Roomier Fit
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-zatorres-green mb-2">
                {formatSize(roomierFit.size.us)}
              </div>
              <div className="text-sm text-zatorres-sage">US Size</div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>EU:</span>
                <span>{formatSize(roomierFit.size.eu)}</span>
              </div>
              <div className="flex justify-between">
                <span>UK:</span>
                <span>{formatSize(roomierFit.size.uk)}</span>
              </div>
              <div className="flex justify-between">
                <span>Width:</span>
                <span>{roomierFit.width}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded border border-zatorres-sage">
              <p className="text-xs text-zatorres-green leading-relaxed">
                {getExplanation(roomierFit)}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Size Conversion Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="bg-zatorres-cream p-6 rounded-lg mb-6"
      >
        <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-4 text-center">
          <Info className="inline mr-2" size={16} />
          Complete Size Conversion
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zatorres-sage">
                <th className="text-left py-2">System</th>
                {snuggerFit && <th className="text-center py-2">Snugger</th>}
                <th className="text-center py-2 bg-zatorres-gold bg-opacity-20">Recommended</th>
                {roomierFit && <th className="text-center py-2">Roomier</th>}
              </tr>
            </thead>
            <tbody className="text-zatorres-green">
              <tr className="border-b border-zatorres-sage border-opacity-30">
                <td className="py-2">US</td>
                {snuggerFit && <td className="text-center py-2">{formatSize(snuggerFit.size.us)}</td>}
                <td className="text-center py-2 bg-zatorres-gold bg-opacity-20 font-semibold">
                  {formatSize(bestFit.size.us)}
                </td>
                {roomierFit && <td className="text-center py-2">{formatSize(roomierFit.size.us)}</td>}
              </tr>
              <tr className="border-b border-zatorres-sage border-opacity-30">
                <td className="py-2">UK</td>
                {snuggerFit && <td className="text-center py-2">{formatSize(snuggerFit.size.uk)}</td>}
                <td className="text-center py-2 bg-zatorres-gold bg-opacity-20 font-semibold">
                  {formatSize(bestFit.size.uk)}
                </td>
                {roomierFit && <td className="text-center py-2">{formatSize(roomierFit.size.uk)}</td>}
              </tr>
              <tr className="border-b border-zatorres-sage border-opacity-30">
                <td className="py-2">EU</td>
                {snuggerFit && <td className="text-center py-2">{formatSize(snuggerFit.size.eu)}</td>}
                <td className="text-center py-2 bg-zatorres-gold bg-opacity-20 font-semibold">
                  {formatSize(bestFit.size.eu)}
                </td>
                {roomierFit && <td className="text-center py-2">{formatSize(roomierFit.size.eu)}</td>}
              </tr>
              <tr className="border-b border-zatorres-sage border-opacity-30">
                <td className="py-2">JP</td>
                {snuggerFit && <td className="text-center py-2">{formatSize(snuggerFit.size.jp)}</td>}
                <td className="text-center py-2 bg-zatorres-gold bg-opacity-20 font-semibold">
                  {formatSize(bestFit.size.jp)}
                </td>
                {roomierFit && <td className="text-center py-2">{formatSize(roomierFit.size.jp)}</td>}
              </tr>
              <tr>
                <td className="py-2">KR</td>
                {snuggerFit && <td className="text-center py-2">{formatSize(snuggerFit.size.kr)}</td>}
                <td className="text-center py-2 bg-zatorres-gold bg-opacity-20 font-semibold">
                  {formatSize(bestFit.size.kr)}
                </td>
                {roomierFit && <td className="text-center py-2">{formatSize(roomierFit.size.kr)}</td>}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Contact for Complimentary Sizing Consultation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="bg-gradient-to-r from-zatorres-gold to-zatorres-green bg-opacity-10 p-6 rounded-lg border border-zatorres-gold"
      >
        <div className="text-center mb-4">
          <Crown className="mx-auto mb-2 text-zatorres-gold" size={24} />
          <h3 className="font-playfair text-xl font-semibold text-zatorres-green mb-2">
            Complimentary Sizing Consultation
          </h3>
          <p className="text-zatorres-green text-sm leading-relaxed">
            For the most personalized experience, our master craftsmen are available for a complimentary sizing consultation. 
            We believe every customer deserves individual attention to ensure the perfect fit.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => window.open('mailto:sales@zatorres.com?subject=Complimentary Sizing Consultation', '_blank')}
            className="bg-zatorres-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Mail className="mr-2" size={16} />
            Email Consultation
          </Button>
          
          <Button
            onClick={() => window.open('tel:+1234567890', '_blank')}
            variant="outline"
            className="border-2 border-zatorres-sage text-zatorres-sage px-6 py-3 rounded-lg font-semibold hover:bg-zatorres-sage hover:text-white transition-all duration-200"
          >
            <Phone className="mr-2" size={16} />
            Call Us
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-xs text-zatorres-sage">
            <strong>Email:</strong> sales@zatorres.com | <strong>Hours:</strong> Mon-Fri 9AM-6PM EST
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
