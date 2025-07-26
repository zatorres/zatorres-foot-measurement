import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { AlertCircle, Info } from 'lucide-react';

const measurementSchema = z.object({
  leftFootLength: z.string().min(1, 'Left foot length is required'),
  leftFootWidth: z.string().min(1, 'Left foot width is required'),
  rightFootLength: z.string().min(1, 'Right foot length is required'),
  rightFootWidth: z.string().min(1, 'Right foot width is required'),
});

type MeasurementFormData = z.infer<typeof measurementSchema>;

interface MeasurementFormProps {
  onSubmit: (data: MeasurementFormData) => void;
}

export const MeasurementForm: React.FC<MeasurementFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MeasurementFormData>({
    resolver: zodResolver(measurementSchema),
  });

  const onSubmitForm = async (data: MeasurementFormData) => {
    setIsSubmitting(true);
    try {
      onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        {/* Pro Tip */}
        <div className="bg-gradient-to-r from-zatorres-gold to-zatorres-cream p-4 rounded-lg border border-zatorres-gold">
          <div className="flex items-start space-x-3">
            <Info className="text-zatorres-green mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-zatorres-green mb-1">Pro Tip</h4>
              <p className="text-sm text-zatorres-green">
                Measure both feet and use the larger measurements for the most accurate fit.
              </p>
            </div>
          </div>
        </div>

        {/* Measurement Fields */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Foot */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-semibold text-zatorres-green">Left Foot</h3>
            
            <div>
              <label className="block text-sm font-medium text-zatorres-green mb-2">
                Length (mm)
              </label>
              <input
                type="number"
                {...register('leftFootLength')}
                placeholder="e.g., 265"
                className="w-full px-4 py-3 border border-zatorres-sage rounded-lg focus:ring-2 focus:ring-zatorres-gold focus:border-transparent bg-white text-zatorres-green placeholder-zatorres-green placeholder-opacity-60"
              />
              {errors.leftFootLength && (
                <p className="mt-1 text-sm text-red-600">{errors.leftFootLength.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zatorres-green mb-2">
                Width (mm)
              </label>
              <input
                type="number"
                {...register('leftFootWidth')}
                placeholder="e.g., 95"
                className="w-full px-4 py-3 border border-zatorres-sage rounded-lg focus:ring-2 focus:ring-zatorres-gold focus:border-transparent bg-white text-zatorres-green placeholder-zatorres-green placeholder-opacity-60"
              />
              {errors.leftFootWidth && (
                <p className="mt-1 text-sm text-red-600">{errors.leftFootWidth.message}</p>
              )}
            </div>
          </div>

          {/* Right Foot */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-semibold text-zatorres-green">Right Foot</h3>
            
            <div>
              <label className="block text-sm font-medium text-zatorres-green mb-2">
                Length (mm)
              </label>
              <input
                type="number"
                {...register('rightFootLength')}
                placeholder="e.g., 265"
                className="w-full px-4 py-3 border border-zatorres-sage rounded-lg focus:ring-2 focus:ring-zatorres-gold focus:border-transparent bg-white text-zatorres-green placeholder-zatorres-green placeholder-opacity-60"
              />
              {errors.rightFootLength && (
                <p className="mt-1 text-sm text-red-600">{errors.rightFootLength.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zatorres-green mb-2">
                Width (mm)
              </label>
              <input
                type="number"
                {...register('rightFootWidth')}
                placeholder="e.g., 95"
                className="w-full px-4 py-3 border border-zatorres-sage rounded-lg focus:ring-2 focus:ring-zatorres-gold focus:border-transparent bg-white text-zatorres-green placeholder-zatorres-green placeholder-opacity-60"
              />
              {errors.rightFootWidth && (
                <p className="mt-1 text-sm text-red-600">{errors.rightFootWidth.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-zatorres-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-zatorres-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Continue to Last Selection'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
