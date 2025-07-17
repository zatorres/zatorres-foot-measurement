import { motion } from 'framer-motion';
import { Ruler, CircleDot, Lightbulb } from 'lucide-react';

export default function MeasurementGuide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-8 mb-8"
    >
      <h2 className="font-playfair text-2xl font-bold text-zatorres-green mb-6 text-center">
        How to Measure Your Feet
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Foot Length */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-zatorres-cream p-6 rounded-lg"
        >
          <h3 className="font-playfair text-xl font-semibold text-zatorres-green mb-4">
            <Ruler className="inline mr-2 text-zatorres-gold" size={20} />
            Foot Length
          </h3>
          
          <div className="bg-white rounded-lg p-4 mb-4 border-2 border-zatorres-sage">
            <img
              src="https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
              alt="Foot length measurement illustration"
              className="w-full h-48 object-cover rounded"
            />
          </div>
          
          <div className="space-y-2 text-sm text-zatorres-green">
            <p><strong>Step 1:</strong> Place your foot on a piece of paper against a wall</p>
            <p><strong>Step 2:</strong> Mark the longest point of your foot</p>
            <p><strong>Step 3:</strong> Measure from the wall to the mark</p>
            <p><strong>Step 4:</strong> Record the measurement in millimeters</p>
          </div>
        </motion.div>

        {/* Ball Girth */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-zatorres-cream p-6 rounded-lg"
        >
          <h3 className="font-playfair text-xl font-semibold text-zatorres-green mb-4">
            <CircleDot className="inline mr-2 text-zatorres-gold" size={20} />
            Ball Girth
          </h3>
          
          <div className="bg-white rounded-lg p-4 mb-4 border-2 border-zatorres-sage">
            <img
              src="https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
              alt="Ball girth measurement illustration"
              className="w-full h-48 object-cover rounded"
            />
          </div>
          
          <div className="space-y-2 text-sm text-zatorres-green">
            <p><strong>Step 1:</strong> Wrap a measuring tape around the widest part of your foot</p>
            <p><strong>Step 2:</strong> This is typically at the ball of your foot</p>
            <p><strong>Step 3:</strong> Ensure the tape is snug but not tight</p>
            <p><strong>Step 4:</strong> Record the measurement in millimeters</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-6 p-4 bg-zatorres-gold bg-opacity-20 rounded-lg"
      >
        <p className="text-zatorres-green text-sm font-medium">
          <Lightbulb className="inline mr-2" size={16} />
          <strong>Pro Tip:</strong> Measure your feet in the evening when they're naturally larger, 
          and always measure both feet - use the larger measurement.
        </p>
      </motion.div>
    </motion.div>
  );
}
