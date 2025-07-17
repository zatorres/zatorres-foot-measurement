import { motion } from 'framer-motion';
import { Star, ArrowUp, ArrowDown, Info, Crown } from 'lucide-react';
import { SizeRecommendation } from '@/lib/sizing-calculator';

interface SizeResultsProps {
  recommendations: SizeRecommendation[];
  confidence: number;
}

export default function SizeResults({ recommendations, confidence }: SizeResultsProps) {
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
      
      {/* Size Recommendations */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Snugger Fit */}
        {snuggerFit && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
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
          </motion.div>
        )}

        {/* Best Fit */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
        </motion.div>

        {/* Roomier Fit */}
        {roomierFit && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
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
          </motion.div>
        )}
      </div>

      {/* Size Conversion Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
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


    </motion.div>
  );
}
