import { motion } from 'framer-motion';
import { Ruler, CircleDot, Lightbulb, Clock, Shirt, Footprints, CheckCircle, FileText, PenTool, Scissors } from 'lucide-react';
import { SocksIcon } from './icons/socks-icon';
import ZatorresLogo from './icons/zatorres-logo';



export default function MeasurementGuide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-8"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 relative"
      >

        
        <div className="relative z-10">
          
          <h1 className="font-playfair text-2xl md:text-5xl font-bold text-zatorres-green mb-4 md:mb-8">
            Perfect Fit Guide
          </h1>
          <p className="text-zatorres-sage text-base md:text-xl max-w-4xl mx-auto leading-relaxed px-2 md:px-4 font-light mb-4">
            Accurate measurements ensure the perfect fit for your Zatorres shoes.
          </p>
        </div>
      </motion.div>
      
      {/* Combined Measurement Essentials */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8 p-4 md:p-6 bg-gradient-to-r from-zatorres-cream to-zatorres-gold rounded-lg border border-zatorres-sage"
      >
                    <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-4 text-center">
              Essential Preparation
            </h3>
        
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-4 rounded-lg border border-zatorres-sage"
          >
            <h4 className="font-playfair text-md font-semibold text-zatorres-green mb-4 flex items-center">
              <CheckCircle className="mr-2 text-zatorres-gold" size={16} />
              Required Tools
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-zatorres-gold rounded-full flex items-center justify-center mx-auto mb-2 border border-zatorres-green border-opacity-30">
                  <Ruler className="text-white" size={16} />
                </div>
                <p className="text-xs text-zatorres-sage font-medium">Measuring Tape</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-zatorres-gold rounded-full flex items-center justify-center mx-auto mb-2 border border-zatorres-green border-opacity-30">
                  <FileText className="text-white" size={16} />
                </div>
                <p className="text-xs text-zatorres-sage font-medium">Paper</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-zatorres-gold rounded-full flex items-center justify-center mx-auto mb-2 border border-zatorres-green border-opacity-30">
                  <PenTool className="text-white" size={16} />
                </div>
                <p className="text-xs text-zatorres-sage font-medium">Pen/Pencil</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-zatorres-gold rounded-full flex items-center justify-center mx-auto mb-2 border border-zatorres-green border-opacity-30">
                  <SocksIcon className="text-white" size={16} />
                </div>
                <p className="text-xs text-zatorres-sage font-medium">Dress Socks</p>
              </motion.div>
            </div>
          </motion.div>


        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 space-y-2"
        >
          <div className="p-3 bg-zatorres-gold bg-opacity-20 rounded-lg">
            <p className="text-zatorres-green text-xs md:text-sm font-medium">
              <Lightbulb className="inline mr-2" size={14} />
              <strong>Note:</strong> Measure both feet. We'll use your larger foot for sizing.
            </p>
          </div>
          
          <div className="p-3 bg-zatorres-gold bg-opacity-20 rounded-lg">
            <p className="text-zatorres-green text-xs md:text-sm font-medium">
              <Clock className="inline mr-2" size={14} />
              <strong>Tip:</strong> Measure at the end of the day when your feet are at their largest size.
            </p>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Three-step visual guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* Step 1: Foot Tracing */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-br from-zatorres-cream to-zatorres-gold p-3 md:p-6 rounded-lg shadow-xl border border-zatorres-sage border-opacity-20 relative overflow-hidden"
        >
          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-zatorres-gold rounded-full flex items-center justify-center shadow-lg">
                <FileText className="text-white" size={24} />
              </div>
            </div>
            
            <h3 className="font-playfair text-lg md:text-2xl font-semibold text-zatorres-green mb-4 text-center">
              Step 1: Trace Both Feet
            </h3>
            
            <div className="space-y-3 text-sm md:text-base text-zatorres-green">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-zatorres-gold rounded-full mt-2 flex-shrink-0"></div>
                <p>Position paper on firm, level surface for accuracy</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-zatorres-gold rounded-full mt-2 flex-shrink-0"></div>
                <p>Don your preferred dress socks for consistent measurement</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-zatorres-gold rounded-full mt-2 flex-shrink-0"></div>
                <p>Trace complete outline of both feet for precision</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-zatorres-gold rounded-full mt-2 flex-shrink-0"></div>
                <p>Label each outline clearly for optimal results</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 2: Length Measurement */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-br from-zatorres-cream to-zatorres-gold p-3 md:p-6 rounded-lg shadow-xl border border-zatorres-sage border-opacity-20 relative overflow-hidden"
        >

          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-zatorres-gold rounded-full flex items-center justify-center shadow-lg">
                <Ruler className="text-white" size={24} />
              </div>
            </div>
            
            <h3 className="font-playfair text-lg md:text-2xl font-semibold text-zatorres-green mb-4 text-center">
              Step 2: Measure Length
            </h3>
            
            <div className="space-y-3 text-sm md:text-base text-zatorres-green">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-zatorres-gold rounded-full mt-2 flex-shrink-0"></div>
                <p>Draw horizontal lines at heel and longest toe for precision</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-zatorres-gold rounded-full mt-2 flex-shrink-0"></div>
                <p>Measure longest point between these lines for accuracy</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-zatorres-gold rounded-full mt-2 flex-shrink-0"></div>
                <p>Record measurements for both feet separately for optimal fit</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-zatorres-gold rounded-full mt-2 flex-shrink-0"></div>
                <p>Note any differences between left and right for consistency</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 3: Foot Width */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-gradient-to-br from-zatorres-cream to-zatorres-gold p-3 md:p-6 rounded-lg shadow-xl border border-zatorres-sage border-opacity-20 relative overflow-hidden"
        >
          
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-zatorres-gold rounded-full flex items-center justify-center shadow-lg">
                <CircleDot className="text-white" size={24} />
              </div>
            </div>
            
            <h3 className="font-playfair text-lg md:text-2xl font-semibold text-zatorres-green mb-4 text-center">
              Step 3: Foot Width
            </h3>
            
            <div className="space-y-3 text-sm md:text-base text-zatorres-green">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-zatorres-gold rounded-full mt-2 flex-shrink-0"></div>
                <p>Locate widest portion of each foot for optimal fit</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-zatorres-gold rounded-full mt-2 flex-shrink-0"></div>
                <p>Wrap measuring tape completely around at this point for precision</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-zatorres-gold rounded-full mt-2 flex-shrink-0"></div>
                <p>Record foot width for both feet separately for accuracy</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-zatorres-gold rounded-full mt-2 flex-shrink-0"></div>
                <p>Ensure tape is snug but not tight for consistent results</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-6 p-4 bg-zatorres-sage bg-opacity-20 rounded-lg"
      >
        <p className="text-zatorres-green text-sm font-medium text-center">
          <Lightbulb className="inline mr-2" size={16} />
          Our precision measurement system ensures exceptional fit and comfort.
        </p>
      </motion.div>
    </motion.div>
  );
}
