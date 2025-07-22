import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: 'Measurements' },
    { number: 2, label: 'Select Last' },
    { number: 3, label: 'Results' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-2">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-1 md:gap-4 justify-center">
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
                <span className={`ml-1 md:ml-2 font-medium transition-colors duration-300 text-xs md:text-base ${
                  currentStep >= step.number ? 'text-zatorres-green' : 'text-zatorres-sage'
                } hidden sm:inline`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 w-4 md:w-12 mx-1 md:mx-4 transition-colors duration-300 ${
                  currentStep > step.number ? 'bg-zatorres-green' : 'bg-zatorres-sage'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
