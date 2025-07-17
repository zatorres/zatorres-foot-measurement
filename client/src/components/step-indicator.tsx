import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: 'Measure' },
    { number: 2, label: 'Enter Data' },
    { number: 3, label: 'Get Results' }
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
                  currentStep >= step.number
                    ? 'bg-zatorres-green text-white'
                    : 'bg-zatorres-sage text-white'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: currentStep >= step.number ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {step.number}
              </motion.div>
              <span className={`ml-2 font-medium transition-colors duration-300 ${
                currentStep >= step.number ? 'text-zatorres-green' : 'text-zatorres-sage'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 transition-colors duration-300 ${
                currentStep > step.number ? 'bg-zatorres-green' : 'bg-zatorres-sage'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
