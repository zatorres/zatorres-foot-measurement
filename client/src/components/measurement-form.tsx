import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Calculator, Ruler, CircleDot, RotateCcw, Footprints, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { lastDisplayNames, mmToInches, inchesToMm } from '@/lib/sizing-data';
import { useRef } from 'react';
import axios from 'axios';

const measurementOnlySchema = z.object({
  leftFootLengthMm: z.number().min(220, "Left foot length must be at least 220mm").max(350, "Left foot length cannot exceed 350mm"),
  leftBallGirthMm: z.number().min(220, "Left foot width must be at least 220mm").max(320, "Left foot width cannot exceed 320mm"),
  rightFootLengthMm: z.number().min(220, "Right foot length must be at least 220mm").max(350, "Right foot length cannot exceed 350mm"),
  rightBallGirthMm: z.number().min(220, "Right foot width must be at least 220mm").max(320, "Right foot width cannot exceed 320mm"),
});

const fullFormSchema = z.object({
  lastType: z.string().min(1, "Please select a shoe last"),
  leftFootLengthMm: z.number().min(220, "Left foot length must be at least 220mm").max(350, "Left foot length cannot exceed 350mm"),
  leftBallGirthMm: z.number().min(220, "Left foot width must be at least 220mm").max(320, "Left foot width cannot exceed 320mm"),
  rightFootLengthMm: z.number().min(220, "Right foot length must be at least 220mm").max(350, "Right foot length cannot exceed 350mm"),
  rightBallGirthMm: z.number().min(220, "Right foot width must be at least 220mm").max(320, "Right foot width cannot exceed 320mm"),
});

type MeasurementOnlyData = z.infer<typeof measurementOnlySchema>;
type FullFormData = z.infer<typeof fullFormSchema>;

interface MeasurementFormProps {
  onSubmit: (data: FullFormData) => void;
  onMeasurementSubmit?: (data: MeasurementOnlyData) => void;
  isLoading?: boolean;
  onReset?: () => void;
  measurementOnly?: boolean;
}

// Auto-detection and conversion utilities
const detectUnit = (value: string): 'mm' | 'cm' | 'inches' => {
  const num = parseFloat(value);
  if (isNaN(num)) return 'mm';
  
  // If value ends with ", it's inches
  if (value.includes('"') || value.includes('"')) return 'inches';
  
  // If value ends with cm, it's cm
  if (value.toLowerCase().includes('cm')) return 'cm';
  
  // If value ends with mm, it's mm
  if (value.toLowerCase().includes('mm')) return 'mm';
  
  // Auto-detect based on ranges
  if (num >= 8 && num <= 14) return 'inches'; // Common shoe sizes
  if (num >= 20 && num <= 35) return 'cm'; // Common cm ranges
  if (num >= 200 && num <= 350) return 'mm'; // Common mm ranges
  
  return 'mm'; // Default
};

const convertValue = (value: string, fromUnit: 'mm' | 'cm' | 'inches') => {
  const num = parseFloat(value);
  if (isNaN(num)) return { mm: 0, cm: 0, inches: 0 };
  
  let mm = 0;
  switch (fromUnit) {
    case 'inches':
      mm = inchesToMm(num);
      break;
    case 'cm':
      mm = num * 10;
      break;
    case 'mm':
      mm = num;
      break;
  }
  
  return {
    mm: Math.round(mm),
    cm: (mm / 10).toFixed(1),
    inches: mmToInches(mm).toFixed(1)
  };
};

export default function MeasurementForm({ 
  onSubmit, 
  onMeasurementSubmit, 
  isLoading, 
  onReset, 
  measurementOnly = false 
}: MeasurementFormProps) {
  // Keep original state for easy rollback
  const [leftFootLengthInches, setLeftFootLengthInches] = useState<string>('');
  const [leftBallGirthInches, setLeftBallGirthInches] = useState<string>('');
  const [rightFootLengthInches, setRightFootLengthInches] = useState<string>('');
  const [rightBallGirthInches, setRightBallGirthInches] = useState<string>('');

  // New auto-detection state
  const [leftFootLengthInput, setLeftFootLengthInput] = useState<string>('');
  const [leftBallGirthInput, setLeftBallGirthInput] = useState<string>('');
  const [rightFootLengthInput, setRightFootLengthInput] = useState<string>('');
  const [rightBallGirthInput, setRightBallGirthInput] = useState<string>('');

  const [topDownPhoto, setTopDownPhoto] = useState<File | null>(null);
  const [sidePhoto, setSidePhoto] = useState<File | null>(null);
  const topDownInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);
  const [measuredLength, setMeasuredLength] = useState<number | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [paperType, setPaperType] = useState<'A4' | 'Letter'>('A4');

  const handlePhotoMeasure = async () => {
    if (!topDownPhoto) return;
    setPhotoLoading(true);
    setPhotoError(null);
    setMeasuredLength(null);
    try {
      const formData = new FormData();
      formData.append('photo', topDownPhoto);
      formData.append('paper_type', paperType);
      const res = await axios.post('/api/measure-foot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMeasuredLength(res.data.foot_length_mm);
    } catch (err: any) {
      setPhotoError(err.response?.data?.error || 'Measurement failed. Please try again.');
    } finally {
      setPhotoLoading(false);
    }
  };

  const form = useForm<FullFormData>({
    resolver: zodResolver(measurementOnly ? measurementOnlySchema : fullFormSchema),
    defaultValues: {
      lastType: '',
      leftFootLengthMm: 0,
      leftBallGirthMm: 0,
      rightFootLengthMm: 0,
      rightBallGirthMm: 0,
    },
  });

  // Auto-detection handlers
  const handleLeftFootLengthInput = (value: string) => {
    setLeftFootLengthInput(value);
    const unit = detectUnit(value);
    const conversions = convertValue(value, unit);
    
    if (conversions.mm > 0) {
      form.setValue('leftFootLengthMm', conversions.mm);
      setLeftFootLengthInches(conversions.inches.toString());
    }
  };

  const handleLeftBallGirthInput = (value: string) => {
    setLeftBallGirthInput(value);
    const unit = detectUnit(value);
    const conversions = convertValue(value, unit);
    
    if (conversions.mm > 0) {
      form.setValue('leftBallGirthMm', conversions.mm);
      setLeftBallGirthInches(conversions.inches.toString());
    }
  };

  const handleRightFootLengthInput = (value: string) => {
    setRightFootLengthInput(value);
    const unit = detectUnit(value);
    const conversions = convertValue(value, unit);
    
    if (conversions.mm > 0) {
      form.setValue('rightFootLengthMm', conversions.mm);
      setRightFootLengthInches(conversions.inches.toString());
    }
  };

  const handleRightBallGirthInput = (value: string) => {
    setRightBallGirthInput(value);
    const unit = detectUnit(value);
    const conversions = convertValue(value, unit);
    
    if (conversions.mm > 0) {
      form.setValue('rightBallGirthMm', conversions.mm);
      setRightBallGirthInches(conversions.inches.toString());
    }
  };

  // Original handlers (kept for rollback)
  const handleLeftFootLengthMmChange = (value: string) => {
    const mm = parseFloat(value);
    if (!isNaN(mm) && mm > 0) {
      form.setValue('leftFootLengthMm', mm);
      setLeftFootLengthInches(mmToInches(mm).toFixed(1));
    } else {
      setLeftFootLengthInches('');
    }
  };

  const handleLeftFootLengthInchesChange = (value: string) => {
    const inches = parseFloat(value);
    if (!isNaN(inches) && inches > 0) {
      const mm = inchesToMm(inches);
      form.setValue('leftFootLengthMm', mm);
      setLeftFootLengthInches(value);
    } else {
      setLeftFootLengthInches(value);
    }
  };

  const handleLeftBallGirthMmChange = (value: string) => {
    const mm = parseFloat(value);
    if (!isNaN(mm) && mm > 0) {
      form.setValue('leftBallGirthMm', mm);
      setLeftBallGirthInches(mmToInches(mm).toFixed(1));
    } else {
      setLeftBallGirthInches('');
    }
  };

  const handleLeftBallGirthInchesChange = (value: string) => {
    const inches = parseFloat(value);
    if (!isNaN(inches) && inches > 0) {
      const mm = inchesToMm(inches);
      form.setValue('leftBallGirthMm', mm);
      setLeftBallGirthInches(value);
    } else {
      setLeftBallGirthInches(value);
    }
  };

  const handleRightFootLengthMmChange = (value: string) => {
    const mm = parseFloat(value);
    if (!isNaN(mm) && mm > 0) {
      form.setValue('rightFootLengthMm', mm);
      setRightFootLengthInches(mmToInches(mm).toFixed(1));
    } else {
      setRightFootLengthInches('');
    }
  };

  const handleRightFootLengthInchesChange = (value: string) => {
    const inches = parseFloat(value);
    if (!isNaN(inches) && inches > 0) {
      const mm = inchesToMm(inches);
      form.setValue('rightFootLengthMm', mm);
      setRightFootLengthInches(value);
    } else {
      setRightFootLengthInches(value);
    }
  };

  const handleRightBallGirthMmChange = (value: string) => {
    const mm = parseFloat(value);
    if (!isNaN(mm) && mm > 0) {
      form.setValue('rightBallGirthMm', mm);
      setRightBallGirthInches(mmToInches(mm).toFixed(1));
    } else {
      setRightBallGirthInches('');
    }
  };

  const handleRightBallGirthInchesChange = (value: string) => {
    const inches = parseFloat(value);
    if (!isNaN(inches) && inches > 0) {
      const mm = inchesToMm(inches);
      form.setValue('rightBallGirthMm', mm);
      setRightBallGirthInches(value);
    } else {
      setRightBallGirthInches(value);
    }
  };

  const handleReset = () => {
    form.reset({
      lastType: '',
      leftFootLengthMm: 0,
      leftBallGirthMm: 0,
      rightFootLengthMm: 0,
      rightBallGirthMm: 0,
    });
    setLeftFootLengthInches('');
    setLeftBallGirthInches('');
    setRightFootLengthInches('');
    setRightBallGirthInches('');
    setLeftFootLengthInput('');
    setLeftBallGirthInput('');
    setRightFootLengthInput('');
    setRightBallGirthInput('');
    setTopDownPhoto(null);
    setSidePhoto(null);
    onReset?.();
  };

  const handleSubmit = (data: FullFormData) => {
    // Check if at least one field (MM or inches) is filled for each measurement
    const leftFootLengthFilled = data.leftFootLengthMm > 0 || leftFootLengthInches;
    const leftBallGirthFilled = data.leftBallGirthMm > 0 || leftBallGirthInches;
    const rightFootLengthFilled = data.rightFootLengthMm > 0 || rightFootLengthInches;
    const rightBallGirthFilled = data.rightBallGirthMm > 0 || rightBallGirthInches;
    
    const isAllMeasurementsFilled = leftFootLengthFilled && leftBallGirthFilled && 
                                   rightFootLengthFilled && rightBallGirthFilled;
    
    if (!isAllMeasurementsFilled) {
      return; // Don't submit if any measurement pair is missing
    }

    if (measurementOnly && onMeasurementSubmit) {
      onMeasurementSubmit({
        leftFootLengthMm: data.leftFootLengthMm,
        leftBallGirthMm: data.leftBallGirthMm,
        rightFootLengthMm: data.rightFootLengthMm,
        rightBallGirthMm: data.rightBallGirthMm,
      });
    } else {
      onSubmit(data);
    }
  };

  // Check if at least one field is filled for each measurement
  const leftFootLengthFilled = form.watch('leftFootLengthMm') > 0 || leftFootLengthInches;
  const leftBallGirthFilled = form.watch('leftBallGirthMm') > 0 || leftBallGirthInches;
  const rightFootLengthFilled = form.watch('rightFootLengthMm') > 0 || rightFootLengthInches;
  const rightBallGirthFilled = form.watch('rightBallGirthMm') > 0 || rightBallGirthInches;

  const isAllMeasurementsFilled = leftFootLengthFilled && leftBallGirthFilled && 
                                 rightFootLengthFilled && rightBallGirthFilled;

  // Helper function to get conversion display
  const getConversionDisplay = (input: string) => {
    if (!input) return '';
    const unit = detectUnit(input);
    const conversions = convertValue(input, unit);
    if (conversions.mm === 0) return '';
    
    return `${conversions.mm}mm = ${conversions.cm}cm = ${conversions.inches}"`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-8 mb-8"
    >
      <h2 className="font-playfair text-2xl font-bold text-zatorres-green mb-6 text-center">
        {measurementOnly ? 'Enter Your Measurements' : 'Enter Your Measurements & Select Last'}
      </h2>
      
      {/* Pro Tip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-6 p-3 md:p-4 bg-zatorres-gold bg-opacity-20 rounded-lg border border-zatorres-sage"
      >
        <p className="text-zatorres-green text-xs md:text-sm font-medium">
          You can enter different units for different measurements. 
          For example, use inches for length and millimeters for foot width - our system adapts to your preferences.
        </p>
      </motion.div>
      
      {/* Photo Upload Section */}
      <div className="mb-6 p-4 bg-zatorres-gold bg-opacity-10 rounded-lg border border-zatorres-gold">
        <h3 className="font-playfair text-lg font-semibold text-zatorres-green mb-2">Optional: Photo Measurement (Beta)</h3>
        <p className="text-xs md:text-sm text-zatorres-green mb-2">
          For the most accurate results, you can upload a photo of your socked foot placed flat on a standard sheet of paper (A4 or US Letter).<br />
          <strong>Instructions:</strong> Place your foot flat on the paper, take a photo from directly above, and ensure the entire paper is visible. For girth, you may also upload a side photo.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-xs font-medium text-zatorres-green mb-1">Top-down Photo</label>
            <input
              type="file"
              accept="image/*"
              ref={topDownInputRef}
              onChange={e => setTopDownPhoto(e.target.files?.[0] || null)}
              className="block w-full text-xs text-zatorres-green border border-zatorres-sage rounded p-1"
            />
            {topDownPhoto && <span className="text-xs text-zatorres-green">{topDownPhoto.name}</span>}
            <div className="mt-2 flex items-center gap-2">
              <label className="text-xs text-zatorres-green">Paper Type:</label>
              <select
                value={paperType}
                onChange={e => setPaperType(e.target.value as 'A4' | 'Letter')}
                className="text-xs border border-zatorres-sage rounded px-1 py-0.5"
              >
                <option value="A4">A4 (210x297mm)</option>
                <option value="Letter">Letter (216x279mm)</option>
              </select>
              <button
                type="button"
                onClick={handlePhotoMeasure}
                disabled={photoLoading || !topDownPhoto}
                className="ml-2 px-2 py-1 bg-zatorres-green text-white text-xs rounded disabled:opacity-50"
              >
                {photoLoading ? 'Measuring...' : 'Measure Photo'}
              </button>
            </div>
            {measuredLength && (
              <div className="mt-2 text-xs text-zatorres-green font-semibold">
                Measured Foot Length: {measuredLength} mm
              </div>
            )}
            {photoError && (
              <div className="mt-2 text-xs text-red-600">{photoError}</div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-zatorres-green mb-1">Side Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              ref={sideInputRef}
              onChange={e => setSidePhoto(e.target.files?.[0] || null)}
              className="block w-full text-xs text-zatorres-green border border-zatorres-sage rounded p-1"
            />
            {sidePhoto && <span className="text-xs text-zatorres-green">{sidePhoto.name}</span>}
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Last Selection - Only show if not measurement only */}
          {!measurementOnly && (
            <FormField
              control={form.control}
              name="lastType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-zatorres-green">
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 mr-2 text-zatorres-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                      </svg>
                      Select Shoe Last
                    </div>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full px-4 py-3 border-2 border-zatorres-sage rounded-lg focus:border-zatorres-gold focus:outline-none transition-all duration-300 hover:border-zatorres-gold/50 bg-white">
                        <SelectValue placeholder="Choose your preferred last..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(lastDisplayNames).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Dual Foot Measurements */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Foot Card */}
            <motion.div 
              className="bg-zatorres-cream p-4 md:p-6 rounded-lg border-2 border-zatorres-sage hover:border-zatorres-gold/50 transition-all duration-300"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-playfair text-base md:text-lg font-semibold text-zatorres-green mb-4 text-center">
                <Footprints className="inline mr-2 text-zatorres-gold" size={18} />
                Left Foot Measurements
              </h3>
              
              {/* Left Foot Length */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-zatorres-green mb-2 block">
                  <Ruler className="inline mr-2 text-zatorres-gold" size={16} />
                  Left Foot Length
                </Label>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Try: 8.5, 220, or 22cm"
                    className="w-full px-4 py-3 border-2 border-zatorres-sage rounded-lg focus:border-zatorres-gold focus:outline-none transition-all duration-300 hover:border-zatorres-gold/50"
                    value={leftFootLengthInput}
                    onChange={(e) => handleLeftFootLengthInput(e.target.value)}
                  />
                  {getConversionDisplay(leftFootLengthInput) && (
                    <p className="text-xs text-zatorres-sage italic">
                      {getConversionDisplay(leftFootLengthInput)}
                    </p>
                  )}
                </div>
              </div>

              {/* Left Foot Width */}
              <div>
                <Label className="text-sm font-medium text-zatorres-green mb-2 block">
                  <CircleDot className="inline mr-2 text-zatorres-gold" size={16} />
                  Left Foot Width
                </Label>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Try: 9.5, 250, or 25cm"
                    className="w-full px-4 py-3 border-2 border-zatorres-sage rounded-lg focus:border-zatorres-gold focus:outline-none transition-all duration-300 hover:border-zatorres-gold/50"
                    value={leftBallGirthInput}
                    onChange={(e) => handleLeftBallGirthInput(e.target.value)}
                  />
                  {getConversionDisplay(leftBallGirthInput) && (
                    <p className="text-xs text-zatorres-sage italic">
                      {getConversionDisplay(leftBallGirthInput)}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Foot Card */}
            <motion.div 
              className="bg-zatorres-cream p-4 md:p-6 rounded-lg border-2 border-zatorres-sage hover:border-zatorres-gold/50 transition-all duration-300"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-playfair text-base md:text-lg font-semibold text-zatorres-green mb-4 text-center">
                <Footprints className="inline mr-2 text-zatorres-gold" size={18} />
                Right Foot Measurements
              </h3>
              
              {/* Right Foot Length */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-zatorres-green mb-2 block">
                  <Ruler className="inline mr-2 text-zatorres-gold" size={16} />
                  Right Foot Length
                </Label>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Try: 8.5, 220, or 22cm"
                    className="w-full px-4 py-3 border-2 border-zatorres-sage rounded-lg focus:border-zatorres-gold focus:outline-none transition-all duration-300 hover:border-zatorres-gold/50"
                    value={rightFootLengthInput}
                    onChange={(e) => handleRightFootLengthInput(e.target.value)}
                  />
                  {getConversionDisplay(rightFootLengthInput) && (
                    <p className="text-xs text-zatorres-sage italic">
                      {getConversionDisplay(rightFootLengthInput)}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Foot Width */}
              <div>
                <Label className="text-sm font-medium text-zatorres-green mb-2 block">
                  <CircleDot className="inline mr-2 text-zatorres-gold" size={16} />
                  Right Foot Width
                </Label>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Try: 9.5, 250, or 25cm"
                    className="w-full px-4 py-3 border-2 border-zatorres-sage rounded-lg focus:border-zatorres-gold focus:outline-none transition-all duration-300 hover:border-zatorres-gold/50"
                    value={rightBallGirthInput}
                    onChange={(e) => handleRightBallGirthInput(e.target.value)}
                  />
                  {getConversionDisplay(rightBallGirthInput) && (
                    <p className="text-xs text-zatorres-sage italic">
                      {getConversionDisplay(rightBallGirthInput)}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                type="submit"
                disabled={isLoading || !isAllMeasurementsFilled}
                className="bg-zatorres-green text-white px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={16} />
                    Calculating...
                  </>
                ) : !isAllMeasurementsFilled ? (
                  <>
                    <Calculator className="mr-2" size={16} />
                    Complete All Measurements
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2" size={16} />
                    {measurementOnly ? 'Continue to Last Selection' : 'Calculate My Size'}
                  </>
                )}
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                type="button"
                onClick={handleReset}
                variant="outline"
                className="border-2 border-zatorres-sage text-zatorres-sage px-6 py-4 rounded-lg font-semibold hover:bg-zatorres-sage hover:text-white transition-all duration-300"
              >
                <RotateCcw className="mr-2" size={16} />
                Reset Measurements
              </Button>
            </motion.div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
