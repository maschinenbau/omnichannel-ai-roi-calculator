import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Type Definitions for Props ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface RangeSliderProps {
  label: string;
  id: string;
  value: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  min: string | number;
  max: string | number;
  step: string | number;
  unit?: string;
  helpText?: string;
}

interface LabelWithTooltipProps {
    label: string;
    tooltipText: string;
    labelClasses?: string;
}

// --- Reusable UI Components ---
const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-white shadow rounded-lg ${className || ''}`}>{children}</div>
);

const CardHeader: React.FC<CardHeaderProps> = ({ children, className, onClick }) => (
  <div className={`px-6 py-4 ${className || ''} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
    {children}
  </div>
);

const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <h2 className={`text-xl font-bold text-gray-800 ${className || ''}`}>{children}</h2>
);

const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={`px-6 py-4 ${className || ''}`}>{children}</div>
);

const RangeSlider: React.FC<RangeSliderProps> = ({ label, id, value, onChange, min, max, step, unit = '', helpText = '' }) => {
  const numericValue = Number(value) || 0; 

  const handleNumberInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = Number(e.target.value);
    if (isNaN(newValue)) { 
        const syntheticEvent = { target: { value: String(numericValue) } } as ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent); 
        return;
    }
    if (min !== undefined && newValue < Number(min)) {
        newValue = Number(min);
    }
    if (max !== undefined && newValue > Number(max)) {
        newValue = Number(max);
    }
    const syntheticEvent = { target: { value: String(newValue) } } as ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent); 
  };
  
  // Correctly format the value for the number input
  let valueForInput: string;
  if (unit.includes('$')) {
    valueForInput = numericValue.toFixed(2); // Ensure 2 decimal places for currency for input
  } else if (unit === '%') {
    valueForInput = String(Math.round(numericValue)); // Round percentages for input
  } else {
     const numericStep = Number(step);
     if (Number.isInteger(numericStep) || Number.isInteger(numericValue)) {
        valueForInput = String(Math.round(numericValue));
     } else {
        const decimalPlaces = (String(step).split('.')[1] || '').length || 1;
        valueForInput = numericValue.toFixed(decimalPlaces);
     }
  }
  // Removed unused 'displayValueFormatted' variable
  
  return (
    <div className="mb-5"> 
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center flex-1"> 
          <label htmlFor={id + '-slider'} className="block text-sm font-medium text-gray-600"> 
            {label}
          </label>
          {helpText && (
            <div className="relative flex items-center ml-2 group cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                {helpText}
                <svg className="absolute text-gray-700 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
              </span>
            </div>
          )}
        </div>
        <div className="relative flex items-center ml-2"> 
          <input 
            type="number"
            id={id + '-number'}
            value={valueForInput} 
            onChange={handleNumberInputChange} 
            min={String(min)}
            max={String(max)}
            step={String(step)}
            className={`w-24 p-1 ${unit.includes('$') ? 'pl-6 pr-2' : (unit ? (unit.length > 2 ? 'pl-2 pr-10' : 'pl-2 pr-7') : 'px-2')} border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 text-right text-sm text-gray-700`}
          />
          {unit.includes('$') && (
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">$</span>
          )}
          {!unit.includes('$') && unit && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">{unit}</span>
          )}
        </div>
      </div>
      <input 
        type="range" 
        id={id + '-slider'} 
        name={id + '-slider'} 
        min={String(min)} 
        max={String(max)} 
        step={String(step)} 
        value={String(numericValue)} 
        onChange={onChange} 
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lime-500" 
      />
    </div>
  );
};

const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({ label, tooltipText, labelClasses = "text-md font-semibold text-gray-700" }) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <span className={labelClasses}>{label}</span>
        {tooltipText && (
          <div className="relative flex items-center ml-2 group cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
              {tooltipText}
              <svg className="absolute text-gray-700 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
            </span>
          </div>
        )}
      </div>
    </div>
  );

const PrintStyles: React.FC = () => (
  <style type="text/css">
    {`
      @media print {
        body * { visibility: hidden; }
        #printable-area, #printable-area * { visibility: visible; }
        #printable-area { position: absolute; left: 0; top: 0; width: 100%; }
        .no-print, .no-print * { display: none !important; }
        .print-grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
        .print-p-0 { padding: 0 !important; }
        .print-shadow-none { box-shadow: none !important; }
        .print-border-none { border: none !important; }
        .recharts-legend-wrapper { position: relative !important; }
        .recharts-tooltip-wrapper { display: none !important; }
        .bg-white { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .bg-gray-50 { background-color: #f9fafb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .bg-slate-50 { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .bg-gray-800 { background-color: #1f2937 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .text-white { color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .text-gray-300 { color: #d1d5db !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .text-gray-600 { color: #4b5563 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .text-gray-700 { color: #374151 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .text-gray-800 { color: #1f2937 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .text-lime-600 { color: #65a30d !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .text-red-600 { color: #dc2626 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        input[type=range] { display: none !important; }
        .group .absolute { display: none !important; }
        .collapsible-content { display: block !important; visibility: visible !important; }
      }
    `}
  </style>
);

const safeLocaleString = (value: number, options: Intl.NumberFormatOptions = {}, fallback: string = '0.00'): string => {
  if (typeof value === 'number' && isFinite(value)) {
    return value.toLocaleString(undefined, options);
  }
  if (fallback === 'N/A') return 'N/A';
  const fallbackNum = Number(fallback);
  if (typeof fallbackNum === 'number' && isFinite(fallbackNum)) {
    return fallbackNum.toLocaleString(undefined, options);
  }
  return String(fallback);
};

interface CalculationResults {
  humanVoiceCostMonthly?: number;
  voiceRevenueHuman?: number;
  humanTextCostMonthly?: number;
  textRevenueHuman?: number;
  totalHumanCostMonthly?: number;
  totalRevenueHumanMonthly?: number;
  revenueLostFromMissedCalls?: number;
  aiSetupFee?: number;
  aiMonthlyBaseCost?: number;
  aiVoiceUsageCostMonthly?: number;
  aiTextUsageCostMonthly?: number;
  totalAiPlatformMonthlyCost?: number;
  effectiveTotalAiMonthlyCostY1?: number;
  humanCostForVoiceWithAI?: number;
  humanCostForTextWithAI?: number;
  totalHumanCostWithAI?: number;
  totalLaborCostSavingsMonthly?: number;
  annualCostSavings?: number;
  totalVoiceRevenueIncrease?: number;
  totalTextRevenueIncrease?: number;
  totalRevenueIncreaseMonthly?: number;
  annualRevenueIncrease?: number;
  totalMonthlyGain?: number;
  netMonthlyBenefitY1?: number;
  annualNetGainY1?: number;
  monthlyROI?: number;
  annualROI?: number;
  paybackPeriodMonths?: number;
  aiHandlingPercentage?: number;
  interactionsHandledByAI_autonomously_voice?: number;
  interactionsHandledByAI_autonomously_text?: number;
  monthlyVoiceCalls?: number;
  monthlyTextInteractions?: number;
  voiceSalesAI?: number;
  textSalesAI?: number;
  currentHumanCostChart?: number;
  aiCostY1Chart?: number;
  humanWithAICostChart?: number;
  netBenefitChart?: number;
  estimatedTotalMonthlyTextMessagesProcessedByAI?: number;
}

type IndustryPresetValue = number | string; 

type IndustryPreset = {
  [key: string]: IndustryPresetValue; 
  avgRevenuePerSale: number;
  monthlyVoiceCalls: number;
  avgMissedVoiceCallsDaily: number;
  avgCallDurationHuman: number;
  monthlyTextInteractions: number;
  avgTextInteractionTimeHuman: number;
  humanHourlyCost: number;
  avgMessagesPerTextConversation: number;
  voiceLeadQualificationRate: number;
  voiceAppointmentBookingRate: number;
  voiceAppointmentShowUpRate: number;
  voiceAppointmentToSaleRate: number;
  textLeadQualificationRate: number;
  textAppointmentBookingRate: number;
  textAppointmentShowUpRate: number;
  textAppointmentToSaleRate: number;
  aiAutonomyVoice: number;
  aiAutonomyText: number;
  aiVoiceBookingRateImprovement: number;
  aiVoiceShowUpRateImprovement: number;
  aiTextBookingRateImprovement: number;
  aiTextShowUpRateImprovement: number;
  aiHandlingPercentage: number;
  operatingDaysPerMonth: number;
  basicAiSetupFee: number;
  basicAiMonthlyCost: number;
  basicAiPerMinuteVoiceCost: number;
  basicAiIncludedTextInteractions: number;
  basicAiOverageTextCost: number;
  enterpriseAiSetupFee: number;
  enterpriseAiMonthlyCost: number;
  enterpriseAiPerMinuteVoiceCost: number;
  enterpriseAiIncludedTextInteractions: number;
  enterpriseAiOverageTextCost: number;
};


function OmnichannelAiRoiCalculator() {
  const [industry, setIndustry] = useState<string>('general');
  const industryPresets: Record<string, IndustryPreset> = { 
    general: { 
        avgRevenuePerSale: 500, monthlyVoiceCalls: 300, avgMissedVoiceCallsDaily: 5, avgCallDurationHuman: 10,
        monthlyTextInteractions: 700, avgTextInteractionTimeHuman: 8, humanHourlyCost: 30,
        avgMessagesPerTextConversation: 6, 
        voiceLeadQualificationRate: 20, voiceAppointmentBookingRate: 25, voiceAppointmentShowUpRate: 70, voiceAppointmentToSaleRate: 25,
        textLeadQualificationRate: 25, textAppointmentBookingRate: 30, textAppointmentShowUpRate: 75, textAppointmentToSaleRate: 30,
        aiAutonomyVoice: 75, aiAutonomyText: 85, 
        aiVoiceBookingRateImprovement: 10, aiVoiceShowUpRateImprovement: 10,
        aiTextBookingRateImprovement: 10, aiTextShowUpRateImprovement: 10,
        aiHandlingPercentage: 80, operatingDaysPerMonth: 22,
        basicAiSetupFee: 2000, basicAiMonthlyCost: 497, basicAiPerMinuteVoiceCost: 0.45, 
        basicAiIncludedTextInteractions: 1000, basicAiOverageTextCost: 0.05,
        enterpriseAiSetupFee: 5000, enterpriseAiMonthlyCost: 2000, enterpriseAiPerMinuteVoiceCost: 0.30,
        enterpriseAiIncludedTextInteractions: 10000, enterpriseAiOverageTextCost: 0.03,
    },
    homeServices: { 
        avgRevenuePerSale: 450, monthlyVoiceCalls: 400, avgMissedVoiceCallsDaily: 10, avgCallDurationHuman: 12,
        monthlyTextInteractions: 600, avgTextInteractionTimeHuman: 7, humanHourlyCost: 28,
        avgMessagesPerTextConversation: 5, 
        voiceLeadQualificationRate: 22, voiceAppointmentBookingRate: 28, voiceAppointmentShowUpRate: 65, voiceAppointmentToSaleRate: 28,
        textLeadQualificationRate: 28, textAppointmentBookingRate: 32, textAppointmentShowUpRate: 70, textAppointmentToSaleRate: 32,
        aiAutonomyVoice: 70, aiAutonomyText: 80, 
        aiVoiceBookingRateImprovement: 10, aiVoiceShowUpRateImprovement: 10,
        aiTextBookingRateImprovement: 10, aiTextShowUpRateImprovement: 10,
        aiHandlingPercentage: 75, operatingDaysPerMonth: 26,
        basicAiSetupFee: 2000, basicAiMonthlyCost: 497, basicAiPerMinuteVoiceCost: 0.45, 
        basicAiIncludedTextInteractions: 1000, basicAiOverageTextCost: 0.05,
        enterpriseAiSetupFee: 5000, enterpriseAiMonthlyCost: 2000, enterpriseAiPerMinuteVoiceCost: 0.30,
        enterpriseAiIncludedTextInteractions: 10000, enterpriseAiOverageTextCost: 0.03,
    },
    healthcarePractice: { 
        avgRevenuePerSale: 250, monthlyVoiceCalls: 500, avgMissedVoiceCallsDaily: 8, avgCallDurationHuman: 8,
        monthlyTextInteractions: 1000, avgTextInteractionTimeHuman: 5, humanHourlyCost: 35,
        avgMessagesPerTextConversation: 8, 
        voiceLeadQualificationRate: 15, voiceAppointmentBookingRate: 40, voiceAppointmentShowUpRate: 80, voiceAppointmentToSaleRate: 20,
        textLeadQualificationRate: 20, textAppointmentBookingRate: 45, textAppointmentShowUpRate: 85, textAppointmentToSaleRate: 25,
        aiAutonomyVoice: 80, aiAutonomyText: 90, 
        aiVoiceBookingRateImprovement: 10, aiVoiceShowUpRateImprovement: 10,
        aiTextBookingRateImprovement: 10, aiTextShowUpRateImprovement: 10,
        aiHandlingPercentage: 85, operatingDaysPerMonth: 22,
        basicAiSetupFee: 2000, basicAiMonthlyCost: 497, basicAiPerMinuteVoiceCost: 0.45, 
        basicAiIncludedTextInteractions: 1000, basicAiOverageTextCost: 0.05,
        enterpriseAiSetupFee: 5000, enterpriseAiMonthlyCost: 2000, enterpriseAiPerMinuteVoiceCost: 0.30,
        enterpriseAiIncludedTextInteractions: 10000, enterpriseAiOverageTextCost: 0.03,
    },
     realEstate: { 
        avgRevenuePerSale: 5000,  monthlyVoiceCalls: 200, avgMissedVoiceCallsDaily: 3, avgCallDurationHuman: 15,
        monthlyTextInteractions: 800, avgTextInteractionTimeHuman: 10, humanHourlyCost: 32,
        avgMessagesPerTextConversation: 7, 
        voiceLeadQualificationRate: 10, voiceAppointmentBookingRate: 15, voiceAppointmentShowUpRate: 60, voiceAppointmentToSaleRate: 10,
        textLeadQualificationRate: 15, textAppointmentBookingRate: 20, textAppointmentShowUpRate: 65, textAppointmentToSaleRate: 15,
        aiAutonomyVoice: 65, aiAutonomyText: 75, 
        aiVoiceBookingRateImprovement: 10, aiVoiceShowUpRateImprovement: 10,
        aiTextBookingRateImprovement: 10, aiTextShowUpRateImprovement: 10,
        aiHandlingPercentage: 70, operatingDaysPerMonth: 26,
        basicAiSetupFee: 2000, basicAiMonthlyCost: 497, basicAiPerMinuteVoiceCost: 0.45, 
        basicAiIncludedTextInteractions: 1000, basicAiOverageTextCost: 0.05,
        enterpriseAiSetupFee: 5000, enterpriseAiMonthlyCost: 2000, enterpriseAiPerMinuteVoiceCost: 0.30,
        enterpriseAiIncludedTextInteractions: 10000, enterpriseAiOverageTextCost: 0.03,
    }
  };

  const [avgRevenuePerSale, setAvgRevenuePerSale] = useState<number>(industryPresets.general.avgRevenuePerSale);
  const [operatingDaysPerMonth, setOperatingDaysPerMonth] = useState<number>(industryPresets.general.operatingDaysPerMonth);
  const [monthlyVoiceCalls, setMonthlyVoiceCalls] = useState<number>(industryPresets.general.monthlyVoiceCalls);
  const [avgMissedVoiceCallsDaily, setAvgMissedVoiceCallsDaily] = useState<number>(industryPresets.general.avgMissedVoiceCallsDaily);
  const [avgCallDurationHuman, setAvgCallDurationHuman] = useState<number>(industryPresets.general.avgCallDurationHuman);
  const [monthlyTextInteractions, setMonthlyTextInteractions] = useState<number>(industryPresets.general.monthlyTextInteractions);
  const [avgTextInteractionTimeHuman, setAvgTextInteractionTimeHuman] = useState<number>(industryPresets.general.avgTextInteractionTimeHuman);
  const [humanHourlyCost, setHumanHourlyCost] = useState<number>(industryPresets.general.humanHourlyCost);
  const [avgMessagesPerTextConversation, setAvgMessagesPerTextConversation] = useState<number>(industryPresets.general.avgMessagesPerTextConversation); 

  const [voiceLeadQualificationRate, setVoiceLeadQualificationRate] = useState<number>(industryPresets.general.voiceLeadQualificationRate);
  const [voiceAppointmentBookingRate, setVoiceAppointmentBookingRate] = useState<number>(industryPresets.general.voiceAppointmentBookingRate);
  const [voiceAppointmentShowUpRate, setVoiceAppointmentShowUpRate] = useState<number>(industryPresets.general.voiceAppointmentShowUpRate);
  const [voiceAppointmentToSaleRate, setVoiceAppointmentToSaleRate] = useState<number>(industryPresets.general.voiceAppointmentToSaleRate);
  const [textLeadQualificationRate, setTextLeadQualificationRate] = useState<number>(industryPresets.general.textLeadQualificationRate);
  const [textAppointmentBookingRate, setTextAppointmentBookingRate] = useState<number>(industryPresets.general.textAppointmentBookingRate);
  const [textAppointmentShowUpRate, setTextAppointmentShowUpRate] = useState<number>(industryPresets.general.textAppointmentShowUpRate);
  const [textAppointmentToSaleRate, setTextAppointmentToSaleRate] = useState<number>(industryPresets.general.textAppointmentToSaleRate);
  const [aiTier, setAiTier] = useState<string>('basic');
  const [aiHandlingPercentage, setAiHandlingPercentage] = useState<number>(industryPresets.general.aiHandlingPercentage);
  
  const [basicAiSetupFee, setBasicAiSetupFee] = useState<number>(2000); 
  const [basicAiMonthlyCost, setBasicAiMonthlyCost] = useState<number>(497); 
  const [basicAiPerMinuteVoiceCost, setBasicAiPerMinuteVoiceCost] = useState<number>(0.45); 
  const [basicAiIncludedTextInteractions, setBasicAiIncludedTextInteractions] = useState<number>(1000); 
  const [basicAiOverageTextCost, setBasicAiOverageTextCost] = useState<number>(0.05); 

  const [enterpriseAiSetupFee, setEnterpriseAiSetupFee] = useState<number>(5000); 
  const [enterpriseAiMonthlyCost, setEnterpriseAiMonthlyCost] = useState<number>(2000); 
  const [enterpriseAiPerMinuteVoiceCost, setEnterpriseAiPerMinuteVoiceCost] = useState<number>(0.30); 
  const [enterpriseAiIncludedTextInteractions, setEnterpriseAiIncludedTextInteractions] = useState<number>(10000); 
  const [enterpriseAiOverageTextCost, setEnterpriseAiOverageTextCost] = useState<number>(0.03); 

  const [aiAutonomyVoice, setAiAutonomyVoice] = useState<number>(industryPresets.general.aiAutonomyVoice);
  const [aiAutonomyText, setAiAutonomyText] = useState<number>(industryPresets.general.aiAutonomyText);
  const [aiVoiceBookingRateImprovement, setAiVoiceBookingRateImprovement] = useState<number>(10); 
  const [aiVoiceShowUpRateImprovement, setAiVoiceShowUpRateImprovement] = useState<number>(10); 
  const [aiTextBookingRateImprovement, setAiTextBookingRateImprovement] = useState<number>(10); 
  const [aiTextShowUpRateImprovement, setAiTextShowUpRateImprovement] = useState<number>(10); 
  
  const [results, setResults] = useState<CalculationResults>({});
  const [isInsightsOpen, setIsInsightsOpen] = useState<boolean>(false);
  const [isQualitativeOpen, setIsQualitativeOpen] = useState<boolean>(false);

  const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(Number(e.target.value));
  };
  const handleSelectChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
  };

 useEffect(() => {
    const preset = industryPresets[industry] || industryPresets.general;
    setAvgRevenuePerSale(preset.avgRevenuePerSale);
    setOperatingDaysPerMonth(preset.operatingDaysPerMonth);
    setMonthlyVoiceCalls(preset.monthlyVoiceCalls);
    setAvgMissedVoiceCallsDaily(preset.avgMissedVoiceCallsDaily);
    setAvgCallDurationHuman(preset.avgCallDurationHuman);
    setMonthlyTextInteractions(preset.monthlyTextInteractions);
    setAvgTextInteractionTimeHuman(preset.avgTextInteractionTimeHuman);
    setHumanHourlyCost(preset.humanHourlyCost);
    setAvgMessagesPerTextConversation(preset.avgMessagesPerTextConversation); 
    setVoiceLeadQualificationRate(preset.voiceLeadQualificationRate);
    setVoiceAppointmentBookingRate(preset.voiceAppointmentBookingRate);
    setVoiceAppointmentShowUpRate(preset.voiceAppointmentShowUpRate);
    setVoiceAppointmentToSaleRate(preset.voiceAppointmentToSaleRate);
    setTextLeadQualificationRate(preset.textLeadQualificationRate);
    setTextAppointmentBookingRate(preset.textAppointmentBookingRate);
    setTextAppointmentShowUpRate(preset.textAppointmentShowUpRate);
    setTextAppointmentToSaleRate(preset.textAppointmentToSaleRate);
    setAiAutonomyVoice(preset.aiAutonomyVoice);
    setAiAutonomyText(preset.aiAutonomyText);
    setAiVoiceBookingRateImprovement(preset.aiVoiceBookingRateImprovement);
    setAiVoiceShowUpRateImprovement(preset.aiVoiceShowUpRateImprovement);
    setAiTextBookingRateImprovement(preset.aiTextBookingRateImprovement);
    setAiTextShowUpRateImprovement(preset.aiTextShowUpRateImprovement);
    setAiHandlingPercentage(preset.aiHandlingPercentage);
    
    setBasicAiSetupFee(preset.basicAiSetupFee || 2000);
    setBasicAiMonthlyCost(preset.basicAiMonthlyCost || 497);
    setBasicAiPerMinuteVoiceCost(preset.basicAiPerMinuteVoiceCost || 0.45);
    setBasicAiIncludedTextInteractions(preset.basicAiIncludedTextInteractions || 1000);
    setBasicAiOverageTextCost(preset.basicAiOverageTextCost || 0.05);
    setEnterpriseAiSetupFee(preset.enterpriseAiSetupFee || 5000);
    setEnterpriseAiMonthlyCost(preset.enterpriseAiMonthlyCost || 2000);
    setEnterpriseAiPerMinuteVoiceCost(preset.enterpriseAiPerMinuteVoiceCost || 0.30);
    setEnterpriseAiIncludedTextInteractions(preset.enterpriseAiIncludedTextInteractions || 10000);
    setEnterpriseAiOverageTextCost(preset.enterpriseAiOverageTextCost || 0.03);
  }, [industry]);

  useEffect(() => {
    const N_avgRevenuePerSale = Number(avgRevenuePerSale) || 0;
    const N_operatingDaysPerMonth = Number(operatingDaysPerMonth) || 0;
    const N_monthlyVoiceCalls = Number(monthlyVoiceCalls) || 0;
    const N_avgMissedVoiceCallsDaily = Number(avgMissedVoiceCallsDaily) || 0;
    const N_avgCallDurationHuman = Number(avgCallDurationHuman) || 0;
    const N_monthlyTextInteractions = Number(monthlyTextInteractions) || 0;
    const N_avgTextInteractionTimeHuman = Number(avgTextInteractionTimeHuman) || 0;
    const N_humanHourlyCost = Number(humanHourlyCost) || 0;
    const N_avgMessagesPerTextConversation = Number(avgMessagesPerTextConversation) || 0; 

    const N_voiceLeadQualificationRate = Number(voiceLeadQualificationRate) || 0;
    const N_voiceAppointmentBookingRate = Number(voiceAppointmentBookingRate) || 0;
    const N_voiceAppointmentShowUpRate = Number(voiceAppointmentShowUpRate) || 0;
    const N_voiceAppointmentToSaleRate = Number(voiceAppointmentToSaleRate) || 0;
    const N_textLeadQualificationRate = Number(textLeadQualificationRate) || 0;
    const N_textAppointmentBookingRate = Number(textAppointmentBookingRate) || 0;
    const N_textAppointmentShowUpRate = Number(textAppointmentShowUpRate) || 0;
    const N_textAppointmentToSaleRate = Number(textAppointmentToSaleRate) || 0;
    const N_aiHandlingPercentage = Number(aiHandlingPercentage) || 0;
    const N_basicAiSetupFee = Number(basicAiSetupFee) || 0;
    const N_basicAiMonthlyCost = Number(basicAiMonthlyCost) || 0;
    const N_basicAiPerMinuteVoiceCost = Number(basicAiPerMinuteVoiceCost) || 0;
    const N_basicAiIncludedTextInteractions = Number(basicAiIncludedTextInteractions) || 0;
    const N_basicAiOverageTextCost = Number(basicAiOverageTextCost) || 0;
    const N_enterpriseAiSetupFee = Number(enterpriseAiSetupFee) || 0;
    const N_enterpriseAiMonthlyCost = Number(enterpriseAiMonthlyCost) || 0;
    const N_enterpriseAiPerMinuteVoiceCost = Number(enterpriseAiPerMinuteVoiceCost) || 0;
    const N_enterpriseAiIncludedTextInteractions = Number(enterpriseAiIncludedTextInteractions) || 0;
    const N_enterpriseAiOverageTextCost = Number(enterpriseAiOverageTextCost) || 0;
    const N_aiAutonomyVoice = Number(aiAutonomyVoice) || 0;
    const N_aiAutonomyText = Number(aiAutonomyText) || 0;
    const N_aiVoiceBookingRateImprovement = Number(aiVoiceBookingRateImprovement) || 0;
    const N_aiVoiceShowUpRateImprovement = Number(aiVoiceShowUpRateImprovement) || 0;
    const N_aiTextBookingRateImprovement = Number(aiTextBookingRateImprovement) || 0;
    const N_aiTextShowUpRateImprovement = Number(aiTextShowUpRateImprovement) || 0;

    const humanTotalVoiceMinutesMonthly = N_monthlyVoiceCalls * N_avgCallDurationHuman;
    const humanVoiceCostMonthly = (humanTotalVoiceMinutesMonthly / 60) * N_humanHourlyCost;
    const voiceQualifiedLeadsHuman = N_monthlyVoiceCalls * (N_voiceLeadQualificationRate / 100);
    const voiceAppointmentsBookedHuman = voiceQualifiedLeadsHuman * (N_voiceAppointmentBookingRate / 100);
    const voiceAppointmentsAttendedHuman = voiceAppointmentsBookedHuman * (N_voiceAppointmentShowUpRate / 100);
    const voiceSalesHuman = voiceAppointmentsAttendedHuman * (N_voiceAppointmentToSaleRate / 100);
    const voiceRevenueHuman = voiceSalesHuman * N_avgRevenuePerSale;
    const monthlyMissedCalls = N_avgMissedVoiceCallsDaily * N_operatingDaysPerMonth;
    const revenueLostFromMissedCalls = monthlyMissedCalls * (N_voiceLeadQualificationRate / 100) * (N_voiceAppointmentBookingRate / 100) * (N_voiceAppointmentShowUpRate / 100) * (N_voiceAppointmentToSaleRate / 100) * N_avgRevenuePerSale;
    const humanTotalTextMinutesMonthly = N_monthlyTextInteractions * N_avgTextInteractionTimeHuman;
    const humanTextCostMonthly = (humanTotalTextMinutesMonthly / 60) * N_humanHourlyCost;
    const textQualifiedLeadsHuman = N_monthlyTextInteractions * (N_textLeadQualificationRate / 100);
    const textAppointmentsBookedHuman = textQualifiedLeadsHuman * (N_textAppointmentBookingRate / 100);
    const textAppointmentsAttendedHuman = textAppointmentsBookedHuman * (N_textAppointmentShowUpRate / 100);
    const textSalesHuman = textAppointmentsAttendedHuman * (N_textAppointmentToSaleRate / 100);
    const textRevenueHuman = textSalesHuman * N_avgRevenuePerSale;
    const totalHumanCostMonthly = humanVoiceCostMonthly + humanTextCostMonthly;
    const totalRevenueHumanMonthly = voiceRevenueHuman + textRevenueHuman;

    let aiSetupFee, aiMonthlyBaseCost, aiPerMinuteVoice, aiIncludedTexts, aiOverageText;
    if (aiTier === 'basic') {
      aiSetupFee = N_basicAiSetupFee; aiMonthlyBaseCost = N_basicAiMonthlyCost; aiPerMinuteVoice = N_basicAiPerMinuteVoiceCost;
      aiIncludedTexts = N_basicAiIncludedTextInteractions; aiOverageText = N_basicAiOverageTextCost;
    } else { 
      aiSetupFee = N_enterpriseAiSetupFee; aiMonthlyBaseCost = N_enterpriseAiMonthlyCost; aiPerMinuteVoice = N_enterpriseAiPerMinuteVoiceCost;
      aiIncludedTexts = N_enterpriseAiIncludedTextInteractions; aiOverageText = N_enterpriseAiOverageTextCost;
    }
    const aiSetupFeeAmortized = aiSetupFee > 0 ? aiSetupFee / 12 : 0;

    const interactionsHandledByAI_factor = N_aiHandlingPercentage / 100;
    const interactionsRemainingForHuman_factor = 1 - interactionsHandledByAI_factor;

    const voiceCallsConsideredForAI = N_monthlyVoiceCalls * interactionsHandledByAI_factor;
    const voiceCallsHandledByAI_autonomously = voiceCallsConsideredForAI * (N_aiAutonomyVoice / 100);
    const voiceCallsEscalatedToHuman = voiceCallsConsideredForAI * (1 - (N_aiAutonomyVoice / 100));
    const voiceCallsDirectlyToHumanWithAI = N_monthlyVoiceCalls * interactionsRemainingForHuman_factor;
    const totalVoiceCallsToHumanWithAI = voiceCallsEscalatedToHuman + voiceCallsDirectlyToHumanWithAI;
    const aiVoiceUsageCostMonthly = voiceCallsHandledByAI_autonomously * N_avgCallDurationHuman * aiPerMinuteVoice; 
    const humanCostForVoiceWithAI = (totalVoiceCallsToHumanWithAI * N_avgCallDurationHuman / 60) * N_humanHourlyCost;
    const effectiveVoiceBookingRateAI = N_voiceAppointmentBookingRate * (1 + (N_aiVoiceBookingRateImprovement / 100));
    const effectiveVoiceShowUpRateAI = Math.min(100, N_voiceAppointmentShowUpRate * (1 + (N_aiVoiceShowUpRateImprovement / 100)));
    const voiceQualifiedLeadsAI = N_monthlyVoiceCalls * (N_voiceLeadQualificationRate / 100);
    const voiceAppointmentsBookedAI = voiceQualifiedLeadsAI * (effectiveVoiceBookingRateAI / 100);
    const voiceAppointmentsAttendedAI = voiceAppointmentsBookedAI * (effectiveVoiceShowUpRateAI / 100);
    const voiceSalesAI = voiceAppointmentsAttendedAI * (N_voiceAppointmentToSaleRate / 100);
    const voiceRevenueAI = voiceSalesAI * N_avgRevenuePerSale;
    const voiceRevenueIncreaseBaseline = voiceRevenueAI - voiceRevenueHuman;
    const capturedMissedCallsRevenueAI = monthlyMissedCalls * (N_voiceLeadQualificationRate / 100) * (effectiveVoiceBookingRateAI / 100) * (effectiveVoiceShowUpRateAI / 100) * (N_voiceAppointmentToSaleRate / 100) * N_avgRevenuePerSale;
    const totalVoiceRevenueIncrease = voiceRevenueIncreaseBaseline + capturedMissedCallsRevenueAI;

    const textInteractionsConsideredForAI = N_monthlyTextInteractions * interactionsHandledByAI_factor;
    const textInteractionsHandledByAI_autonomously = textInteractionsConsideredForAI * (N_aiAutonomyText / 100);
    const textInteractionsEscalatedToHuman = textInteractionsConsideredForAI * (1 - (N_aiAutonomyText / 100));
    const textInteractionsDirectlyToHumanWithAI = N_monthlyTextInteractions * interactionsRemainingForHuman_factor;
    const totalTextInteractionsToHumanWithAI = textInteractionsEscalatedToHuman + textInteractionsDirectlyToHumanWithAI;
    let aiTextUsageCostMonthly = 0;
    const totalTextInteractionsForBilling = N_monthlyTextInteractions; 
    if (totalTextInteractionsForBilling > aiIncludedTexts) {
      aiTextUsageCostMonthly = (totalTextInteractionsForBilling - aiIncludedTexts) * aiOverageText;
    }
    const humanCostForTextWithAI = (totalTextInteractionsToHumanWithAI * N_avgTextInteractionTimeHuman / 60) * N_humanHourlyCost;
    const effectiveTextBookingRateAI = N_textAppointmentBookingRate * (1 + (N_aiTextBookingRateImprovement / 100));
    const effectiveTextShowUpRateAI = Math.min(100, N_textAppointmentShowUpRate * (1 + (N_aiTextShowUpRateImprovement / 100)));
    const textQualifiedLeadsAI = N_monthlyTextInteractions * (N_textLeadQualificationRate / 100);
    const textAppointmentsBookedAI = textQualifiedLeadsAI * (effectiveTextBookingRateAI / 100);
    const textAppointmentsAttendedAI = textAppointmentsBookedAI * (effectiveTextShowUpRateAI / 100);
    const textSalesAI = textAppointmentsAttendedAI * (N_textAppointmentToSaleRate / 100);
    const textRevenueAI = textSalesAI * N_avgRevenuePerSale;
    const totalTextRevenueIncrease = textRevenueAI - textRevenueHuman;

    const estimatedTotalMonthlyTextMessagesProcessedByAI = textInteractionsConsideredForAI * N_avgMessagesPerTextConversation;

    const totalAiPlatformMonthlyCost = aiMonthlyBaseCost + aiVoiceUsageCostMonthly + aiTextUsageCostMonthly;
    const effectiveTotalAiMonthlyCostY1 = totalAiPlatformMonthlyCost + aiSetupFeeAmortized;
    const totalHumanCostWithAI = humanCostForVoiceWithAI + humanCostForTextWithAI;
    const totalLaborCostSavingsMonthly = totalHumanCostMonthly - totalHumanCostWithAI;
    const totalRevenueIncreaseMonthly = totalVoiceRevenueIncrease + totalTextRevenueIncrease;
    const totalMonthlyGain = totalLaborCostSavingsMonthly + totalRevenueIncreaseMonthly;
    const netMonthlyBenefitY1 = totalMonthlyGain - effectiveTotalAiMonthlyCostY1;
    const monthlyROI = effectiveTotalAiMonthlyCostY1 > 0 ? (netMonthlyBenefitY1 / effectiveTotalAiMonthlyCostY1) * 100 : (netMonthlyBenefitY1 > 0 ? Infinity : 0);
    const annualROI = monthlyROI;
    const annualNetGainY1 = netMonthlyBenefitY1 * 12;
    const annualCostSavings = totalLaborCostSavingsMonthly * 12;
    const annualRevenueIncrease = totalRevenueIncreaseMonthly * 12;
    let paybackPeriodMonths = Infinity;
    if (netMonthlyBenefitY1 > 0 && aiSetupFee > 0) paybackPeriodMonths = aiSetupFee / netMonthlyBenefitY1;
    else if (netMonthlyBenefitY1 > 0 && aiSetupFee <= 0) paybackPeriodMonths = 0;

    setResults({
      humanVoiceCostMonthly, voiceRevenueHuman, humanTextCostMonthly, textRevenueHuman,
      totalHumanCostMonthly, totalRevenueHumanMonthly, revenueLostFromMissedCalls,
      aiSetupFee, aiMonthlyBaseCost, aiVoiceUsageCostMonthly, aiTextUsageCostMonthly,
      totalAiPlatformMonthlyCost, effectiveTotalAiMonthlyCostY1,
      humanCostForVoiceWithAI, humanCostForTextWithAI, totalHumanCostWithAI,
      totalLaborCostSavingsMonthly, annualCostSavings,
      totalVoiceRevenueIncrease, totalTextRevenueIncrease, totalRevenueIncreaseMonthly, annualRevenueIncrease,
      totalMonthlyGain, netMonthlyBenefitY1, annualNetGainY1,
      monthlyROI, annualROI, paybackPeriodMonths,
      aiHandlingPercentage: N_aiHandlingPercentage, 
      interactionsHandledByAI_autonomously_voice: voiceCallsHandledByAI_autonomously,
      interactionsHandledByAI_autonomously_text: textInteractionsHandledByAI_autonomously,
      monthlyVoiceCalls: N_monthlyVoiceCalls, monthlyTextInteractions: N_monthlyTextInteractions,
      voiceSalesAI, textSalesAI,
      currentHumanCostChart: totalHumanCostMonthly, aiCostY1Chart: effectiveTotalAiMonthlyCostY1,
      humanWithAICostChart: totalHumanCostWithAI, netBenefitChart: netMonthlyBenefitY1 > 0 ? netMonthlyBenefitY1 : 0,
      estimatedTotalMonthlyTextMessagesProcessedByAI, 
    });

  }, [ 
    avgRevenuePerSale, operatingDaysPerMonth, monthlyVoiceCalls, avgMissedVoiceCallsDaily, avgCallDurationHuman,
    monthlyTextInteractions, avgTextInteractionTimeHuman, humanHourlyCost, avgMessagesPerTextConversation, 
    voiceLeadQualificationRate, voiceAppointmentBookingRate, voiceAppointmentShowUpRate, voiceAppointmentToSaleRate,
    textLeadQualificationRate, textAppointmentBookingRate, textAppointmentShowUpRate, textAppointmentToSaleRate,
    aiTier, aiHandlingPercentage,
    basicAiSetupFee, basicAiMonthlyCost, basicAiPerMinuteVoiceCost, basicAiIncludedTextInteractions, basicAiOverageTextCost,
    enterpriseAiSetupFee, enterpriseAiMonthlyCost, enterpriseAiPerMinuteVoiceCost, enterpriseAiIncludedTextInteractions, enterpriseAiOverageTextCost,
    aiAutonomyVoice, aiAutonomyText,
    aiVoiceBookingRateImprovement, aiVoiceShowUpRateImprovement, aiTextBookingRateImprovement, aiTextShowUpRateImprovement
  ]);

  // --- Helper Functions ---
  const formatPaybackPeriod = (periodInMonths: number): string => {
    if (periodInMonths === 0) return "Immediate";
    if (!isFinite(periodInMonths) || periodInMonths < 0) return "Never";
    const N_opDays = Number(operatingDaysPerMonth) || 22;
    const absoluteMonths = Math.abs(periodInMonths);
    const years = Math.floor(absoluteMonths / 12);
    const months = Math.floor(absoluteMonths % 12);
    const days = Math.round((absoluteMonths % 1) * N_opDays); 
    let result = "";
    if (years > 0) result += `${years} year${years > 1 ? 's' : ''}`;
    if (months > 0) result += (result ? " " : "") + `${safeLocaleString(months, {maximumFractionDigits:0})} month${months > 1 ? 's' : ''}`;
    if (years === 0 && months === 0 && days > 0) {
         result = `${safeLocaleString(days, {maximumFractionDigits:0})} day${days > 1 ? 's' : ''}`;
    } else if (years === 0 && months < 2 && days > 0 && !result.includes('month')) {
         result += (result ? " " : "") + `~${safeLocaleString(days, {maximumFractionDigits:0})} day${days > 1 ? 's' : ''}`;
    }
    return result || "Less than 1 day";
  };
  
  const handlePrint = (): void => { window.print(); };

  const getScenarioInterpretation = (): string => {
    const handlingPercentage = results.aiHandlingPercentage;
    if (handlingPercentage === undefined) return "Adjust the 'AI Handling Percentage' to model different levels of automation.";
    if (handlingPercentage === 100) {
      return "Full Replacement Focus: AI handles 100% of defined interactions. Savings reflect potential direct staff cost reduction or full reallocation.";
    }
    return `Enhancement Focus: AI handles ${handlingPercentage}% of interactions. Human agents manage the remaining ${100 - handlingPercentage}%, likely complex cases. Savings from increased efficiency.`;
  };

  const chartData: Array<{[key: string]: string | number}> = [ 
    { 
      name: 'Monthly Costs', 
      'Current Human Cost': results.currentHumanCostChart || 0, 
      'AI Cost (Y1 Eff.)': results.aiCostY1Chart || 0, 
      'Human Labor w/ AI': results.humanWithAICostChart || 0 
    },
  ];
  // Conditionally add 'Net Monthly Benefit (Y1)' to chartData if it's positive and exists
  if(results.netBenefitChart && results.netBenefitChart > 0) { 
    // Ensure the key is explicitly defined or handle it in a way TypeScript understands
    const chartEntry = chartData[0] as any; // Use 'as any' for simplicity here, or define a stricter type for chartEntry
    chartEntry['Net Monthly Benefit (Y1)'] = results.netBenefitChart;
  }

  // --- JSX Rendering ---
  return (
    <>
      <PrintStyles />
      <div id="printable-area" className="p-4 max-w-6xl mx-auto font-sans print-p-0">
        <Card className="w-full print-shadow-none print-border-none">
          <CardHeader className="bg-gray-800 text-white rounded-t-lg">
            <CardTitle className="text-center text-2xl !text-white">Omnichannel AI Agent ROI Calculator</CardTitle>
            <p className="text-center text-sm text-gray-300 mt-1">Estimate the Value of Automating Voice & Text Customer Interactions</p>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print-grid-cols-1">
              
              {/* --- Left Column: All Input Sections --- */}
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Business & Interaction Volume</CardTitle></CardHeader>
                  <CardContent>
                    <div className="mb-4">
                        <label htmlFor="industryPreset" className="block text-sm font-medium text-gray-700 mb-1">Industry Preset</label>
                        <select 
                            id="industryPreset" 
                            value={industry} 
                            onChange={handleSelectChange(setIndustry)} 
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500"
                        >
                            {Object.keys(industryPresets).map(key => (
                                <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</option>
                            ))}
                        </select>
                    </div>
                    <RangeSlider label="Average Revenue per Sale" id="avgRevenuePerSale" value={avgRevenuePerSale} onChange={handleSliderChange(setAvgRevenuePerSale)} min="0" max="10000" step="10" unit="$" />
                    <RangeSlider label="Operating Days per Month" id="operatingDaysPerMonth" value={operatingDaysPerMonth} onChange={handleSliderChange(setOperatingDaysPerMonth)} min="1" max="31" step="1" unit=" days" helpText="Used for daily to monthly conversions."/>
                    <RangeSlider label="Monthly Incoming Voice Calls" id="monthlyVoiceCalls" value={monthlyVoiceCalls} onChange={handleSliderChange(setMonthlyVoiceCalls)} min="0" max="10000" step="10" unit="#" />
                    <RangeSlider label="Monthly Incoming Text Interactions (Conversations)" id="monthlyTextInteractions" value={monthlyTextInteractions} onChange={handleSliderChange(setMonthlyTextInteractions)} min="0" max="20000" step="10" unit="#" helpText="Number of distinct text-based conversations."/>
                    <RangeSlider label="Avg. Messages per Text Conversation" id="avgMessagesPerTextConversation" value={avgMessagesPerTextConversation} onChange={handleSliderChange(setAvgMessagesPerTextConversation)} min="2" max="30" step="1" unit="msgs" helpText="Typical back-and-forth messages in one text conversation." />
                  </CardContent>
                </Card>

                {/* Card for Current Human Performance & Costs - Main Part */}
                <Card>
                    <CardHeader><CardTitle>Current Human Performance & Costs</CardTitle></CardHeader>
                    <CardContent>
                        <RangeSlider label="Human Agent Hourly Cost (Fully Loaded)" id="humanHourlyCost" value={humanHourlyCost} onChange={handleSliderChange(setHumanHourlyCost)} min="10" max="150" step="1" unit="$" />
                        <RangeSlider label="Avg. Missed Voice Calls per Day" id="avgMissedVoiceCallsDaily" value={avgMissedVoiceCallsDaily} onChange={handleSliderChange(setAvgMissedVoiceCallsDaily)} min="0" max="200" step="1" unit="#" helpText="Calls unanswered during business hours."/>
                    </CardContent>
                </Card>

                {/* Independent Card for Voice Channel Funnel */}
                <Card>
                    <CardHeader><CardTitle>Voice Channel Funnel (Current)</CardTitle></CardHeader>
                    <CardContent>
                        <RangeSlider label="Avg. Human Time per Voice Call" id="avgCallDurationHuman" value={avgCallDurationHuman} onChange={handleSliderChange(setAvgCallDurationHuman)} min="1" max="60" step="0.5" unit=" min" />
                        <RangeSlider label="Lead Qualification Rate (Voice)" id="voiceLeadQualificationRate" value={voiceLeadQualificationRate} onChange={handleSliderChange(setVoiceLeadQualificationRate)} min="0" max="100" step="1" unit="%" />
                        <RangeSlider label="Appt. Booking Rate (Qualified Voice Leads)" id="voiceAppointmentBookingRate" value={voiceAppointmentBookingRate} onChange={handleSliderChange(setVoiceAppointmentBookingRate)} min="0" max="100" step="1" unit="%" />
                        <RangeSlider label="Appt. Show-Up Rate (Booked Voice Appts)" id="voiceAppointmentShowUpRate" value={voiceAppointmentShowUpRate} onChange={handleSliderChange(setVoiceAppointmentShowUpRate)} min="0" max="100" step="1" unit="%" />
                        <RangeSlider label="Appt. to Sale Rate (Attended Voice Appts)" id="voiceAppointmentToSaleRate" value={voiceAppointmentToSaleRate} onChange={handleSliderChange(setVoiceAppointmentToSaleRate)} min="0" max="100" step="1" unit="%" />
                    </CardContent>
                </Card>

                {/* Independent Card for Text Channels Funnel */}
                <Card>
                    <CardHeader><CardTitle>Text Channels Funnel (Current)</CardTitle></CardHeader>
                    <CardContent>
                        <RangeSlider label="Avg. Human Time per Text Interaction (Conversation)" id="avgTextInteractionTimeHuman" value={avgTextInteractionTimeHuman} onChange={handleSliderChange(setAvgTextInteractionTimeHuman)} min="1" max="30" step="0.5" unit=" min" />
                        <RangeSlider label="Lead Qualification Rate (Text)" id="textLeadQualificationRate" value={textLeadQualificationRate} onChange={handleSliderChange(setTextLeadQualificationRate)} min="0" max="100" step="1" unit="%" />
                        <RangeSlider label="Appt. Booking Rate (Qualified Text Leads)" id="textAppointmentBookingRate" value={textAppointmentBookingRate} onChange={handleSliderChange(setTextAppointmentBookingRate)} min="0" max="100" step="1" unit="%" />
                        <RangeSlider label="Appt. Show-Up Rate (Booked Text Appts)" id="textAppointmentShowUpRate" value={textAppointmentShowUpRate} onChange={handleSliderChange(setTextAppointmentShowUpRate)} min="0" max="100" step="1" unit="%" />
                        <RangeSlider label="Appt. to Sale Rate (Attended Text Appts)" id="textAppointmentToSaleRate" value={textAppointmentToSaleRate} onChange={handleSliderChange(setTextAppointmentToSaleRate)} min="0" max="100" step="1" unit="%" />
                    </CardContent>
                </Card>


                <Card>
                  <CardHeader><CardTitle>AI Agent Parameters & Costs</CardTitle></CardHeader>
                  <CardContent>
                    <div className="mb-4">
                        <label htmlFor="aiTier" className="block text-sm font-medium text-gray-700 mb-1">AI Tier</label>
                        <select 
                            id="aiTier" 
                            value={aiTier} 
                            onChange={handleSelectChange(setAiTier)} 
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500"
                        >
                            <option value="basic">Basic</option>
                            <option value="enterprise">Enterprise</option>
                        </select>
                    </div>
                    {aiTier === 'basic' && (
                        <>
                            <RangeSlider label="Basic AI - Setup Fee" id="basicAiSetupFee" value={basicAiSetupFee} onChange={handleSliderChange(setBasicAiSetupFee)} min="500" max="5000" step="100" unit="$" helpText="Starting at $2,000" />
                            <RangeSlider label="Basic AI - Monthly Cost" id="basicAiMonthlyCost" value={basicAiMonthlyCost} onChange={handleSliderChange(setBasicAiMonthlyCost)} min="100" max="3000" step="50" unit="$" />
                            <RangeSlider label="Basic AI - Per Minute Voice Cost" id="basicAiPerMinuteVoiceCost" value={basicAiPerMinuteVoiceCost} onChange={handleSliderChange(setBasicAiPerMinuteVoiceCost)} min="0.05" max="1.00" step="0.01" unit="$" helpText="Default: $0.45/min" />
                            <RangeSlider label="Basic AI - Included Monthly Text Interactions (Conversations)" id="basicAiIncludedTextInteractions" value={basicAiIncludedTextInteractions} onChange={handleSliderChange(setBasicAiIncludedTextInteractions)} min="0" max="10000" step="100" unit="#" />
                            <RangeSlider label="Basic AI - Overage Cost per Text Interaction (Conversation)" id="basicAiOverageTextCost" value={basicAiOverageTextCost} onChange={handleSliderChange(setBasicAiOverageTextCost)} min="0.01" max="0.50" step="0.01" unit="$" helpText="Default: $0.05/conversation" />
                        </>
                    )}
                    {aiTier === 'enterprise' && (
                        <>
                            <RangeSlider label="Enterprise AI - Setup Fee" id="enterpriseAiSetupFee" value={enterpriseAiSetupFee} onChange={handleSliderChange(setEnterpriseAiSetupFee)} min="2000" max="50000" step="500" unit="$" helpText="Starting at $5,000" />
                            <RangeSlider label="Enterprise AI - Monthly Platform Cost" id="enterpriseAiMonthlyCost" value={enterpriseAiMonthlyCost} onChange={handleSliderChange(setEnterpriseAiMonthlyCost)} min="500" max="10000" step="100" unit="$" helpText="Starting at $2,000" />
                            <RangeSlider label="Enterprise AI - Per Minute Voice Cost" id="enterpriseAiPerMinuteVoiceCost" value={enterpriseAiPerMinuteVoiceCost} onChange={handleSliderChange(setEnterpriseAiPerMinuteVoiceCost)} min="0.03" max="0.50" step="0.01" unit="$" helpText="Starting at $0.30/min" />
                            <RangeSlider label="Enterprise AI - Included Monthly Text Interactions (Conversations)" id="enterpriseAiIncludedTextInteractions" value={enterpriseAiIncludedTextInteractions} onChange={handleSliderChange(setEnterpriseAiIncludedTextInteractions)} min="0" max="50000" step="500" unit="#" helpText="10,000 included" />
                            <RangeSlider label="Enterprise AI - Overage Cost per Text Interaction (Conversation)" id="enterpriseAiOverageTextCost" value={enterpriseAiOverageTextCost} onChange={handleSliderChange(setEnterpriseAiOverageTextCost)} min="0.01" max="0.25" step="0.005" unit="$" helpText="Default: $0.03/conversation" />
                        </>
                    )}
                     <hr className="my-4"/>
                    <RangeSlider label="AI Handling Percentage" id="aiHandlingPercentage" value={aiHandlingPercentage} onChange={handleSliderChange(setAiHandlingPercentage)} min="0" max="100" step="5" unit="%" helpText="Portion of total interactions AI attempts to handle."/>
                    <RangeSlider label="AI Autonomy (Voice Calls)" id="aiAutonomyVoice" value={aiAutonomyVoice} onChange={handleSliderChange(setAiAutonomyVoice)} min="0" max="100" step="5" unit="%" helpText="% of AI-handled calls resolved end-to-end."/>
                    <RangeSlider label="AI Autonomy (Text Interactions)" id="aiAutonomyText" value={aiAutonomyText} onChange={handleSliderChange(setAiAutonomyText)} min="0" max="100" step="5" unit="%" helpText="% of AI-handled texts resolved end-to-end."/>
                    <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3 border-t pt-4">AI Performance Improvements</h3>
                    <RangeSlider label="Improvement in Booking Rate (Voice AI)" id="aiVoiceBookingRateImprovement" value={aiVoiceBookingRateImprovement} onChange={handleSliderChange(setAiVoiceBookingRateImprovement)} min="0" max="100" step="1" unit="%"/>
                    <RangeSlider label="Improvement in Show-Up Rate (Voice AI)" id="aiVoiceShowUpRateImprovement" value={aiVoiceShowUpRateImprovement} onChange={handleSliderChange(setAiVoiceShowUpRateImprovement)} min="0" max="100" step="1" unit="%"/>
                    <RangeSlider label="Improvement in Booking Rate (Text AI)" id="aiTextBookingRateImprovement" value={aiTextBookingRateImprovement} onChange={handleSliderChange(setAiTextBookingRateImprovement)} min="0" max="100" step="1" unit="%"/>
                    <RangeSlider label="Improvement in Show-Up Rate (Text AI)" id="aiTextShowUpRateImprovement" value={aiTextShowUpRateImprovement} onChange={handleSliderChange(setAiTextShowUpRateImprovement)} min="0" max="100" step="1" unit="%"/>
                  </CardContent>
                </Card>
                
                <div className="mt-6 no-print">
                  <button
                    onClick={() => {
                        const resultsSection = document.getElementById('results-section');
                        if (resultsSection) {
                          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }}
                    className="w-full font-bold py-3 px-4 rounded transition duration-200 ease-in-out text-white shadow-md hover:shadow-lg bg-slate-500 hover:bg-slate-600 cursor-pointer"
                  >
                     Scroll to Results
                  </button>
                </div>
              </div>

              {/* --- Right Column: All Results Sections --- */}
              <div id="results-section" className="space-y-6">
                <Card className="bg-slate-50 print-shadow-none print-border-none"> 
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold text-gray-800">Your Estimated AI Impact</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4 px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Potential Annual Net Gain (Year 1)</div>
                      <div className={`text-4xl font-extrabold ${(results.annualNetGainY1 || 0) >= 0 ? 'text-lime-600' : 'text-red-600'}`}>
                        {safeLocaleString(results.annualNetGainY1 || 0, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">(Annual Labor Savings + Added Revenue - Annual AI Cost Y1)</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-300">
                       <div>
                         <div className="text-xs font-medium text-gray-600 mb-1">Estimated Annual ROI (Y1)</div>
                         <div className={`text-3xl font-bold ${(results.annualROI || 0) >= 0 ? 'text-lime-600' : 'text-red-600'}`}>
                           {isFinite(results.annualROI || 0) ? safeLocaleString(results.annualROI || 0, { style: 'percent', maximumFractionDigits: 0 }) : ( (results.netMonthlyBenefitY1 || 0) > 0 ? '∞%' : 'N/A')}
                         </div>
                       </div>
                       <div>
                         <div className="text-xs font-medium text-gray-600 mb-1">Payback Period</div>
                         <div className="text-3xl font-bold text-gray-700"> 
                           {formatPaybackPeriod(results.paybackPeriodMonths || Infinity)}
                         </div>
                       </div>
                    </div>
                     <div className="text-xs text-gray-500 pt-2">
                        Driven by:
                        <span className={`font-medium ${(results.annualCostSavings || 0) >= 0 ? 'text-lime-600' : 'text-red-600'} mx-1`}>
                            {safeLocaleString(results.annualCostSavings || 0, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                        </span>
                        ann. labor savings &
                        <span className={`font-medium ${(results.annualRevenueIncrease || 0) >= 0 ? 'text-lime-600' : 'text-red-600'} ml-1`}>
                            {safeLocaleString(results.annualRevenueIncrease || 0, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                        </span>
                        ann. added revenue.
                     </div>
                    <div className="mt-4 no-print">
                        <a
                            href="https://api.leadconnectorhq.com/widget/booking/9rk5cHU2aY3skvtraBB7" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full max-w-xs mx-auto bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow hover:shadow-md"
                        >
                            Let's Discuss Your Results
                        </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Monthly Cost & Benefit Comparison</CardTitle></CardHeader>
                  <CardContent className="p-4">
                    <div style={{ width: '100%', height: 280 }}>
                      <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 5, left: 15, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={(value) => `$${safeLocaleString(value, {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}`} tick={{ fontSize: 10 }} />
                          <Tooltip formatter={(value: number | string | Array<number | string>, name: string) => [`$${safeLocaleString(typeof value === 'number' ? value : 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name]} cursor={{ fill: 'rgba(230, 230, 230, 0.3)' }} />
                          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: '10px' }} />
                          <Bar dataKey="Current Human Cost" fill="#4B5563" radius={[4, 4, 0, 0]} /> 
                          <Bar dataKey="AI Cost (Y1 Eff.)" fill="#A3E635" radius={[4, 4, 0, 0]} /> 
                          {(results.netBenefitChart || 0) > 0 && <Bar dataKey="Net Monthly Benefit (Y1)" fill="#84CC16" radius={[4, 4, 0, 0]} />} 
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                    <CardHeader><CardTitle>Monthly Financial Impact (AI vs. Current)</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Total Human Labor Cost (Current):</span> <span className="font-medium">{safeLocaleString(results.totalHumanCostMonthly || 0, {style:'currency', currency:'USD'})}</span></div>
                         <div className="flex justify-between"><span>Est. Revenue Lost from Missed Calls (Current):</span> <span className="font-medium text-red-600">{safeLocaleString(results.revenueLostFromMissedCalls || 0, {style:'currency', currency:'USD'})}</span></div>
                        <hr className="my-2"/>
                        <div className="flex justify-between"><span>Effective AI Monthly Cost (Year 1):</span> <span className="font-medium">{safeLocaleString(results.effectiveTotalAiMonthlyCostY1 || 0, {style:'currency', currency:'USD'})}</span></div>
                        <div className="flex justify-between"><span>Projected Human Labor Cost (With AI):</span> <span className="font-medium">{safeLocaleString(results.totalHumanCostWithAI || 0, {style:'currency', currency:'USD'})}</span></div>
                        <hr className="my-2"/>
                        <div className="flex justify-between">
                            <span className="text-lime-700">Direct Labor Cost Savings:</span> 
                            <span className={`font-medium ${(results.totalLaborCostSavingsMonthly || 0) >= 0 ? 'text-lime-600' : 'text-red-600'}`}>{safeLocaleString(results.totalLaborCostSavingsMonthly || 0, {style:'currency', currency:'USD'})}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-lime-700">Potential Added Revenue (Incl. Captured Calls):</span> 
                            <span className={`font-medium ${(results.totalRevenueIncreaseMonthly || 0) >= 0 ? 'text-lime-600' : 'text-red-600'}`}>{ (results.totalRevenueIncreaseMonthly || 0) >= 0 ? '+' : ''}{safeLocaleString(results.totalRevenueIncreaseMonthly || 0, {style:'currency', currency:'USD'})}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 mt-2">
                            <LabelWithTooltip label="Total Monthly Benefit" tooltipText="Before AI Cost" labelClasses="text-md font-semibold text-gray-700" />
                            <span className={`font-semibold text-lg ${(results.totalMonthlyGain || 0) >= 0 ? 'text-lime-600' : 'text-red-600'}`}>{safeLocaleString(results.totalMonthlyGain || 0, {style:'currency', currency:'USD'})}</span>
                        </div>
                        <div className="flex justify-between">
                            <LabelWithTooltip label="Net Monthly Benefit" tooltipText="After AI Cost (Year 1)" labelClasses="text-md font-semibold text-gray-700" />
                            <span className={`font-semibold text-lg ${(results.netMonthlyBenefitY1 || 0) >= 0 ? 'text-lime-600' : 'text-red-600'}`}>{safeLocaleString(results.netMonthlyBenefitY1 || 0, {style:'currency', currency:'USD'})}</span>
                        </div>
                         <p className="text-xs text-gray-500 mt-1 p-2 bg-gray-100 rounded">{getScenarioInterpretation()}</p>
                    </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>AI Agent Cost Breakdown</CardTitle></CardHeader>
                  <CardContent className="bg-gray-50 p-4 rounded-b-lg space-y-2 text-sm">
                    <div className="flex justify-between"><span>One-time Setup Fee:</span> <span className="font-medium">{safeLocaleString(results.aiSetupFee || 0, {style:'currency', currency:'USD'})}</span></div>
                    <div className="flex justify-between"><span>AI Monthly Platform Base Cost:</span> <span className="font-medium">{safeLocaleString(results.aiMonthlyBaseCost || 0, {style:'currency', currency:'USD'})}</span></div>
                    <div className="flex justify-between"><span>Est. AI Monthly Voice Usage Cost:</span> <span className="font-medium">{safeLocaleString(results.aiVoiceUsageCostMonthly || 0, {style:'currency', currency:'USD'})}</span></div>
                    <div className="flex justify-between"><span>Est. AI Monthly Text Usage Cost:</span> <span className="font-medium">{safeLocaleString(results.aiTextUsageCostMonthly || 0, {style:'currency', currency:'USD'})}</span></div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="font-semibold">Total AI Recurring Monthly Cost:</span> 
                        <span className="font-semibold text-lime-600">{safeLocaleString(results.totalAiPlatformMonthlyCost || 0, {style:'currency', currency:'USD'})}</span>
                    </div>
                    <div className="flex justify-between">
                        <LabelWithTooltip label="Effective AI Monthly Cost (Year 1)" tooltipText="Recurring Monthly + Setup Fee/12" labelClasses="font-semibold" />
                        <span className="font-semibold text-lime-600">{safeLocaleString(results.effectiveTotalAiMonthlyCostY1 || 0, {style:'currency', currency:'USD'})}</span>
                    </div>
                  </CardContent>
                </Card>

                 <Card>
                  <CardHeader><CardTitle>Monthly Interaction Analysis</CardTitle></CardHeader>
                  <CardContent className="bg-gray-50 p-4 rounded-b-lg space-y-2 text-sm">
                    <div className="flex justify-between"><span>Total Voice Calls Entered:</span> <span className="font-medium">{safeLocaleString(results.monthlyVoiceCalls || 0, {maximumFractionDigits:0})}</span></div>
                    <div className="flex justify-between"><span>Total Text Interactions (Conversations) Entered:</span> <span className="font-medium">{safeLocaleString(results.monthlyTextInteractions || 0, {maximumFractionDigits:0})}</span></div>
                    <hr className="my-1"/>
                    <div className="flex justify-between"><span>Est. Voice Calls Handled Autonomously by AI:</span> <span className="font-medium text-lime-600">{safeLocaleString(results.interactionsHandledByAI_autonomously_voice || 0, {maximumFractionDigits:0})}</span></div>
                    <div className="flex justify-between"><span>Est. Text Interactions (Conversations) Handled Autonomously by AI:</span> <span className="font-medium text-lime-600">{safeLocaleString(results.interactionsHandledByAI_autonomously_text || 0, {maximumFractionDigits:0})}</span></div>
                    <div className="flex justify-between">
                        <span>Est. Total Individual Text Messages Processed by AI:</span> 
                        <span className="font-medium text-lime-600">{safeLocaleString(results.estimatedTotalMonthlyTextMessagesProcessedByAI || 0, {maximumFractionDigits:0})}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-8">
                <Card className="border border-gray-200 bg-gray-50 print-shadow-none print-border-none">
                    <CardHeader 
                        className="flex justify-between items-center hover:bg-gray-200 transition-colors duration-200" 
                        onClick={() => setIsInsightsOpen(!isInsightsOpen)}
                    >
                        <CardTitle>Key Insights & Annual Projections</CardTitle>
                        <span className={`transform transition-transform duration-200 ${isInsightsOpen ? 'rotate-180' : 'rotate-0'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </span>
                    </CardHeader>
                    {isInsightsOpen && (
                        <CardContent className="p-4 space-y-3 text-sm text-gray-700 collapsible-content">
                            <p>{getScenarioInterpretation()}</p>
                            <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                                <p className="font-medium text-gray-800 mb-1">Potential Annual Net Gain (Year 1):</p>
                                <p className={`text-xl font-semibold ${(results.annualNetGainY1 || 0) >= 0 ? 'text-lime-600' : 'text-red-600'}`}>{safeLocaleString(results.annualNetGainY1 || 0, { style: 'currency', currency: 'USD' })}</p>
                                <p className="text-xs text-gray-500 mt-1">(Annual Labor Savings + Annual Added Revenue - Total Annual AI Cost Y1)</p>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                                <p className="font-medium text-gray-800 mb-1">Potential Annual Labor Cost Savings:</p>
                                <p className={`text-xl font-semibold ${(results.annualCostSavings || 0) >= 0 ? 'text-lime-600' : 'text-red-600'}`}>{safeLocaleString(results.annualCostSavings || 0, { style: 'currency', currency: 'USD' })}</p>
                            </div>
                             <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                                <p className="font-medium text-gray-800 mb-1">Potential Annual Added Revenue (Incl. Captured Calls):</p>
                                <p className={`text-xl font-semibold ${(results.annualRevenueIncrease || 0) >= 0 ? 'text-lime-600' : 'text-red-600'}`}>{safeLocaleString(results.annualRevenueIncrease || 0, { style: 'currency', currency: 'USD' })}</p>
                            </div>
                            {( (results.paybackPeriodMonths || Infinity) > 0 && isFinite(results.paybackPeriodMonths || Infinity)) && ( <p>The initial AI setup fee of <strong className="text-gray-700">{safeLocaleString(results.aiSetupFee || 0, { style: 'currency', currency: 'USD', maximumFractionDigits:0 })}</strong> is estimated to be paid back within <strong className="text-lime-600">{formatPaybackPeriod(results.paybackPeriodMonths || Infinity)}</strong>.</p>)}
                            {(results.paybackPeriodMonths === 0) && ( <p>With positive net benefits and no (or negligible) setup fee, the return is effectively immediate.</p>)}
                            {(!isFinite(results.paybackPeriodMonths || Infinity) && (results.netMonthlyBenefitY1 || 0) <=0 && (results.aiSetupFee || 0) > 0) && ( <p className="text-red-600">Based on current inputs, the initial setup fee is not projected to be paid back via Year 1 net monthly benefits.</p>)}
                        </CardContent>
                    )}
                </Card>
            </div>
             <div className="mt-8">
                <Card className="border border-gray-200 bg-gray-50 print-shadow-none print-border-none">
                    <CardHeader 
                        className="flex justify-between items-center hover:bg-gray-200 transition-colors duration-200" 
                        onClick={() => setIsQualitativeOpen(!isQualitativeOpen)}
                    >
                        <CardTitle>Additional Potential Benefits (Qualitative)</CardTitle>
                         <span className={`transform transition-transform duration-200 ${isQualitativeOpen ? 'rotate-180' : 'rotate-0'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </span>
                    </CardHeader>
                    {isQualitativeOpen && (
                        <CardContent className="p-4 text-sm text-gray-700 collapsible-content">
                          <ul className="list-disc pl-5 space-y-2">
                            <li><strong>24/7 Omnichannel Availability:</strong> Capture leads and serve customers round-the-clock on their preferred channel (voice or text).</li>
                            <li><strong>Drastically Improved Response Times:</strong> Engage every prospect instantly, significantly boosting conversion potential.</li>
                            <li><strong>Consistent & Accurate Service:</strong> Standardized responses and processes ensure quality and reliability.</li>
                            <li><strong>Enhanced Customer Experience (CX):</strong> Seamless, personalized interactions lead to higher satisfaction and loyalty.</li>
                            <li><strong>Increased Human Agent Productivity:</strong> Automating routine tasks frees up your team for complex, high-value work, reducing burnout.</li>
                            <li><strong>Scalability on Demand:</strong> Effortlessly handle peaks in call and message volume without overwhelming staff.</li>
                            <li><strong>Rich Data & Actionable Insights:</strong> Gather valuable data from all interactions to refine strategies and understand customer needs.</li>
                            <li><strong>Efficient Appointment Management:</strong> Automated scheduling, confirmations, and reminders reduce no-shows and administrative load.</li>
                            <li><strong>Competitive Advantage:</strong> Lower cost-per-acquisition and provide superior service compared to competitors relying on manual processes.</li>
                          </ul>
                        </CardContent>
                    )}
                </Card>
            </div>

            <div className="mt-8 text-center no-print"> 
                <div className="flex justify-center items-center space-x-4">
                    <button 
                        onClick={handlePrint} 
                        className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow hover:shadow-md"
                    >
                        Print Results
                    </button>
                    <a
                        href="https://api.leadconnectorhq.com/widget/booking/9rk5cHU2aY3skvtraBB7" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out shadow hover:shadow-md"
                    >
                        Let's Discuss Your Results
                    </a>
                </div>
                <p className="text-xs text-gray-500 mt-2">Use your browser's print dialog to save as PDF.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default OmnichannelAiRoiCalculator;

