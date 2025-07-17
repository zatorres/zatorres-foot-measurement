import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Calculator, Ruler, CircleDot, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { lastDisplayNames, mmToInches, inchesToMm } from '@/lib/sizing-data';

const formSchema = z.object({
  lastType: z.string().min(1, "Please select a shoe last"),
  footLengthMm: z.number().min(220, "Foot length must be at least 220mm").max(350, "Foot length cannot exceed 350mm"),
  ballGirthMm: z.number().min(220, "Ball girth must be at least 220mm").max(320, "Ball girth cannot exceed 320mm"),
});

type FormData = z.infer<typeof formSchema>;

interface MeasurementFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  onReset?: () => void;
}

export default function MeasurementForm({ onSubmit, isLoading }: MeasurementFormProps) {
  const [footLengthInches, setFootLengthInches] = useState<string>('');
  const [ballGirthInches, setBallGirthInches] = useState<string>('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastType: '',
      footLengthMm: 0,
      ballGirthMm: 0,
    },
  });

  const handleFootLengthMmChange = (value: string) => {
    const mm = parseFloat(value);
    if (!isNaN(mm) && mm > 0) {
      form.setValue('footLengthMm', mm);
      setFootLengthInches(mmToInches(mm).toFixed(1));
    } else {
      setFootLengthInches('');
    }
  };

  const handleFootLengthInchesChange = (value: string) => {
    const inches = parseFloat(value);
    if (!isNaN(inches) && inches > 0) {
      const mm = inchesToMm(inches);
      form.setValue('footLengthMm', mm);
      setFootLengthInches(value);
    } else {
      setFootLengthInches(value);
    }
  };

  const handleBallGirthMmChange = (value: string) => {
    const mm = parseFloat(value);
    if (!isNaN(mm) && mm > 0) {
      form.setValue('ballGirthMm', mm);
      setBallGirthInches(mmToInches(mm).toFixed(1));
    } else {
      setBallGirthInches('');
    }
  };

  const handleBallGirthInchesChange = (value: string) => {
    const inches = parseFloat(value);
    if (!isNaN(inches) && inches > 0) {
      const mm = inchesToMm(inches);
      form.setValue('ballGirthMm', mm);
      setBallGirthInches(value);
    } else {
      setBallGirthInches(value);
    }
  };

  const handleReset = () => {
    form.reset({
      lastType: '',
      footLengthMm: 0,
      ballGirthMm: 0,
    });
    setFootLengthInches('');
    setBallGirthInches('');
    onReset?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-8 mb-8"
    >
      <h2 className="font-playfair text-2xl font-bold text-zatorres-green mb-6 text-center">
        Enter Your Measurements
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Last Selection */}
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
                    <SelectTrigger className="w-full px-4 py-3 border-2 border-zatorres-sage rounded-lg focus:border-zatorres-gold focus:outline-none transition-colors bg-white">
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

          {/* Foot Length */}
          <div>
            <Label className="text-sm font-medium text-zatorres-green mb-2 block">
              <Ruler className="inline mr-2 text-zatorres-gold" size={16} />
              Foot Length
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="number"
                  placeholder="Enter in mm"
                  className="w-full px-4 py-3 border-2 border-zatorres-sage rounded-lg focus:border-zatorres-gold focus:outline-none transition-colors"
                  min="220"
                  max="350"
                  step="0.1"
                  onChange={(e) => handleFootLengthMmChange(e.target.value)}
                />
                <span className="text-xs text-zatorres-sage mt-1 block">Millimeters</span>
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Enter in inches"
                  className="w-full px-4 py-3 border-2 border-zatorres-sage rounded-lg focus:border-zatorres-gold focus:outline-none transition-colors"
                  min="8.5"
                  max="14"
                  step="0.1"
                  value={footLengthInches}
                  onChange={(e) => handleFootLengthInchesChange(e.target.value)}
                />
                <span className="text-xs text-zatorres-sage mt-1 block">Inches</span>
              </div>
            </div>
          </div>

          {/* Ball Girth */}
          <div>
            <Label className="text-sm font-medium text-zatorres-green mb-2 block">
              <CircleDot className="inline mr-2 text-zatorres-gold" size={16} />
              Ball Girth Width
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="number"
                  placeholder="Enter in mm"
                  className="w-full px-4 py-3 border-2 border-zatorres-sage rounded-lg focus:border-zatorres-gold focus:outline-none transition-colors"
                  min="220"
                  max="320"
                  step="0.1"
                  onChange={(e) => handleBallGirthMmChange(e.target.value)}
                />
                <span className="text-xs text-zatorres-sage mt-1 block">Millimeters</span>
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Enter in inches"
                  className="w-full px-4 py-3 border-2 border-zatorres-sage rounded-lg focus:border-zatorres-gold focus:outline-none transition-colors"
                  min="8.5"
                  max="12.6"
                  step="0.1"
                  value={ballGirthInches}
                  onChange={(e) => handleBallGirthInchesChange(e.target.value)}
                />
                <span className="text-xs text-zatorres-sage mt-1 block">Inches</span>
              </div>
            </div>
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-zatorres-green text-white px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Calculator className="mr-2" size={16} />
              {isLoading ? 'Calculating...' : 'Calculate My Size'}
            </Button>
            
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              className="border-2 border-zatorres-sage text-zatorres-sage px-6 py-4 rounded-lg font-semibold hover:bg-zatorres-sage hover:text-white transition-all duration-200"
            >
              <RotateCcw className="mr-2" size={16} />
              Reset Measurements
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
