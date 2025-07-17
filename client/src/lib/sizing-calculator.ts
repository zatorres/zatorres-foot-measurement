import { sizingData, SizeData } from './sizing-data';

export interface SizeRecommendation {
  size: SizeData;
  width: string;
  fit: 'snugger' | 'best' | 'roomier';
  confidence: number;
}

export interface SizeCalculationResult {
  recommendations: SizeRecommendation[];
  confidence: number;
  message: string;
}

export class SizingCalculator {
  private findClosestSize(
    footLength: number,
    ballGirth: number,
    sizeData: SizeData[]
  ): { size: SizeData; score: number } | null {
    if (!sizeData || sizeData.length === 0) return null;

    let bestMatch: SizeData | null = null;
    let bestScore = Infinity;

    for (const size of sizeData) {
      const lengthDiff = Math.abs(size.footLength - footLength);
      const girthDiff = Math.abs(size.ballGirth - ballGirth);
      
      // Weight foot length more heavily than ball girth
      const score = lengthDiff * 2 + girthDiff;
      
      if (score < bestScore) {
        bestScore = score;
        bestMatch = size;
      }
    }

    return bestMatch ? { size: bestMatch, score: bestScore } : null;
  }

  private determineWidth(ballGirth: number, dWidth: number, eeWidth?: number, eeeWidth?: number): string {
    if (!eeWidth && !eeeWidth) return 'D';
    
    const dDiff = Math.abs(ballGirth - dWidth);
    const eeDiff = eeWidth ? Math.abs(ballGirth - eeWidth) : Infinity;
    const eeeDiff = eeeWidth ? Math.abs(ballGirth - eeeWidth) : Infinity;

    if (dDiff <= eeDiff && dDiff <= eeeDiff) return 'D';
    if (eeDiff <= eeeDiff) return 'EE';
    return 'EEE';
  }

  private calculateConfidence(footLength: number, ballGirth: number, match: SizeData): number {
    const lengthDiff = Math.abs(match.footLength - footLength);
    const girthDiff = Math.abs(match.ballGirth - ballGirth);
    
    // Calculate confidence based on how close the measurements are
    const maxExpectedDiff = 10; // mm
    const totalDiff = lengthDiff + girthDiff;
    const confidence = Math.max(0, 100 - (totalDiff / maxExpectedDiff) * 100);
    
    return Math.round(confidence);
  }

  calculateSize(
    lastType: string,
    footLength: number,
    ballGirth: number
  ): SizeCalculationResult {
    const lastData = sizingData[lastType];
    if (!lastData) {
      return {
        recommendations: [],
        confidence: 0,
        message: `Sizing data not available for ${lastType}`
      };
    }

    const recommendations: SizeRecommendation[] = [];

    // Check each width
    for (const width of ['d', 'ee', 'eee'] as const) {
      const widthData = lastData[width];
      if (!widthData) continue;

      const match = this.findClosestSize(footLength, ballGirth, widthData);
      if (!match) continue;

      const confidence = this.calculateConfidence(footLength, ballGirth, match.size);
      
      recommendations.push({
        size: match.size,
        width: width.toUpperCase(),
        fit: 'best',
        confidence
      });
    }

    if (recommendations.length === 0) {
      return {
        recommendations: [],
        confidence: 0,
        message: 'No suitable size found for your measurements'
      };
    }

    // Sort by confidence and take the best match
    recommendations.sort((a, b) => b.confidence - a.confidence);
    const bestMatch = recommendations[0];

    // Create snugger and roomier recommendations
    const result: SizeRecommendation[] = [];
    const bestSize = bestMatch.size;
    const bestWidth = bestMatch.width.toLowerCase() as 'd' | 'ee' | 'eee';
    const widthData = lastData[bestWidth];

    if (widthData) {
      const currentIndex = widthData.findIndex(s => s.us === bestSize.us);
      
      // Snugger fit (half size down)
      if (currentIndex > 0) {
        result.push({
          size: widthData[currentIndex - 1],
          width: bestMatch.width,
          fit: 'snugger',
          confidence: Math.max(0, bestMatch.confidence - 10)
        });
      }

      // Best fit
      result.push({
        size: bestSize,
        width: bestMatch.width,
        fit: 'best',
        confidence: bestMatch.confidence
      });

      // Roomier fit (half size up)
      if (currentIndex < widthData.length - 1) {
        result.push({
          size: widthData[currentIndex + 1],
          width: bestMatch.width,
          fit: 'roomier',
          confidence: Math.max(0, bestMatch.confidence - 10)
        });
      }
    }

    return {
      recommendations: result,
      confidence: bestMatch.confidence,
      message: result.length > 0 ? 'Size recommendations found' : 'No recommendations available'
    };
  }
}
