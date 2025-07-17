import { motion } from 'framer-motion';
import { Ruler, CircleDot, Lightbulb } from 'lucide-react';

// Custom SVG illustrations for measurement steps
const FootTracingIllustration = () => (
  <svg viewBox="0 0 400 300" className="w-full h-48">
    {/* Paper background */}
    <rect x="20" y="40" width="360" height="220" fill="#ffffff" stroke="#878E85" strokeWidth="2" rx="4"/>
    
    {/* Foot outline being traced */}
    <path d="M80 80 Q90 75 120 80 Q160 85 200 90 Q240 100 280 120 Q300 140 310 160 Q315 180 310 200 Q300 220 280 235 Q260 245 240 250 Q200 255 160 250 Q120 245 90 235 Q70 220 65 200 Q60 180 65 160 Q70 140 80 120 Q85 100 80 80" 
          fill="none" stroke="#0c320c" strokeWidth="2" strokeDasharray="5,5"/>
    
    {/* Sock texture inside foot */}
    <path d="M90 90 Q100 85 130 90 Q170 95 210 100 Q250 110 280 130 Q300 150 305 170 Q310 190 305 210 Q295 230 275 240 Q255 250 235 245 Q195 240 155 235 Q115 230 95 220 Q75 205 70 185 Q65 165 70 145 Q75 125 90 105 Q85 95 90 90" 
          fill="#f0f0f0" opacity="0.7"/>
    
    {/* Pencil tracing */}
    <circle cx="200" cy="90" r="4" fill="#d3c382"/>
    <line x1="200" y1="90" x2="210" y2="75" stroke="#8B4513" strokeWidth="3"/>
    <line x1="210" y1="75" x2="215" y2="65" stroke="#FFD700" strokeWidth="2"/>
    
    {/* Hand holding pencil */}
    <ellipse cx="220" cy="60" rx="15" ry="8" fill="#f4c2a1"/>
    <path d="M205 65 Q210 60 215 65" stroke="#f4c2a1" strokeWidth="4" fill="none"/>
    
    {/* Text label */}
    <text x="50" y="280" fill="#0c320c" fontSize="14" fontWeight="bold">Step 1: Trace foot outline</text>
  </svg>
);

const LengthMeasurementIllustration = () => (
  <svg viewBox="0 0 400 300" className="w-full h-48">
    {/* Paper background */}
    <rect x="20" y="40" width="360" height="220" fill="#ffffff" stroke="#878E85" strokeWidth="2" rx="4"/>
    
    {/* Foot outline */}
    <path d="M80 80 Q90 75 120 80 Q160 85 200 90 Q240 100 280 120 Q300 140 310 160 Q315 180 310 200 Q300 220 280 235 Q260 245 240 250 Q200 255 160 250 Q120 245 90 235 Q70 220 65 200 Q60 180 65 160 Q70 140 80 120 Q85 100 80 80" 
          fill="none" stroke="#0c320c" strokeWidth="2"/>
    
    {/* Heel line */}
    <line x1="60" y1="80" x2="100" y2="80" stroke="#d3c382" strokeWidth="3"/>
    <text x="45" y="75" fill="#d3c382" fontSize="12" fontWeight="bold">Heel</text>
    
    {/* Toe line */}
    <line x1="290" y1="120" x2="330" y2="120" stroke="#d3c382" strokeWidth="3"/>
    <text x="335" y="115" fill="#d3c382" fontSize="12" fontWeight="bold">Toe</text>
    
    {/* Measurement arrow */}
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#0c320c"/>
      </marker>
    </defs>
    <line x1="80" y1="270" x2="310" y2="270" stroke="#0c320c" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
    
    {/* Ruler */}
    <rect x="75" y="265" width="240" height="10" fill="#FFD700" stroke="#0c320c" strokeWidth="1"/>
    <g stroke="#0c320c" strokeWidth="1">
      <line x1="85" y1="265" x2="85" y2="275"/>
      <line x1="95" y1="265" x2="95" y2="275"/>
      <line x1="105" y1="265" x2="105" y2="275"/>
      <line x1="115" y1="265" x2="115" y2="275"/>
      <line x1="125" y1="265" x2="125" y2="275"/>
    </g>
    
    <text x="150" y="290" fill="#0c320c" fontSize="14" fontWeight="bold">Step 2: Measure longest point</text>
  </svg>
);

const BallGirthIllustration = () => (
  <svg viewBox="0 0 400 300" className="w-full h-48">
    {/* Paper background */}
    <rect x="20" y="40" width="360" height="220" fill="#ffffff" stroke="#878E85" strokeWidth="2" rx="4"/>
    
    {/* Foot outline */}
    <path d="M80 80 Q90 75 120 80 Q160 85 200 90 Q240 100 280 120 Q300 140 310 160 Q315 180 310 200 Q300 220 280 235 Q260 245 240 250 Q200 255 160 250 Q120 245 90 235 Q70 220 65 200 Q60 180 65 160 Q70 140 80 120 Q85 100 80 80" 
          fill="#f0f0f0" stroke="#0c320c" strokeWidth="2"/>
    
    {/* Ball of foot area highlighted */}
    <ellipse cx="200" cy="180" rx="80" ry="40" fill="#d3c382" fillOpacity="0.3" stroke="#d3c382" strokeWidth="2" strokeDasharray="3,3"/>
    
    {/* Measuring tape wrapped around */}
    <ellipse cx="200" cy="180" rx="85" ry="45" fill="none" stroke="#FFD700" strokeWidth="4"/>
    
    {/* Measuring tape details */}
    <rect x="280" y="170" width="30" height="8" fill="#FFD700" stroke="#0c320c" strokeWidth="1"/>
    <text x="285" y="177" fill="#0c320c" fontSize="8">cm</text>
    
    {/* Tape markings */}
    <g stroke="#0c320c" strokeWidth="1">
      <line x1="160" y1="140" x2="160" y2="145"/>
      <line x1="180" y1="135" x2="180" y2="140"/>
      <line x1="200" y1="133" x2="200" y2="138"/>
      <line x1="220" y1="135" x2="220" y2="140"/>
      <line x1="240" y1="140" x2="240" y2="145"/>
    </g>
    
    {/* Hand positioning tape */}
    <ellipse cx="290" cy="165" rx="12" ry="6" fill="#f4c2a1"/>
    <ellipse cx="120" cy="195" rx="12" ry="6" fill="#f4c2a1"/>
    
    <text x="120" y="290" fill="#0c320c" fontSize="14" fontWeight="bold">Step 3: Wrap tape around ball of foot</text>
  </svg>
);

export default function MeasurementGuide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-8 mb-8"
    >
      <h2 className="font-playfair text-2xl font-bold text-zatorres-green mb-6 text-center">
        Refined Measurement Instructions
      </h2>
      
      {/* Three-step visual guide */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Step 1: Foot Tracing */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-zatorres-cream p-6 rounded-lg"
        >
          <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-4 text-center">
            Step 1: Trace Your Foot
          </h3>
          
          <div className="bg-white rounded-lg p-4 mb-4 border-2 border-zatorres-sage">
            <FootTracingIllustration />
          </div>
          
          <div className="space-y-2 text-sm text-zatorres-green">
            <p>• Position paper on firm, level surface</p>
            <p>• Don your preferred dress socks</p>
            <p>• Trace complete foot outline with pen perpendicular to paper</p>
          </div>
        </motion.div>

        {/* Step 2: Length Measurement */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-zatorres-cream p-6 rounded-lg"
        >
          <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-4 text-center">
            Step 2: Mark Length
          </h3>
          
          <div className="bg-white rounded-lg p-4 mb-4 border-2 border-zatorres-sage">
            <LengthMeasurementIllustration />
          </div>
          
          <div className="space-y-2 text-sm text-zatorres-green">
            <p>• Draw horizontal lines at heel and longest toe</p>
            <p>• Measure longest point between these lines</p>
            <p>• Note this measurement beside your outline</p>
          </div>
        </motion.div>

        {/* Step 3: Ball Girth */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-zatorres-cream p-6 rounded-lg"
        >
          <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-4 text-center">
            Step 3: Ball Girth
          </h3>
          
          <div className="bg-white rounded-lg p-4 mb-4 border-2 border-zatorres-sage">
            <BallGirthIllustration />
          </div>
          
          <div className="space-y-2 text-sm text-zatorres-green">
            <p>• Locate widest portion of your foot</p>
            <p>• Wrap measuring tape completely around at this point</p>
            <p>• Write down this measurement beside your outline</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-6 p-4 bg-zatorres-gold bg-opacity-20 rounded-lg"
      >
        <p className="text-zatorres-green text-sm font-medium">
          <Lightbulb className="inline mr-2" size={16} />
          <strong>Essential:</strong> Please complete this process for both feet. Your feet will naturally differ in dimensions - this is entirely normal and precisely why we require measurements from both feet. We will craft your recommendations using the measurements from your larger foot to ensure optimal comfort and elegance.
        </p>
      </motion.div>
    </motion.div>
  );
}
