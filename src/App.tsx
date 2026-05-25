/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
  ComposedChart,
  AreaChart,
  Area,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  UserCheck,
  HeartPulse,
  Globe,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  FileText,
  ChevronDown
} from 'lucide-react';

import {
  WILAYAT_NAMES,
  AGE_RANGES,
  AGE_DISTRIBUTION_OMANI,
  AGE_DISTRIBUTION_EXPAT,
  DATA_2024,
  DATA_2025
} from './data';

// --- Icons & Traditional Omani Decorative Elements ---

const KhanjarIcon = () => (
  <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_var(--brand-accent)] opacity-80">
    <path d="M50 10C50 10 35 30 35 50C35 70 50 90 50 90C50 90 65 70 65 50C65 30 50 10 50 10Z" fill="none" stroke="var(--brand-accent)" strokeWidth="3"/>
    <path d="M40 35H60M42 45H58M45 55H55" stroke="var(--brand-accent)" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M50 10V90" stroke="var(--brand-accent)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4"/>
  </svg>
);

const LubanTreeIcon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_var(--brand-accent)] opacity-80">
    <path d="M50 90V60M50 60L30 40M50 60L70 40M50 50L50 30" stroke="var(--brand-accent)" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="30" cy="40" r="8" fill="var(--brand-accent)" />
    <circle cx="70" cy="40" r="8" fill="var(--brand-primary)" />
    <circle cx="50" cy="30" r="10" fill="var(--brand-accent)" />
    <circle cx="50" cy="15" r="6" fill="var(--brand-primary)" />
  </svg>
);

const NationalEmblemLogo = () => (
  <div className="flex flex-col items-center justify-center text-[10px] font-black text-[var(--brand-primary)] leading-tight text-center">
    <div className="w-12 h-12 flex items-center justify-center mb-1">
       <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M20 80 L80 20 M80 80 L20 20" stroke="var(--brand-accent)" strokeWidth="4" strokeLinecap="round"/>
          <path d="M50 15 C50 15 35 30 35 45 C35 60 50 85 50 85 C50 85 65 60 65 45 C65 30 50 15 50 15Z" fill="none" stroke="var(--brand-accent)" strokeWidth="3"/>
          <path d="M40 35 H60 M42 42 H58 M45 50 H55" stroke="var(--brand-accent)" strokeWidth="2.5" strokeLinecap="round"/>
       </svg>
    </div>
  </div>
);

// --- Subcomponents ---

const StatCard = ({ title, value, subValue, icon: Icon, trend, color, theme, index }: { title: string, value: string | number, subValue?: string, icon: any, trend?: number, color: string, theme?: string, index?: number }) => {
  const isVibrant = theme === 'vibrant';
  
  // Custom vibrant theme combinations
  const vibrantClasses = [
    { bg: 'bg-amber-100 border-amber-200 text-amber-900', textMuted: 'text-amber-800', hoverBg: 'hover:bg-amber-200/50' },
    { bg: 'bg-sky-100 border-sky-200 text-sky-900', textMuted: 'text-sky-800', hoverBg: 'hover:bg-sky-200/50' },
    { bg: 'bg-rose-100 border-rose-200 text-rose-900', textMuted: 'text-rose-800', hoverBg: 'hover:bg-rose-200/50' },
    { bg: 'bg-indigo-100 border-indigo-200 text-indigo-900', textMuted: 'text-indigo-800', hoverBg: 'hover:bg-indigo-200/50' }
  ];

  if (isVibrant && index !== undefined) {
    const vc = vibrantClasses[index % vibrantClasses.length];
    return (
      <motion.div 
        whileHover={{ 
          y: -6,
          scale: 1.01,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)"
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className={`${vc.bg} border-2 p-6 rounded-[2rem] flex flex-col justify-between transition-colors duration-300 h-full relative overflow-hidden`}
      >
        <div className="flex justify-between items-start">
          <div className="p-2.5 rounded-xl bg-white/60 border border-white/80" style={{ color }}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${trend > 0 ? 'bg-emerald-200/50 text-emerald-800 border border-emerald-300' : 'bg-rose-200/50 text-rose-800 border border-rose-300'}`}>
              {trend > 0 ? <ArrowUpRight size={10} strokeWidth={4} /> : <ArrowDownRight size={10} strokeWidth={4} />}
              <span className="mr-0.5">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        <div className="mt-5 relative z-10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-2.5 h-[1.5px] opacity-40 animate-pulse bg-current"></div>
            <h3 className={`${vc.textMuted} text-[11px] font-black uppercase tracking-wider leading-none`}>{title}</h3>
          </div>
          <p className="text-3xl font-[900] tracking-tight tabular-nums">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subValue && (
            <div className="flex items-center gap-1.5 mt-2 p-1 px-1.5 bg-white/45 border border-white/60 rounded-lg w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
              <p className="text-[9px] font-black leading-none opacity-80">{subValue}</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Fallback to standard style
  return (
    <motion.div 
      whileHover={{ 
        y: -6,
        scale: 1.01,
        borderColor: color,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="bg-white border-2 border-[var(--border-ui)] border-b-4 p-5 rounded-2xl flex flex-col justify-between transition-colors duration-300 h-full relative overflow-hidden"
      style={{ borderBottomColor: color }}
    >
      <div className="flex justify-between items-start">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-[var(--border-ui)]" style={{ color }}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${trend > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
            {trend > 0 ? <ArrowUpRight size={10} strokeWidth={4} /> : <ArrowDownRight size={10} strokeWidth={4} />}
            <span className="mr-0.5">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="mt-5 relative z-10">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-2.5 h-[1.5px] opacity-40 animate-pulse" style={{ backgroundColor: color }}></div>
          <h3 className="text-[var(--text-muted)] text-[11px] font-black uppercase tracking-wider leading-none">{title}</h3>
        </div>
        <p className="text-3xl font-black text-[var(--text-main)] tracking-tight tabular-nums">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {subValue && (
          <div className="flex items-center gap-1.5 mt-2 p-1 px-1.5 bg-slate-50 border border-[var(--border-ui)] rounded-lg w-fit">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
            <p className="text-[9px] text-[var(--text-muted)] font-black leading-none">{subValue}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const WilayatCard = ({ wilayat, prevTotal, theme }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const growth = ((wilayat.total - prevTotal) / prevTotal * 100).toFixed(2);
  const growthValue = parseFloat(growth);

  return (
    <motion.div 
      layout
      className={`card-polish border ${isExpanded ? 'border-[var(--brand-accent)] ring-2 ring-[var(--brand-accent)]/10' : 'border-[var(--border-ui)]'} bg-white group transition-all duration-300 overflow-hidden rounded-2xl`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-sm transition-colors ${isExpanded ? 'bg-[var(--brand-accent)] text-white' : 'bg-slate-50 text-[var(--brand-primary)] group-hover:bg-[var(--brand-accent)] group-hover:text-white'}`}>
             {wilayat.name.charAt(0)}
          </div>
          <div>
            <h4 className={`font-black text-sm text-[var(--text-main)] ${theme === 'royal' ? 'font-serif' : 'font-sans'}`}>{wilayat.name}</h4>
             <div className="flex items-center gap-1.5 mt-0.5">
               <div className={`w-1.5 h-1.5 rounded-full ${growthValue >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
               <span className="text-[10px] font-black text-[var(--text-muted)]">معدل النمو: {growth}%</span>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-[9px] font-black text-slate-400 uppercase">السكان 2025</div>
            <div className="text-xs font-black text-[var(--brand-primary)]">{(wilayat.total).toLocaleString()}</div>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-lg transition-all ${isExpanded ? 'bg-[var(--brand-accent)] text-white rotate-180' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            <ChevronDown size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="border-t border-[var(--border-ui)] bg-slate-50/50"
          >
             <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-white rounded-xl border border-[var(--border-ui)] shadow-sm">
                      <div className="text-[9px] font-black text-[var(--text-muted)] mb-1">الهيكل الديموغرافي بالجنسية</div>
                      <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100 mb-2">
                         <div className="h-full bg-blue-600" style={{ width: `${(wilayat.omani / wilayat.total * 100)}%` }}></div>
                         <div className="h-full bg-red-600" style={{ width: `${(wilayat.expat / wilayat.total * 100)}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-black">
                         <span className="text-blue-700">عماني: {((wilayat.omani / wilayat.total) * 100).toFixed(1)}%</span>
                         <span className="text-red-700">وافد: {((wilayat.expat / wilayat.total) * 100).toFixed(1)}%</span>
                      </div>
                   </div>
                   <div className="p-3 bg-white rounded-xl border border-[var(--border-ui)] shadow-sm">
                      <div className="text-[9px] font-black text-[var(--text-muted)] mb-1">الهيكل الديموغرافي بالنوع</div>
                      <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100 mb-2">
                         <div className="h-full bg-indigo-500" style={{ width: `${(wilayat.male / wilayat.total * 100)}%` }}></div>
                         <div className="h-full bg-rose-500" style={{ width: `${(wilayat.female / wilayat.total * 100)}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-black">
                         <span className="text-indigo-700">ذكور: {((wilayat.male / wilayat.total) * 100).toFixed(1)}%</span>
                         <span className="text-rose-700">إناث: {((wilayat.female / wilayat.total) * 100).toFixed(1)}%</span>
                      </div>
                   </div>
                </div>
                
                <div className="bg-[var(--brand-accent)]/5 p-2.5 rounded-xl border border-[var(--brand-accent)]/10 flex items-center justify-between">
                   <div className="flex items-center gap-1.5">
                      <TrendingUp size={13} className="text-[var(--brand-accent)]" />
                      <span className="text-[10px] font-black text-[var(--brand-primary)]">الزيادة السنوية:</span>
                   </div>
                   <span className="text-xs font-black text-[var(--brand-accent)]">
                     {growthValue >= 0 ? '+' : ''}{(wilayat.total - prevTotal).toLocaleString()} نسمة
                   </span>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DemographicComparison = ({ wilayat1, wilayat2, data }: any) => {
  const w1 = data.wilayats.find((w: any) => w.name === wilayat1);
  const w2 = data.wilayats.find((w: any) => w.name === wilayat2);

  if (!w1 || !w2) return null;

  const metrics = [
    { 
      label: 'نسبة التوازن النوعي (ذكور : إناث)', 
      v1: (w1.male / w1.female).toFixed(2), 
      v2: (w2.male / w2.female).toFixed(2),
      suffix: ' : 1'
    },
    { 
      label: 'نسبة توطين السكان (المواطنين)', 
      v1: ((w1.omani / w1.total) * 100).toFixed(1), 
      v2: ((w2.omani / w2.total) * 100).toFixed(1),
      suffix: '%'
    },
    { 
      label: 'نسبة القوى العاملة ومقيمي الوافدين', 
      v1: ((w1.expat / w1.total) * 100).toFixed(1), 
      v2: ((w2.expat / w2.total) * 100).toFixed(1),
      suffix: '%'
    },
    { 
      label: 'حصة الولاية من كثافة المحافظة السكنية', 
      v1: ((w1.total / data.total) * 100).toFixed(1), 
      v2: ((w2.total / data.total) * 100).toFixed(1),
      suffix: '%'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="p-3 bg-[var(--brand-primary)]/5 rounded-2xl border border-[var(--brand-primary)]/10 text-center">
          <span className="text-[9px] font-black text-[var(--brand-primary)] uppercase tracking-wider block mb-1">الولاية الأولى</span>
          <span className="text-sm font-black text-[var(--brand-primary)]">{wilayat1}</span>
        </div>
        <div className="p-3 bg-[var(--brand-accent)]/5 rounded-2xl border border-[var(--brand-accent)]/10 text-center">
          <span className="text-[9px] font-black text-[var(--brand-accent)] uppercase tracking-wider block mb-1">الولاية الثانية</span>
          <span className="text-sm font-black text-[var(--brand-accent)]">{wilayat2}</span>
        </div>
      </div>

      {metrics.map(m => (
        <div key={m.label} className="bg-white p-3 rounded-xl border border-[var(--border-ui)] shadow-sm">
          <div className="text-[10px] font-black text-[var(--text-muted)] mb-2 text-center uppercase">{m.label}</div>
          <div className="flex items-center gap-4">
            <div className="flex-1 text-left">
              <span className="text-xs font-black text-[var(--brand-primary)]">{m.v1}{m.suffix}</span>
            </div>
            <div className="flex-[3] h-2 bg-slate-100 rounded-full overflow-hidden flex">
               <div 
                 className="h-full bg-[var(--brand-primary)]" 
                 style={{ width: `${(Number(m.v1) / (Number(m.v1) + Number(m.v2) || 1)) * 100}%` }}
               />
               <div 
                 className="h-full bg-[var(--brand-accent)]" 
                 style={{ width: `${(Number(m.v2) / (Number(m.v1) + Number(m.v2) || 1)) * 100}%` }}
               />
            </div>
            <div className="flex-1 text-right">
              <span className="text-xs font-black text-[var(--brand-accent)]">{m.v2}{m.suffix}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [theme, setTheme] = useState('vibrant');
  const [activeTab, setActiveTab] = useState('overview');

  // Dynamic totals calculated for gender balance
  const totalMale2024 = DATA_2024.wilayats.reduce((sum, w) => sum + w.male, 0);
  const totalFemale2024 = DATA_2024.wilayats.reduce((sum, w) => sum + w.female, 0);
  const totalMale2025 = DATA_2025.wilayats.reduce((sum, w) => sum + w.male, 0);
  const totalFemale2025 = DATA_2025.wilayats.reduce((sum, w) => sum + w.female, 0);
  
  // Dashboard Interactive States - Centralized Reactive System
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedWilayatAge, setSelectedWilayatAge] = useState('all');
  const [selectedNatAge, setSelectedNatAge] = useState('total');
  const [selectedGenderAge, setSelectedGenderAge] = useState('total');
  const [highlightedAgeGroup, setHighlightedAgeGroup] = useState<string | null>(null);
  
  // Comparative analysis states
  const [compareWilayat1, setCompareWilayat1] = useState('صلالة');
  const [compareWilayat2, setCompareWilayat2] = useState('طاقة');
  const [compositionView, setCompositionView] = useState<'nationality' | 'gender'>('nationality');
  const [localCompYear, setLocalCompYear] = useState<'2024' | '2025'>('2025');
  const [heatmapMetric, setHeatmapMetric] = useState<'population' | 'growth'>('population');

  // Demographic simulation states (2030 projections)
  const [simulationWilayat, setSimulationWilayat] = useState<string>('صلالة');
  const [simulatedGrowthRate, setSimulatedGrowthRate] = useState<number>(2.5);

  // Sync localCompYear when global selection changes to a specific year
  useEffect(() => {
    if (selectedYear === '2024' || selectedYear === '2025') {
      setLocalCompYear(selectedYear);
    }
  }, [selectedYear]);

  // Dynamic Census Calculator to ensure mathematically accurate real-time values for ANY selected filters
  const calculateDynamicTotal = useMemo(() => (year: string, wilayatName: string, nationality: string, gender: string) => {
    const omaniYear = AGE_DISTRIBUTION_OMANI[year];
    const expatYear = AGE_DISTRIBUTION_EXPAT[year];
    
    let sum = 0;
    const wilayatsToSum = wilayatName === 'all' ? WILAYAT_NAMES : [wilayatName];
    
    wilayatsToSum.forEach(w => {
      const oRows = omaniYear?.[w] || [];
      const eRows = expatYear?.[w] || [];
      
      const sumRows = (rows: number[][]) => {
        rows.forEach(([m, f]) => {
          if (gender === 'male') sum += m;
          else if (gender === 'female') sum += f;
          else sum += (m + f);
        });
      };
      
      if (nationality === 'total' || nationality === 'omani') {
        sumRows(oRows);
      }
      if (nationality === 'total' || nationality === 'expat') {
        sumRows(eRows);
      }
    });
    
    return sum;
  }, []);

  // Sync population simulation rate to the actual growth rate of the chosen simulationWilayat
  useEffect(() => {
    const tot2024 = calculateDynamicTotal('2024', simulationWilayat, 'total', 'total');
    const tot2025 = calculateDynamicTotal('2025', simulationWilayat, 'total', 'total');
    if (tot2024 > 0) {
      const actualRate = parseFloat((((tot2025 - tot2024) / tot2024) * 100).toFixed(2));
      setSimulatedGrowthRate(actualRate);
    }
  }, [simulationWilayat, calculateDynamicTotal]);

  // Compute the current dynamic comparison of Omani, Expat, Male, Female totals across chosen filters
  const wilayatComparison = useMemo(() => {
    const listToProcess = selectedWilayatAge === 'all' ? WILAYAT_NAMES : [selectedWilayatAge];
    
    return listToProcess.map(name => {
      const tot2024 = calculateDynamicTotal('2024', name, selectedNatAge, selectedGenderAge);
      const tot2025 = calculateDynamicTotal('2025', name, selectedNatAge, selectedGenderAge);
      
      const omani_2024 = calculateDynamicTotal('2024', name, 'omani', selectedGenderAge);
      const omani_2025 = calculateDynamicTotal('2025', name, 'omani', selectedGenderAge);
      const expat_2024 = calculateDynamicTotal('2024', name, 'expat', selectedGenderAge);
      const expat_2025 = calculateDynamicTotal('2025', name, 'expat', selectedGenderAge);
      
      const male_2024 = calculateDynamicTotal('2024', name, selectedNatAge, 'male');
      const male_2025 = calculateDynamicTotal('2025', name, selectedNatAge, 'male');
      const female_2024 = calculateDynamicTotal('2024', name, selectedNatAge, 'female');
      const female_2025 = calculateDynamicTotal('2025', name, selectedNatAge, 'female');
      
      const diff = tot2025 - tot2024;
      const growth = tot2024 > 0 ? ((diff / tot2024) * 100).toFixed(2) : '0.00';
      
      return {
        name,
        '2024': tot2024,
        '2025': tot2025,
        growth,
        omani_2024,
        omani_2025,
        expat_2024,
        expat_2025,
        male_2024,
        male_2025,
        female_2024,
        female_2025,
      };
    });
  }, [selectedWilayatAge, selectedNatAge, selectedGenderAge, calculateDynamicTotal]);

  // Compute the metrics for ALL wilayats to power the Heatmap and other governorate-wide visualizations
  const allWilayatsStats = useMemo(() => {
    return WILAYAT_NAMES.map(name => {
      const tot2024 = calculateDynamicTotal('2024', name, selectedNatAge, selectedGenderAge);
      const tot2025 = calculateDynamicTotal('2025', name, selectedNatAge, selectedGenderAge);
      
      const diff = tot2025 - tot2024;
      const growth = tot2024 > 0 ? ((diff / tot2024) * 100) : 0;
      
      // Approximate area of each wilayat in sq km
      const areas: Record<string, number> = {
        'صلالة': 1500,
        'طاقة': 1000,
        'مرباط': 1500,
        'رخيوت': 1200,
        'ثمريت': 20000,
        'ضلكوت': 800,
        'المزيونة': 15000,
        'مقشن': 25000,
        'شليم وجزر الحلانيات': 28000,
        'سدح': 1800,
      };
      
      const area = areas[name] || 1000;
      const density2024 = tot2024 / area;
      const density2025 = tot2025 / area;
      
      return {
        name,
        '2024': tot2024,
        '2025': tot2025,
        growth: parseFloat(growth.toFixed(2)),
        area,
        density2024,
        density2025,
      };
    });
  }, [selectedNatAge, selectedGenderAge, calculateDynamicTotal]);

  const activeCensusData = useMemo(() => {
    if (selectedWilayatAge === 'all') {
      return wilayatComparison.reduce((acc, curr) => {
        acc['2024'] += curr['2024'];
        acc['2025'] += curr['2025'];
        acc.omani_2024 += curr.omani_2024;
        acc.omani_2025 += curr.omani_2025;
        acc.expat_2024 += curr.expat_2024;
        acc.expat_2025 += curr.expat_2025;
        acc.male_2024 += curr.male_2024;
        acc.male_2025 += curr.male_2025;
        acc.female_2024 += curr.female_2024;
        acc.female_2025 += curr.female_2025;
        return acc;
      }, {
        name: 'محافظة ظفار',
        '2024': 0,
        '2025': 0,
        growth: '0.00',
        omani_2024: 0,
        omani_2025: 0,
        expat_2024: 0,
        expat_2025: 0,
        male_2024: 0,
        male_2025: 0,
        female_2024: 0,
        female_2025: 0,
      });
    }
    return wilayatComparison[0] || null;
  }, [selectedWilayatAge, wilayatComparison]);

  // Dynamic age group data computed cleanly with reference to filtered inputs
  const ageGroupData = useMemo(() => {
    return AGE_RANGES.map((range, idx) => {
      const getSumForYear = (year: string) => {
        const oDist = AGE_DISTRIBUTION_OMANI[year] || {};
        const eDist = AGE_DISTRIBUTION_EXPAT[year] || {};
        
        let maleSum = 0;
        let femaleSum = 0;
        
        const targetWilayats = selectedWilayatAge === 'all' ? WILAYAT_NAMES : [selectedWilayatAge];
        
        targetWilayats.forEach(w => {
          const o = oDist[w]?.[idx] || [0, 0];
          const e = eDist[w]?.[idx] || [0, 0];
          
          if (selectedNatAge === 'total' || selectedNatAge === 'omani') {
            maleSum += o[0];
            femaleSum += o[1];
          }
          if (selectedNatAge === 'total' || selectedNatAge === 'expat') {
            maleSum += e[0];
            femaleSum += e[1];
          }
        });
        
        // Apply Gender Filter
        if (selectedGenderAge === 'male') {
          return { male: maleSum, female: 0, total: maleSum };
        } else if (selectedGenderAge === 'female') {
          return { male: 0, female: femaleSum, total: femaleSum };
        } else {
          return { male: maleSum, female: femaleSum, total: maleSum + femaleSum };
        }
      };

      const d2024 = getSumForYear('2024');
      const d2025 = getSumForYear('2025');

      if (selectedYear === 'compare') {
        return {
          range,
          total_2024: d2024.total,
          total_2025: d2025.total
        };
      }

      const activeData = selectedYear === '2024' ? d2024 : d2025;
      
      return {
        range,
        male: activeData.male,
        female: activeData.female,
        total: activeData.total
      };
    });
  }, [selectedYear, selectedWilayatAge, selectedNatAge, selectedGenderAge]);

  // Compute cumulative age group data for 2024 vs 2025
  const cumulativeAgeData = useMemo(() => {
    let cumulative2024 = 0;
    let cumulative2025 = 0;

    return AGE_RANGES.map((range, idx) => {
      const getSumForYear = (year: string) => {
        const oDist = AGE_DISTRIBUTION_OMANI[year] || {};
        const eDist = AGE_DISTRIBUTION_EXPAT[year] || {};
        
        let maleSum = 0;
        let femaleSum = 0;
        
        const targetWilayats = selectedWilayatAge === 'all' ? WILAYAT_NAMES : [selectedWilayatAge];
        
        targetWilayats.forEach(w => {
          const o = oDist[w]?.[idx] || [0, 0];
          const e = eDist[w]?.[idx] || [0, 0];
          
          if (selectedNatAge === 'total' || selectedNatAge === 'omani') {
            maleSum += o[0];
            femaleSum += o[1];
          }
          if (selectedNatAge === 'total' || selectedNatAge === 'expat') {
            maleSum += e[0];
            femaleSum += e[1];
          }
        });
        
        // Apply Gender Filter
        if (selectedGenderAge === 'male') {
          return maleSum;
        } else if (selectedGenderAge === 'female') {
          return femaleSum;
        } else {
          return maleSum + femaleSum;
        }
      };

      const total2024 = getSumForYear('2024');
      const total2025 = getSumForYear('2025');

      cumulative2024 += total2024;
      cumulative2025 += total2025;

      return {
        range,
        total2024,
        total2025,
        cumulative2024,
        cumulative2025,
      };
    });
  }, [selectedWilayatAge, selectedNatAge, selectedGenderAge]);

  // Compute Health Planning specific indicators
  const healthPlanningData = useMemo(() => {
    const targetWilayats = selectedWilayatAge === 'all' ? WILAYAT_NAMES : [selectedWilayatAge];
    const targetYears = ['2024', '2025'];
    
    const results: Record<string, {
      total: number;
      infants: number;
      schoolAge: number;
      maternalFemales: number;
      elderly: number;
      childrenTotal: number;
      workingAge: number;
      dependencyRatio: number;
      expectedConsultations: number;
    }> = {};

    targetYears.forEach(year => {
      const oDist = AGE_DISTRIBUTION_OMANI[year] || {};
      const eDist = AGE_DISTRIBUTION_EXPAT[year] || {};
      
      let infants = 0;
      let schoolAge = 0;
      let maternalFemales = 0;
      let elderly = 0;
      let childrenTotal = 0;
      let workingAge = 0;
      let total = 0;
      
      targetWilayats.forEach(w => {
        const oList = oDist[w] || [];
        const eList = eDist[w] || [];
        
        AGE_RANGES.forEach((range, idx) => {
          const o = oList[idx] || [0, 0];
          const e = eList[idx] || [0, 0];
          
          let mSum = 0;
          let fSum = 0;
          
          if (selectedNatAge === 'total' || selectedNatAge === 'omani') {
            mSum += o[0];
            fSum += o[1];
          }
          if (selectedNatAge === 'total' || selectedNatAge === 'expat') {
            mSum += e[0];
            fSum += e[1];
          }
          
          const sum = mSum + fSum;
          total += sum;
          
          if (idx === 0) {
            infants += sum;
          }
          if (idx === 1 || idx === 2) {
            schoolAge += sum;
          }
          if (idx <= 2) {
            childrenTotal += sum;
          }
          if (idx >= 3 && idx <= 11) {
            workingAge += sum;
          }
          if (idx >= 12) {
            elderly += sum;
          }
          if (idx >= 3 && idx <= 9) {
            maternalFemales += fSum;
          }
        });
      });
      
      const depRatio = workingAge > 0 ? ((childrenTotal + elderly) / workingAge) * 100 : 0;
      const expectedConsultations = (infants * 4) + (schoolAge * 1.5) + ((workingAge - maternalFemales) * 2) + (maternalFemales * 3.5) + (elderly * 6);
      
      results[year] = {
        total,
        infants,
        schoolAge,
        maternalFemales,
        elderly,
        childrenTotal,
        workingAge,
        dependencyRatio: parseFloat(depRatio.toFixed(1)),
        expectedConsultations: Math.round(expectedConsultations)
      };
    });
    
    return results;
  }, [selectedWilayatAge, selectedNatAge, selectedGenderAge]);

  const healthPriorityRanking = useMemo(() => {
    const list = WILAYAT_NAMES.map(name => {
      const pop2024 = calculateDynamicTotal('2024', name, 'total', 'total');
      const pop2025 = calculateDynamicTotal('2025', name, 'total', 'total');
      const growth = pop2024 > 0 ? ((pop2025 - pop2024) / pop2024) * 100 : 0;
      
      const oDist25 = AGE_DISTRIBUTION_OMANI['2025']?.[name] || [];
      const eDist25 = AGE_DISTRIBUTION_EXPAT['2025']?.[name] || [];
      
      let vulnerableSum = 0;
      AGE_RANGES.forEach((range, idx) => {
        const o = oDist25[idx] || [0, 0];
        const e = eDist25[idx] || [0, 0];
        const sum = o[0] + o[1] + e[0] + e[1];
        if (idx === 0 || idx >= 12) {
          vulnerableSum += sum;
        }
      });
      const vulnerabilityFrac = pop2025 > 0 ? (vulnerableSum / pop2025) : 0;
      
      return {
        name,
        pop2025,
        growth,
        vulnerabilities: vulnerableSum,
        vulnerabilityFrac
      };
    });
    
    const maxPop = Math.max(...list.map(w => w.pop2025));
    const maxScalePop = maxPop > 0 ? maxPop : 1;
    const maxGrowth = Math.max(...list.map(w => w.growth));
    const maxScaleGrowth = maxGrowth > 0 ? maxGrowth : 1;
    const maxVuln = Math.max(...list.map(w => w.vulnerabilityFrac));
    const maxScaleVuln = maxVuln > 0 ? maxVuln : 1;
    
    return list.map(item => {
      const popScore = (item.pop2025 / maxScalePop) * 40;
      const growthScore = (item.growth / maxScaleGrowth) * 35;
      const vulnScore = (item.vulnerabilityFrac / maxScaleVuln) * 25;
      const priorityScore = parseFloat((popScore + growthScore + vulnScore).toFixed(1));
      
      let recommendation = '';
      if (priorityScore >= 75) {
        recommendation = 'أولوية قصوى: توسعة المراكز الصحية وتكثيف الطواقم الطبية';
      } else if (priorityScore >= 45) {
        recommendation = 'أولوية متوسطة: تحسين أجهزة رعاية الأمومة والطفولة';
      } else {
        recommendation = 'أولوية مستقرة: كفاية الخدمات الحالية مع المتابعة الدورية';
      }
      
      return {
        ...item,
        priorityScore,
        recommendation
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }, [calculateDynamicTotal]);

  return (
    <div className="theme-container theme-transition relative p-4 md:p-8 font-sans" dir="rtl" data-theme={theme}>
      {/* Structural Omani background motif */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l40 40-40 40L0 40z' fill='var(--brand-accent)' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[var(--border-ui)] pb-6 mb-6">
        {/* Top Institutional Row: Arabic and English details on the exact same horizontal level */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-dashed border-[var(--border-ui)] pb-5 mb-5">
          {/* Arabic block (Right side) */}
          <div className="text-center md:text-right flex-1 select-none">
            <div className="font-black text-[var(--brand-primary)] text-sm leading-tight">المديرية العامة للخدمات الصحية</div>
            <div className="font-bold text-[var(--brand-accent)] text-xs leading-tight mt-0.5">بمحافظة ظفار</div>
            <div className="text-[10px] text-[var(--text-muted)] font-black mt-1">دائرة التخطيط والتنظيم الصحي / قسم المعلومات الصحية</div>
          </div>

          {/* Central Logo Motif */}
          <div className="flex justify-center items-center scale-110 shrink-0 min-w-[50px] my-2 md:my-0">
            <LubanTreeIcon />
          </div>

          {/* English block (Left side) */}
          <div className="text-center md:text-left flex-1 select-none font-sans" dir="ltr">
            <div className="font-extrabold text-[var(--brand-primary)] text-[13px] leading-tight">Directorate General of Health Services</div>
            <div className="font-bold text-[var(--brand-accent)] text-[11px] leading-tight mt-0.5">Dhofar Governorate</div>
            <div className="text-[9px] text-[var(--text-muted)] font-black mt-1">Health Planning & Information Department</div>
          </div>
        </div>

        {/* Lower Section: Centered Title, Subtitle, and Theme Selector beneath them */}
        <div className="flex flex-col items-center gap-3.5 pt-1 w-full">
          {/* Main Titles perfectly centered */}
          <div className="text-center flex flex-col items-center">
            <h1 className="font-display text-xl md:text-2xl lg:text-3xl font-[900] text-[var(--brand-primary)] tracking-tight leading-tight hover:scale-101 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              التعداد السكاني لمحافظة ظفار 2024-2025
            </h1>
            <p className="font-display text-[11px] md:text-xs font-bold text-[var(--brand-accent)] mt-1.5 tracking-wide text-center">
              المؤشرات الديموغرافية والنوعية
            </p>
          </div>

          {/* Theme selection buttons centered underneath the subtitle */}
          <div className="flex justify-center w-full mt-1.5">
            <div className="flex items-center gap-2 bg-slate-50 border border-[var(--border-ui)] rounded-xl p-1 shadow-inner h-9 select-none">
              <span className="flex items-center gap-1 text-[var(--brand-primary)] px-2 font-black text-xs">
                مظهر النمط:
              </span>
              <div className="flex rounded-lg overflow-hidden border border-[var(--border-ui)]/50 p-0.5 bg-white h-7 items-center">
                {[
                  { id: 'vibrant', label: 'المظهر النابض ✨' },
                  { id: 'original', label: 'الأساسي' },
                  { id: 'royal', label: 'تراثي ذهبي' },
                  { id: 'khareef', label: 'الخريف' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`px-3.5 py-0.5 rounded-md text-xs font-black transition-all h-full ${
                      theme === t.id 
                        ? 'bg-[var(--brand-primary)] text-white shadow-sm' 
                        : 'text-[var(--text-muted)] hover:bg-slate-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <nav className="relative z-10 flex flex-nowrap items-center justify-start lg:justify-center overflow-x-auto no-scrollbar mb-8 bg-white p-1.5 rounded-2xl border border-[var(--border-ui)] gap-0.5 sm:gap-1 shadow-sm w-full">
          {[
            { id: 'overview', label: 'المؤشرات العامة', icon: <PieChartIcon size={14} /> },
            { id: 'analysis', label: 'التحليل الديموغرافي', icon: <TrendingUp size={14} /> },
            { id: 'age', label: 'الهيكل الهرمي', icon: <BarChartIcon size={14} /> },
            { id: 'wilayats', label: 'التوزيع بالولايات', icon: <MapPin size={14} /> },
            { id: 'gender', label: 'التوزيع حسب النوع', icon: <Users size={14} /> },
            { id: 'composition', label: 'التوزيع بالجنسية', icon: <Globe size={14} /> },
            { id: 'health_planning', label: 'مؤشرات التخطيط الصحي', icon: <HeartPulse size={14} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                // Reset custom highlighted ranges when tab shifts
                setHighlightedAgeGroup(null);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-xl text-[10px] sm:text-[11px] md:text-xs font-black transition-all duration-300 whitespace-nowrap shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-[var(--brand-primary)] text-white shadow-md scale-102' 
                  : 'text-[var(--text-muted)] hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Global Filter Bar - Syncs and filters all charts across standard options */}
        {activeTab !== 'overview' && (
          <div className="relative z-15 sticky top-2 mb-6 flex flex-wrap items-center justify-start gap-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[var(--border-ui)] shadow-md w-full">
            
            {/* 1. Wilayat Filter */}
            <div className="flex items-center gap-2 bg-slate-50 border border-[var(--border-ui)] rounded-xl p-1 shadow-inner h-9 select-none">
              <span className="flex items-center gap-1.5 text-[var(--brand-accent)] px-2">
                <MapPin size={14} />
                <span className="text-xs font-black">الولاية</span>
              </span>
              <select 
                value={selectedWilayatAge}
                onChange={(e) => setSelectedWilayatAge(e.target.value)}
                className="bg-white border border-[var(--border-ui)]/50 rounded-lg px-2 py-0.5 text-[var(--brand-primary)] text-xs font-black outline-none cursor-pointer h-7"
              >
                <option value="all">كل ولايات محافظة ظفار</option>
                {WILAYAT_NAMES.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            {/* 2. Year Filter */}
            <div className="flex items-center gap-2 bg-slate-50 border border-[var(--border-ui)] rounded-xl p-1 shadow-inner h-9 select-none">
              <span className="flex items-center gap-1.5 text-[var(--brand-accent)] px-2">
                <Calendar size={14} />
                <span className="text-xs font-black">السنة</span>
              </span>
              <div className="flex rounded-lg overflow-hidden border border-[var(--border-ui)]/50 p-0.5 bg-white h-7 items-center">
                {['2024', '2025', 'compare'].map(y => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    className={`px-3 py-0.5 text-xs font-black transition-all rounded-md h-full whitespace-nowrap ${
                      selectedYear === y 
                        ? 'bg-[var(--brand-primary)] text-white shadow-sm' 
                        : 'text-[var(--text-muted)] hover:bg-slate-50'
                    }`}
                  >
                    {y === 'compare' ? 'مقارنة الأعوام' : y}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Nationality Filter */}
            <div className="flex items-center gap-2 bg-slate-50 border border-[var(--border-ui)] rounded-xl p-1 shadow-inner h-9 select-none">
              <span className="flex items-center gap-1.5 text-[var(--brand-accent)] px-2">
                <Users size={14} />
                <span className="text-xs font-black">الجنسية</span>
              </span>
              <div className="flex rounded-lg overflow-hidden border border-[var(--border-ui)]/50 p-0.5 bg-white h-7 items-center">
                {['total', 'omani', 'expat'].map(n => (
                  <button
                    key={n}
                    onClick={() => setSelectedNatAge(n)}
                    className={`px-3 py-0.5 text-xs font-black transition-all rounded-md h-full whitespace-nowrap ${
                      selectedNatAge === n 
                        ? 'bg-[var(--brand-primary)] text-white shadow-sm' 
                        : 'text-[var(--text-muted)] hover:bg-slate-50'
                    }`}
                  >
                    {n === 'total' ? 'الجميع' : n === 'omani' ? 'مواطنون' : 'وافدون'}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Gender Filter */}
            {activeTab !== 'health_planning' && (
              <div className="flex items-center gap-2 bg-slate-50 border border-[var(--border-ui)] rounded-xl p-1 shadow-inner h-9 select-none font-sans">
                <span className="flex items-center gap-1.5 text-[var(--brand-accent)] px-2">
                  <Activity size={14} />
                  <span className="text-xs font-black leading-none">النوع</span>
                </span>
                <div className="flex rounded-lg overflow-hidden border border-[var(--border-ui)]/50 p-0.5 bg-white h-7 items-center">
                  {['total', 'male', 'female'].map(g => (
                    <button
                      key={g}
                      onClick={() => setSelectedGenderAge(g)}
                      className={`px-3 py-0.5 text-xs font-black transition-all rounded-md h-full whitespace-nowrap ${
                        selectedGenderAge === g 
                          ? 'bg-[var(--brand-primary)] text-white shadow-sm' 
                          : 'text-[var(--text-muted)] hover:bg-slate-50'
                      }`}
                    >
                      {g === 'total' ? 'الكل' : g === 'male' ? 'ذكور' : 'إناث'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* 1. STATE OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {// Dynamic KPIs of General Dhofar Governorate
              (() => {
                const total2024 = DATA_2024.total;
                const total2025 = DATA_2025.total;
                const growthRate = ((total2025 - total2024) / total2024 * 100).toFixed(2);
                const absChange = total2025 - total2024;
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                      index={0}
                      theme={theme}
                      title="إجمالي السكان (2024)" 
                      value={total2024} 
                      icon={Users} 
                      color="var(--brand-primary)" 
                    />
                    <StatCard 
                      index={1}
                      theme={theme}
                      title="إجمالي السكان (2025)" 
                      value={total2025} 
                      icon={Users} 
                      color="var(--brand-accent)" 
                    />
                    <StatCard 
                      index={2}
                      theme={theme}
                      title="معدل النمو السنوي" 
                      value={`+${growthRate}%`} 
                      subValue="الزيادة النسبية للمحافظة" 
                      icon={TrendingUp} 
                      trend={parseFloat(growthRate)}
                      color="#10b981" 
                    />
                    <StatCard 
                      index={3}
                      theme={theme}
                      title="الزيادة السنوية" 
                      value={absChange} 
                      subValue="عدد السكان الإضافي في عام" 
                      icon={Activity} 
                      color="#f59e0b" 
                    />
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Nationality Structure */}
                <div className="card-polish p-6 shadow-sm border border-[var(--border-ui)]">
                  <div className="flex flex-col gap-1 mb-5 border-b border-[var(--border-ui)] pb-3">
                    <div className="flex items-center gap-2">
                      <Globe size={18} className="text-[var(--brand-accent)]" />
                      <h3 className={`text-base font-black text-[var(--brand-primary)] ${theme === 'royal' ? 'font-serif' : 'font-sans'}`}>التوزيع السكاني حسب الجنسية</h3>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] font-black mr-7 leading-none">مقارنة ديموغرافية بالعدد والنسبة المئوية</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-[11px] font-black text-[var(--text-muted)] mb-1.5">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800">عام 2024</span>
                        <span className="text-blue-600">{((DATA_2024.omani / DATA_2024.total)*100).toFixed(1)}% مواطنون مقابل {((DATA_2024.expat / DATA_2024.total)*100).toFixed(1)}% وافدون</span>
                      </div>
                      <div className="w-full h-9 bg-slate-50 rounded-full overflow-hidden flex border border-[var(--border-ui)] shadow-inner p-0.5">
                        <div className="h-full bg-blue-600 rounded-r-full flex items-center justify-center text-[10px] text-white font-extrabold transition-all duration-500 hover:opacity-90" style={{ width: `${(DATA_2024.omani / DATA_2024.total * 100)}%` }}>
                          Omani: {DATA_2024.omani.toLocaleString()} ({ (DATA_2024.omani / DATA_2024.total * 100).toFixed(1) }%)
                        </div>
                        <div className="h-full bg-red-600 rounded-l-full flex items-center justify-center text-[10px] text-white font-extrabold transition-all duration-500 hover:opacity-90" style={{ width: `${(DATA_2024.expat / DATA_2024.total * 100)}%` }}>
                          Expat: {DATA_2024.expat.toLocaleString()} ({ (DATA_2024.expat / DATA_2024.total * 100).toFixed(1) }%)
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-black text-[var(--text-muted)] mb-1.5">
                        <span className="bg-indigo-50 px-2 py-0.5 rounded text-indigo-800">عام 2025</span>
                        <span className="text-indigo-600">{((DATA_2025.omani / DATA_2025.total)*100).toFixed(1)}% مواطنون مقابل {((DATA_2025.expat / DATA_2025.total)*100).toFixed(1)}% وافدون</span>
                      </div>
                      <div className="w-full h-9 bg-slate-50 rounded-full overflow-hidden flex border border-[var(--border-ui)] shadow-inner p-0.5">
                        <div className="h-full bg-blue-600 rounded-r-full flex items-center justify-center text-[10px] text-white font-extrabold transition-all duration-500 hover:opacity-90" style={{ width: `${(DATA_2025.omani / DATA_2025.total * 100)}%` }}>
                          Omani: {DATA_2025.omani.toLocaleString()} ({ (DATA_2025.omani / DATA_2025.total * 100).toFixed(1) }%)
                        </div>
                        <div className="h-full bg-red-600 rounded-l-full flex items-center justify-center text-[10px] text-white font-extrabold transition-all duration-500 hover:opacity-90" style={{ width: `${(DATA_2025.expat / DATA_2025.total * 100)}%` }}>
                          Expat: {DATA_2025.expat.toLocaleString()} ({ (DATA_2025.expat / DATA_2025.total * 100).toFixed(1) }%)
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[var(--border-ui)]/60 pt-4 mt-2 space-y-3">
                      {/* Grid Header */}
                      <div className="grid grid-cols-3 text-[10px] font-black text-[var(--text-muted)] px-1">
                        <div>التوزيع السنوي</div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-600 block"></span>
                          <span>المواطنون العمانيون</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-600 block"></span>
                          <span>المقيمون الوافدون</span>
                        </div>
                      </div>

                      {/* 2024 Row */}
                      <div className="grid grid-cols-3 items-center bg-slate-50/50 hover:bg-slate-100/50 duration-200 p-2 rounded-lg border border-[var(--border-ui)]/40">
                        <span className="text-[11px] font-black text-slate-500">عام 2024</span>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-extrabold text-slate-800">{DATA_2024.omani.toLocaleString()} نسمة</span>
                          <span className="text-[9px] font-black text-blue-600">({((DATA_2024.omani / DATA_2024.total)*100).toFixed(1)}%)</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-extrabold text-slate-800">{DATA_2024.expat.toLocaleString()} نسمة</span>
                          <span className="text-[9px] font-black text-red-600">({((DATA_2024.expat / DATA_2024.total)*100).toFixed(1)}%)</span>
                        </div>
                      </div>

                      {/* 2025 Row */}
                      <div className="grid grid-cols-3 items-center bg-indigo-50/25 hover:bg-indigo-50/55 duration-200 p-2 rounded-lg border border-indigo-100/60">
                        <span className="text-[11px] font-black text-indigo-700">عام 2025</span>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-extrabold text-slate-800">{DATA_2025.omani.toLocaleString()} نسمة</span>
                          <span className="text-[9px] font-black text-blue-600">({((DATA_2025.omani / DATA_2025.total)*100).toFixed(1)}%)</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-extrabold text-slate-800">{DATA_2025.expat.toLocaleString()} نسمة</span>
                          <span className="text-[9px] font-black text-red-600">({((DATA_2025.expat / DATA_2025.total)*100).toFixed(1)}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gender Structure */}
                <div className="card-polish p-6 shadow-sm border border-[var(--border-ui)] flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-1 mb-5 border-b border-[var(--border-ui)] pb-3">
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-[var(--brand-accent)]" />
                      <h3 className={`text-base font-black text-[var(--brand-primary)] ${theme === 'royal' ? 'font-serif' : 'font-sans'}`}>التوزيع السكاني حسب النوع</h3>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] font-black mr-7 leading-none">مقارنة التوزيع السكاني حسب النوع و الجنس</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-[var(--border-ui)] flex-1 mb-6">
                    {/* 2024 */}
                    <div className="space-y-4 pb-4 md:pb-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md w-fit">عام 2024</h4>
                        <span className="text-[10px] font-black text-slate-400">الإجمالي: {DATA_2024.total.toLocaleString()} نسمة</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div className="flex flex-col gap-2">
                          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100/50 hover:bg-indigo-50 duration-200">
                            <span className="text-[9px] font-black text-indigo-700 uppercase block mb-0.5">الذكور</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-black text-indigo-900">
                                {totalMale2024.toLocaleString()}
                              </span>
                              <span className="text-[9px] font-black text-indigo-700">{((totalMale2024 / DATA_2024.total) * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                          <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-100/50 hover:bg-rose-50 duration-200">
                            <span className="text-[9px] font-black text-rose-700 uppercase block mb-0.5">الإناث</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-black text-rose-900">
                                {totalFemale2024.toLocaleString()}
                              </span>
                              <span className="text-[9px] font-black text-rose-700">{((totalFemale2024 / DATA_2024.total) * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-[var(--border-ui)] border-dashed hidden sm:flex h-full min-h-[160px]">
                          <span className="text-[10px] font-black text-[var(--text-muted)] mb-3">نسبة الذكور</span>
                          <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                              <circle cx="56" cy="56" r="46" fill="transparent" stroke="var(--border-ui)" strokeWidth="8" />
                              <circle cx="56" cy="56" r="46" fill="transparent" stroke="#4f46e5" strokeWidth="8" strokeDasharray="289" strokeDashoffset={289 - (289 * (totalMale2024 / DATA_2024.total))} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                              <span className="text-base font-black text-[var(--brand-primary)]">{((totalMale2024 / DATA_2024.total) * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2025 */}
                    <div className="space-y-4 pt-4 md:pt-0 md:pr-6 md:border-r border-[var(--border-ui)]">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md w-fit">عام 2025</h4>
                        <span className="text-[10px] font-black text-slate-400">الإجمالي: {DATA_2025.total.toLocaleString()} نسمة</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div className="flex flex-col gap-2">
                          <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100/50 hover:bg-indigo-50 duration-200">
                            <span className="text-[9px] font-black text-indigo-700 uppercase block mb-0.5">الذكور</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-black text-indigo-900">
                                {totalMale2025.toLocaleString()}
                              </span>
                              <span className="text-[9px] font-black text-indigo-700">{((totalMale2025 / DATA_2025.total) * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                          <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-100/50 hover:bg-rose-50 duration-200">
                            <span className="text-[9px] font-black text-rose-700 uppercase block mb-0.5">الإناث</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-black text-rose-900">
                                {totalFemale2025.toLocaleString()}
                              </span>
                              <span className="text-[9px] font-black text-rose-700">{((totalFemale2025 / DATA_2025.total) * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-[var(--border-ui)] border-dashed hidden sm:flex h-full min-h-[160px]">
                          <span className="text-[10px] font-black text-[var(--text-muted)] mb-3">نسبة الذكور</span>
                          <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                              <circle cx="56" cy="56" r="46" fill="transparent" stroke="var(--border-ui)" strokeWidth="8" />
                              <circle cx="56" cy="56" r="46" fill="transparent" stroke="#4f46e5" strokeWidth="8" strokeDasharray="289" strokeDashoffset={289 - (289 * (totalMale2025 / DATA_2025.total))} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                              <span className="text-base font-black text-[var(--brand-primary)]">{((totalMale2025 / DATA_2025.total) * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal visual split bar just like the Left Card to balance them perfectly! */}
                  <div className="border-t border-[var(--border-ui)]/60 pt-4 space-y-3">
                    <div className="grid grid-cols-3 text-[10px] font-black text-[var(--text-muted)] px-1">
                      <div>المؤشر المقارن للنوع</div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 block"></span>
                        <span>الذكور</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500 block"></span>
                        <span>الإناث</span>
                      </div>
                    </div>

                    {/* 2024 Gender split bar */}
                    <div>
                      <div className="flex justify-between text-[11px] font-black text-[var(--text-muted)] mb-1">
                        <span>عام 2024</span>
                        <span className="text-indigo-600">{((totalMale2024 / DATA_2024.total)*100).toFixed(1)}% ذكور مقابل {((totalFemale2024 / DATA_2024.total)*100).toFixed(1)}% إناث</span>
                      </div>
                      <div className="w-full h-8 bg-slate-50 rounded-full overflow-hidden flex border border-[var(--border-ui)] shadow-inner p-0.5">
                        <div className="h-full bg-indigo-600 rounded-r-full flex items-center justify-center text-[10px] text-white font-extrabold transition-all duration-500 hover:opacity-90 animate-pulse-slow" style={{ width: `${(totalMale2024 / DATA_2024.total * 100)}%` }}>
                          ذكور ({ (totalMale2024 / DATA_2024.total * 100).toFixed(1) }%)
                        </div>
                        <div className="h-full bg-rose-500 rounded-l-full flex items-center justify-center text-[10px] text-white font-extrabold transition-all duration-500 hover:opacity-90" style={{ width: `${(totalFemale2024 / DATA_2024.total * 100)}%` }}>
                          إناث ({ (totalFemale2024 / DATA_2024.total * 100).toFixed(1) }%)
                        </div>
                      </div>
                    </div>

                    {/* 2025 Gender split bar */}
                    <div>
                      <div className="flex justify-between text-[11px] font-black text-[var(--text-muted)] mb-1">
                        <span>عام 2025</span>
                        <span className="text-indigo-600">{((totalMale2025 / DATA_2025.total)*100).toFixed(1)}% ذكور مقابل {((totalFemale2025 / DATA_2025.total)*100).toFixed(1)}% إناث</span>
                      </div>
                      <div className="w-full h-8 bg-slate-50 rounded-full overflow-hidden flex border border-[var(--border-ui)] shadow-inner p-0.5">
                        <div className="h-full bg-indigo-600 rounded-r-full flex items-center justify-center text-[10px] text-white font-extrabold transition-all duration-500 hover:opacity-90 animate-pulse-slow" style={{ width: `${(totalMale2025 / DATA_2025.total * 100)}%` }}>
                          ذكور ({ (totalMale2025 / DATA_2025.total * 100).toFixed(1) }%)
                        </div>
                        <div className="h-full bg-rose-500 rounded-l-full flex items-center justify-center text-[10px] text-white font-extrabold transition-all duration-500 hover:opacity-90" style={{ width: `${(totalFemale2025 / DATA_2025.total * 100)}%` }}>
                          إناث ({ (totalFemale2025 / DATA_2025.total * 100).toFixed(1) }%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Growth Wilayats Grid */}
              <div className="card-polish p-6 shadow-sm border border-[var(--border-ui)]">
                <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                  <h3 className={`text-sm font-black text-[var(--brand-primary)] ${theme === 'royal' ? 'font-serif' : 'font-sans'}`}>الولايات الأكثر نمواً سكانياً</h3>
                  <TrendingUp size={16} className="text-emerald-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...DATA_2025.wilayats]
                    .map(w => {
                      const prev = DATA_2024.wilayats.find(p => p.name === w.name);
                      return { data: w, prevTotal: prev?.total || 1, growth: prev ? ((w.total - prev.total) / prev.total * 100) : 0 };
                    })
                    .sort((a, b) => b.growth - a.growth)
                    .slice(0, 6)
                    .map((w) => (
                      <WilayatCard key={w.data.name} wilayat={w.data} prevTotal={w.prevTotal} theme={theme} />
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. DEMOGRAPHIC COMPARISON TAB */}
          {activeTab === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(() => {
                  const currentWilayat = activeCensusData;
                  if (!currentWilayat) return null;
                  
                  const omaniGrowth = currentWilayat.omani_2024 > 0 
                    ? (((currentWilayat.omani_2025 - currentWilayat.omani_2024) / currentWilayat.omani_2024) * 100).toFixed(2) 
                    : '0.00';
                  const expatGrowth = currentWilayat.expat_2024 > 0 
                    ? (((currentWilayat.expat_2025 - currentWilayat.expat_2024) / currentWilayat.expat_2024) * 100).toFixed(2) 
                    : '0.00';
                  
                  return (
                    <>
                      <StatCard 
                        index={0}
                        theme={theme}
                        title="معدل نمو العمانيين" 
                        value={`${parseFloat(omaniGrowth) >= 0 ? '+' : ''}${omaniGrowth}%`} 
                        subValue="تغير سنوي للمواطنين" 
                        icon={UserCheck} 
                        trend={parseFloat(omaniGrowth)}
                        color="#2563eb" 
                      />
                      <StatCard 
                        index={1}
                        theme={theme}
                        title="معدل نمو الوافدين" 
                        value={`${parseFloat(expatGrowth) >= 0 ? '+' : ''}${expatGrowth}%`} 
                        subValue="تغير سنوي للمقيمين" 
                        icon={Globe} 
                        trend={parseFloat(expatGrowth)}
                        color="#dc2626" 
                      />
                      <StatCard 
                        index={2}
                        theme={theme}
                        title="التغير السكاني الصافي" 
                        value={(currentWilayat['2025'] - currentWilayat['2024'])} 
                        subValue="الفرق العددي" 
                        icon={Users} 
                        trend={currentWilayat['2025'] - currentWilayat['2024']}
                        color="var(--brand-accent)" 
                      />
                    </>
                  );
                })()}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-polish p-5 shadow-sm">
                  <h3 className={`text-sm font-black text-[var(--brand-primary)] mb-4 ${theme === 'royal' ? 'font-serif' : 'font-sans'}`}>التعداد السنوي حسب الولايات</h3>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={wilayatComparison}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-ui)" />
                        <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 'bold' }} stroke="var(--border-ui)" />
                        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} stroke="var(--border-ui)" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-ui)', borderRadius: '12px' }}
                          formatter={(value) => [value?.toLocaleString() ?? 0, 'نسمة']}
                        />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" dataKey="2025" fill="var(--brand-accent)" fillOpacity={0.08} stroke="var(--brand-accent)" strokeWidth={2} name="تعداد سنة 2025" />
                        <Bar dataKey="2024" name="سنة 2024" fill="#cbd5e1" radius={[3, 3, 0, 0]} maxBarSize={30} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {(() => {
                  const isNationality = compositionView === 'nationality';
                  const totalComp = isNationality
                    ? (localCompYear === '2024' ? (activeCensusData?.omani_2024 || 0) + (activeCensusData?.expat_2024 || 0) : (activeCensusData?.omani_2025 || 0) + (activeCensusData?.expat_2025 || 0))
                    : (localCompYear === '2024' ? (activeCensusData?.male_2024 || 0) + (activeCensusData?.female_2024 || 0) : (activeCensusData?.male_2025 || 0) + (activeCensusData?.female_2025 || 0));

                  const compData = isNationality ? [
                    { 
                      name: 'عمانيين', 
                      value: localCompYear === '2024' ? (activeCensusData?.omani_2024 || 0) : (activeCensusData?.omani_2025 || 0), 
                      color: '#3b82f6' 
                    },
                    { 
                      name: 'وافدين', 
                      value: localCompYear === '2024' ? (activeCensusData?.expat_2024 || 0) : (activeCensusData?.expat_2025 || 0), 
                      color: '#ef4444' 
                    },
                  ] : [
                    { 
                      name: 'ذكور', 
                      value: localCompYear === '2024' ? (activeCensusData?.male_2024 || 0) : (activeCensusData?.male_2025 || 0), 
                      color: '#4f46e5' 
                    },
                    { 
                      name: 'إناث', 
                      value: localCompYear === '2024' ? (activeCensusData?.female_2024 || 0) : (activeCensusData?.female_2025 || 0), 
                      color: '#db2777' 
                    },
                  ];

                  const compList = isNationality ? [
                    { 
                      label: 'المواطنون العمانيون', 
                      count: localCompYear === '2024' ? (activeCensusData?.omani_2024 || 0) : (activeCensusData?.omani_2025 || 0), 
                      percent: (((localCompYear === '2024' ? (activeCensusData?.omani_2024 || 0) : (activeCensusData?.omani_2025 || 0)) / (activeCensusData?.[localCompYear] || 1)) * 100).toFixed(1),
                      color: 'bg-blue-600',
                    },
                    { 
                      label: 'المقيمون الوافدون', 
                      count: localCompYear === '2024' ? (activeCensusData?.expat_2024 || 0) : (activeCensusData?.expat_2025 || 0), 
                      percent: (((localCompYear === '2024' ? (activeCensusData?.expat_2024 || 0) : (activeCensusData?.expat_2025 || 0)) / (activeCensusData?.[localCompYear] || 1)) * 100).toFixed(1),
                      color: 'bg-red-600',
                    }
                  ] : [
                    { 
                      label: 'الذكور', 
                      count: localCompYear === '2024' ? (activeCensusData?.male_2024 || 0) : (activeCensusData?.male_2025 || 0), 
                      percent: (((localCompYear === '2024' ? (activeCensusData?.male_2024 || 0) : (activeCensusData?.male_2025 || 0)) / (activeCensusData?.[localCompYear] || 1)) * 100).toFixed(1),
                      color: 'bg-indigo-600',
                    },
                    { 
                      label: 'الاناث', 
                      count: localCompYear === '2024' ? (activeCensusData?.female_2024 || 0) : (activeCensusData?.female_2025 || 0), 
                      percent: (((localCompYear === '2024' ? (activeCensusData?.female_2024 || 0) : (activeCensusData?.female_2025 || 0)) / (activeCensusData?.[localCompYear] || 1)) * 100).toFixed(1),
                      color: 'bg-pink-600',
                    }
                  ];

                  return (
                    <div className="card-polish p-5 shadow-sm relative overflow-hidden">
                      <div className="flex flex-col md:flex-row justify-between items-center mb-4 border-b border-[var(--border-ui)] pb-2.5 gap-3">
                        <div className="flex flex-col gap-0.5">
                          <h3 className={`text-sm font-black text-[var(--brand-primary)] ${theme === 'royal' ? 'font-serif' : 'font-sans'}`}>مخطط الهيكل والتركيبة الديموغرافية</h3>
                          <p className="text-[9px] text-[var(--text-muted)] font-black">
                             البيانات المعروضة لعام {localCompYear} {selectedYear === 'compare' && " (مقارنة الأعوام نشط)"}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {selectedYear === 'compare' && (
                            <div className="flex p-0.5 bg-slate-100 rounded-lg">
                               <button 
                                 onClick={() => setLocalCompYear('2024')}
                                 className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all ${localCompYear === '2024' ? 'bg-white text-[var(--brand-primary)] shadow-sm' : 'text-slate-400'}`}
                               >
                                 2024
                               </button>
                               <button 
                                 onClick={() => setLocalCompYear('2025')}
                                 className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all ${localCompYear === '2025' ? 'bg-white text-[var(--brand-primary)] shadow-sm' : 'text-slate-400'}`}
                               >
                                 2025
                               </button>
                            </div>
                          )}
                          <div className="flex p-0.5 bg-slate-100 rounded-lg">
                             <button 
                               onClick={() => setCompositionView('nationality')}
                               className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${compositionView === 'nationality' ? 'bg-white text-[var(--brand-primary)] shadow-sm' : 'text-slate-400'}`}
                             >
                               الجنسية
                             </button>
                             <button 
                               onClick={() => setCompositionView('gender')}
                               className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${compositionView === 'gender' ? 'bg-white text-[var(--brand-primary)] shadow-sm' : 'text-slate-400'}`}
                             >
                               النوع الاجتماعي
                             </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-2">
                        <div className="w-full md:w-1/2 h-[220px] relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={compData}
                                innerRadius={65}
                                outerRadius={85}
                                paddingAngle={6}
                                dataKey="value"
                                nameKey="name"
                              >
                                {compData.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} className="cursor-pointer" />
                                ))}
                                <Label 
                                  position="center"
                                  content={(props: any) => {
                                    return (
                                      <text x={props.viewBox.cx} y={props.viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                        <tspan x={props.viewBox.cx} dy="-0.6em" fontSize="9" fill="var(--text-muted)" fontWeight="bold">إجمالي سكان الفئة</tspan>
                                        <tspan x={props.viewBox.cx} dy="1.4em" fontSize="16" fill="var(--brand-primary)" fontWeight="900" className="font-mono">{totalComp.toLocaleString()}</tspan>
                                      </text>
                                    );
                                  }}
                                />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="w-full md:w-1/2 space-y-2">
                           {compList.map((item, idx) => (
                             <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-[var(--border-ui)]">
                                <div className="flex items-center gap-2 mb-1">
                                   <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                                   <span className="text-xs font-black text-slate-800">{item.label}</span>
                                </div>
                                <div className="flex justify-between text-xs font-mono font-black text-slate-600">
                                  <span>{item.count.toLocaleString()} نسمة</span>
                                  <span className="text-[var(--brand-accent)]">{item.percent}%</span>
                                </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="w-full">
                <div className="card-polish p-5 shadow-sm">
                  <h3 className={`text-sm font-black text-[var(--brand-primary)] mb-3 ${theme === 'royal' ? 'font-serif' : 'font-sans'}`}>مقارنة التوزيع الديموغرافي في الولايات</h3>
                  <div className="flex gap-2 mb-4 justify-end">
                     <select 
                       value={compareWilayat1}
                       onChange={(e) => setCompareWilayat1(e.target.value)}
                       className="px-3 py-1 bg-slate-50 border border-[var(--border-ui)] rounded-lg text-xs font-black text-[var(--brand-primary)] outline-none"
                     >
                       {WILAYAT_NAMES.map(w => <option key={w} value={w}>{w}</option>)}
                     </select>
                     <select 
                       value={compareWilayat2}
                       onChange={(e) => setCompareWilayat2(e.target.value)}
                       className="px-3 py-1 bg-slate-50 border border-[var(--border-ui)] rounded-lg text-xs font-black text-[var(--brand-accent)] outline-none"
                     >
                       {WILAYAT_NAMES.map(w => <option key={w} value={w}>{w}</option>)}
                     </select>
                  </div>
                  <DemographicComparison wilayat1={compareWilayat1} wilayat2={compareWilayat2} data={DATA_2025} />
                </div>
              </div>

              {/* INTERACTIVE POPULATION PROJECTION SIMULATOR (Y2030) */}
              <div className="w-full animate-fade-in">
                <div className="card-polish p-6 shadow-sm overflow-hidden relative border border-[var(--border-ui)]/70">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[var(--brand-accent)] to-[var(--brand-primary)]"></div>
                  
                  {/* Title & Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-[var(--border-ui)]/60 gap-4">
                    <div className="space-y-0.5">
                      <h3 className={`text-base font-black text-[var(--brand-primary)] flex items-center gap-2 ${theme === 'royal' ? 'font-serif' : 'font-sans'}`}>
                        <TrendingUp size={18} className="text-[var(--brand-accent)] animate-pulse" />
                        محاكي تقدير النمو السكاني التفاعلي لعام 2030 (Slider)
                      </h3>
                      <p className="text-[11px] text-[var(--text-muted)] font-black">
                        اختر ولاية معينة وحدد معدل النمو السنوي لتقدير حجم السكان الإجمالي لعام 2030 بناءً على تعداد 2025 الحالي.
                      </p>
                    </div>

                    {/* Reset Button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSimulationWilayat('صلالة');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black border border-[var(--border-ui)] transition-colors"
                      >
                        إعادة تعيين ↺
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
                    {/* Controls & Metrics inside Left Column */}
                    <div className="lg:col-span-5 space-y-5">
                      
                      {/* Control Form */}
                      <div className="p-4 bg-slate-50 border border-[var(--border-ui)]/60 rounded-xl space-y-4">
                        
                        {/* Wilayat Selection */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-black text-slate-700 block">الولاية المستهدفة للمحاكاة:</label>
                          <select 
                            value={simulationWilayat}
                            onChange={(e) => setSimulationWilayat(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[var(--border-ui)] rounded-lg text-xs font-black text-[var(--brand-primary)] outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20"
                          >
                            <option value="all">جميع ولايات المحافظة (إجمالي)</option>
                            {WILAYAT_NAMES.map(w => (
                              <option key={w} value={w}>{w}</option>
                            ))}
                          </select>
                        </div>

                        {/* Interactive Growth Rate Slider */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="font-black text-slate-700">معدل النمو السنوي المفترض (%):</span>
                            <span className="font-extrabold text-[var(--brand-accent)] bg-[var(--brand-accent)]/10 px-2 py-0.5 rounded-full font-mono text-xs">
                              {simulatedGrowthRate > 0 ? `+${simulatedGrowthRate.toFixed(2)}` : simulatedGrowthRate.toFixed(2)}%
                            </span>
                          </div>

                          <input 
                            type="range"
                            min="-5"
                            max="10"
                            step="0.05"
                            value={simulatedGrowthRate}
                            onChange={(e) => setSimulatedGrowthRate(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-[var(--brand-primary)]"
                          />

                          <div className="flex justify-between items-center text-[9px] text-[var(--text-muted)] font-black">
                            <span>-5% (انكماش سريع)</span>
                            <span>0% (ثابت)</span>
                            <span>+10% (نمو متسارع)</span>
                          </div>
                        </div>

                        {/* Informative Text */}
                        <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg text-[9px] text-blue-800 font-extrabold flex gap-1.5 items-start">
                          <Info size={11} className="mt-0.5 shrink-0 animate-bounce" />
                          <span>
                            تم ضبط المؤشر تلقائياً ليعكس معدل النمو الملاحظ حالياً بين عامي 2024 و 2025. يمكنك سحب المؤشر لتجربة سيناريوهات بديلة للتخطيط والتنمية الحضرية.
                          </span>
                        </div>
                      </div>

                      {/* Display Outputs (2025 vs 2030 Projections) */}
                      {(() => {
                        const pop2025 = calculateDynamicTotal('2025', simulationWilayat, 'total', 'total');
                        const rate = simulatedGrowthRate / 100;
                        const projected2030 = Math.round(pop2025 * Math.pow(1 + rate, 5));
                        const netDiff = projected2030 - pop2025;
                        const totalPercentGrowth = pop2025 > 0 ? ((netDiff / pop2025) * 100).toFixed(1) : '0';

                        return (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white border border-[var(--border-ui)] rounded-xl shadow-sm text-right flex flex-col justify-between">
                              <span className="text-[10px] font-black text-[var(--text-muted)]">تعداد 2025 (الحالي)</span>
                              <div className="mt-1.5">
                                <span className="text-xl font-sans font-black text-slate-800 tracking-tight block">
                                  {pop2025.toLocaleString()}
                                </span>
                                <span className="text-[9px] font-black text-slate-400 block mt-0.5">نسمة</span>
                              </div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary)]/90 border border-transparent rounded-xl shadow-md text-right text-white flex flex-col justify-between">
                              <span className="text-[10px] font-black text-white/80">تقدير 2030 (المستقبلي)</span>
                              <div className="mt-1.5">
                                <span className="text-xl font-sans font-black text-white tracking-tight block">
                                  {projected2030.toLocaleString()}
                                </span>
                                <span className="text-[9px] font-black text-white/85 flex items-center justify-between gap-1 mt-0.5">
                                  <span>نسمة</span>
                                  <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-mono leading-none ${netDiff >= 0 ? 'bg-emerald-500/30 text-emerald-300' : 'bg-rose-500/30 text-rose-300'}`}>
                                    {netDiff >= 0 ? `+${parseFloat(totalPercentGrowth)}%` : `${parseFloat(totalPercentGrowth)}%`}
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div className="col-span-2 p-3 bg-slate-50 border border-[var(--border-ui)] rounded-xl flex justify-between items-center">
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-black text-[var(--text-muted)] block">الزيادة السكانية المتوقعة بحلول 2030</span>
                                <span className="text-xs font-black text-slate-700 font-sans block">
                                  {netDiff > 0 ? `+${netDiff.toLocaleString()}` : netDiff.toLocaleString()} نسمة
                                </span>
                              </div>
                              <div className={`p-2 rounded-lg ${netDiff >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                {netDiff >= 0 ? (
                                  <ArrowUpRight size={16} className="animate-bounce" />
                                ) : (
                                  <ArrowDownRight size={16} className="animate-bounce" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                    </div>

                    {/* Chart display inside Right Column */}
                    {(() => {
                      const pop2024 = calculateDynamicTotal('2024', simulationWilayat, 'total', 'total');
                      const pop2025 = calculateDynamicTotal('2025', simulationWilayat, 'total', 'total');
                      const rate = simulatedGrowthRate / 100;

                      const data = [
                        { name: '2024', population: pop2024, type: 'فعلي' },
                        { name: '2025', population: pop2025, type: 'فعلي' },
                        { name: '2026', population: Math.round(pop2025 * Math.pow(1 + rate, 1)), type: 'تقديري' },
                        { name: '2027', population: Math.round(pop2025 * Math.pow(1 + rate, 2)), type: 'تقديري' },
                        { name: '2028', population: Math.round(pop2025 * Math.pow(1 + rate, 3)), type: 'تقديري' },
                        { name: '2029', population: Math.round(pop2025 * Math.pow(1 + rate, 4)), type: 'تقديري' },
                        { name: '2030', population: Math.round(pop2025 * Math.pow(1 + rate, 5)), type: 'تقديري' },
                      ];

                      return (
                        <div className="lg:col-span-7 flex flex-col justify-between border border-[var(--border-ui)]/70 rounded-2xl p-4 bg-white shadow-inner min-h-[340px]">
                          <div>
                            <span className="font-extrabold text-xs text-[var(--brand-primary)] block">مسار النمو والتقدير السكاني المتسلسل (2024 - 2030)</span>
                            <span className="text-[10px] text-[var(--text-muted)] font-black block">يوضح الخط المتقطع تقديرات النمو المستقبلي من عام 2026</span>
                          </div>

                          <div className="h-[250px] mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={data} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
                                <defs>
                                  <linearGradient id="colorSimulationGlobal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--brand-accent)" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="var(--brand-accent)" stopOpacity={0.0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-ui)" />
                                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 'bold' }} stroke="var(--border-ui)" />
                                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} stroke="var(--border-ui)" />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-ui)', borderRadius: '12px', textAlign: 'right' }}
                                  formatter={(value, name, props) => {
                                    return [
                                      `${Number(value).toLocaleString()} نسمة`, 
                                      `تعداد ${props.payload.type}`
                                    ];
                                  }}
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="population" 
                                  stroke="var(--brand-accent)" 
                                  strokeWidth={2.5}
                                  fillOpacity={1} 
                                  fill="url(#colorSimulationGlobal)" 
                                  dot={{ r: 4, strokeWidth: 1.5, fill: 'white' }}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="flex justify-between items-center text-[9px] text-[var(--text-muted)] font-bold bg-slate-100 p-2 rounded-lg">
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-accent)] inline-block"></span>
                              التقدير لعام 2030: {data[6].population.toLocaleString()} نسمة
                            </span>
                            <span>الولاية: {simulationWilayat === 'all' ? 'جميع ولايات ظفار' : simulationWilayat}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* 3. WILAYATS CODE TAB */}
          {activeTab === 'wilayats' && (
            <motion.div
              key="wilayats"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="card-polish p-6 shadow-sm">
                {/* Header with Heatmap Selection controls */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 border-b border-[var(--border-ui)] pb-4 gap-4">
                  <div className="flex flex-col gap-0.5">
                    <h3 className={`text-base font-black text-[var(--brand-primary)] ${theme === 'royal' ? 'font-serif' : 'font-sans'}`}>
                      الكثافة والمؤشرات السكنية حسب الولايات ({selectedYear === 'compare' ? 'مقارنة' : selectedYear})
                    </h3>
                    <p className="text-[10px] text-[var(--text-muted)] font-black">
                       يعرض التعداد السكاني الدقيق المفلتر حسب: {selectedNatAge === 'total' ? 'جميع الجنسيات' : selectedNatAge === 'omani' ? 'مواطنين' : 'وافدين'} | {selectedGenderAge === 'total' ? 'جميع النوع الاجتماعي' : selectedGenderAge === 'female' ? 'إناث فقط' : 'ذكور فقط'}
                    </p>
                  </div>

                  {/* Heatmap interactive toggle buttons */}
                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-[var(--border-ui)] shadow-inner">
                    <span className="text-[10px] font-black text-[var(--text-muted)] px-2">مقياس الخريطة الحرارية:</span>
                    {[
                      { id: 'population', label: 'التعداد السكاني الكلي' },
                      { id: 'growth', label: 'معدل النمو السنوي (%)' }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setHeatmapMetric(btn.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                          heatmapMetric === btn.id 
                            ? 'bg-[var(--brand-primary)] text-white shadow-sm' 
                            : 'text-[var(--text-muted)] hover:text-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Traditional Recharts BarChart (Perfect for direct visual data analysis) */}
                  <div className="lg:col-span-5 border border-[var(--border-ui)]/60 rounded-2xl p-4 bg-white shadow-inner flex flex-col justify-between">
                    <div className="mb-2">
                      <h4 className="font-extrabold text-xs text-[var(--brand-primary)]">التسلسل السكاني الكلي للولايات</h4>
                      <p className="text-[9px] text-[var(--text-muted)] font-bold">يقارن التغيرات السكنية بشكل عمودي لسهولة التحليل</p>
                    </div>
                    
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={allWilayatsStats}
                          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-ui)" />
                          <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} stroke="var(--border-ui)" />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            orientation="right" 
                            tick={{ fill: 'var(--text-main)', fontSize: 10, fontWeight: 'black' }} 
                            stroke="var(--border-ui)"
                            width={75}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-ui)', borderRadius: '12px' }}
                            formatter={(value) => [value?.toLocaleString() ?? 0, 'نسمة']}
                          />
                          
                          {selectedYear === 'compare' ? (
                            <>
                              <Legend wrapperStyle={{ fontSize: 9, fontWeight: 'bold' }} />
                              <Bar dataKey="2024" name="تعداد 2024" fill="#94a3b8" radius={[0, 4, 4, 0]} maxBarSize={12} />
                              <Bar dataKey="2025" name="تعداد 2025" fill="var(--brand-accent)" radius={[0, 4, 4, 0]} maxBarSize={12} />
                            </>
                          ) : (
                            <Bar 
                              dataKey={selectedYear} 
                              name="التعداد الفصلي والسكاني" 
                              fill="var(--brand-primary)" 
                              radius={[0, 4, 4, 0]} 
                              maxBarSize={20}
                            >
                              {allWilayatsStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--brand-primary)' : 'var(--brand-accent)'} />
                              ))}
                            </Bar>
                          )}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right Column: High-Fidelity Demographic Density Heatmap Matrix */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 border border-[var(--border-ui)] rounded-xl p-3">
                      <div className="space-y-0.5">
                        <h4 className="font-extrabold text-xs text-[var(--brand-primary)] flex items-center gap-1.5">
                          <Activity size={12} className="text-[var(--brand-accent)] animate-pulse" />
                          مصفوفة التوزيع والكثافة الجغرافية السكانية للولايات
                        </h4>
                        <p className="text-[9px] text-[var(--text-muted)] font-black">
                          انقر على ولاية لتحديدها وتصفية لوحة البيانات والمؤشرات الطبية التابعة لها.
                        </p>
                      </div>
                      
                      {selectedWilayatAge !== 'all' && (
                        <button 
                          onClick={() => setSelectedWilayatAge('all')}
                          className="px-2 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-md font-black text-[9px] transition-colors"
                        >
                          إلغاء التصفية الجغرافية ✕
                        </button>
                      )}
                    </div>

                    {/* Heatmap Cell Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-3">
                      {(() => {
                        const getMetricValue = (entry: typeof allWilayatsStats[0], metric: 'population' | 'growth') => {
                          const year = selectedYear === 'compare' ? '2025' : selectedYear;
                          if (metric === 'population') {
                            return year === '2024' ? entry['2024'] : entry['2025'];
                          } else {
                            return entry.growth;
                          }
                        };

                        const values = allWilayatsStats.map(e => getMetricValue(e, heatmapMetric));
                        const maxVal = Math.max(...values, 1);
                        const minVal = Math.min(...values, 0);

                        return allWilayatsStats.map((entry) => {
                          const val = getMetricValue(entry, heatmapMetric);
                          
                          // Percentage/Intensity
                          const intensity = maxVal > minVal ? (val - minVal) / (maxVal - minVal) : 0.5;

                          // Color schemes and adaptations
                          let bgStyle = {};
                          const textColorClass = intensity > 0.45 ? 'text-white' : 'text-slate-900';
                          const textMutedClass = intensity > 0.45 ? 'text-white/85' : 'text-slate-500';
                          const badgeBgClass = intensity > 0.45 ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700';

                          if (heatmapMetric === 'population') {
                            bgStyle = { backgroundColor: `rgba(55, 48, 163, ${0.08 + intensity * 0.92})` };
                          } else {
                            bgStyle = { backgroundColor: `rgba(16, 185, 129, ${0.08 + intensity * 0.92})` };
                          }

                          const isSelected = selectedWilayatAge === entry.name;

                          return (
                            <motion.button
                              key={entry.name}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                if (selectedWilayatAge === entry.name) {
                                  setSelectedWilayatAge('all');
                                } else {
                                  setSelectedWilayatAge(entry.name);
                                }
                              }}
                              style={bgStyle}
                              className={`p-3 rounded-xl border flex flex-col justify-between items-start text-right min-h-[110px] duration-150 relative cursor-pointer group ${
                                isSelected 
                                  ? 'border-[var(--brand-primary)] ring-4 ring-[var(--brand-primary)]/20 shadow-md scale-[1.02] z-10' 
                                  : 'border-[var(--border-ui)] hover:shadow-sm'
                              }`}
                            >
                              <div className="w-full flex justify-between items-start">
                                <span className={`font-black text-xs block group-hover:underline ${textColorClass}`}>
                                  {entry.name}
                                </span>
                                {isSelected && (
                                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block animate-pulse"></span>
                                )}
                              </div>

                              <div className="space-y-0.5 mt-2">
                                <span className={`text-[12px] font-[900] block tracking-tight font-mono ${textColorClass}`}>
                                  {heatmapMetric === 'population' ? (
                                    <>
                                      {val.toLocaleString()} <span className="text-[8px] font-sans font-extrabold">نسمة</span>
                                    </>
                                  ) : (
                                    <>
                                      {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}%
                                    </>
                                  )}
                                </span>

                                <span className={`text-[8px] font-bold block ${textMutedClass}`}>
                                  {entry.area.toLocaleString()} كم²
                                </span>
                              </div>

                              <div className="w-full flex justify-end mt-2">
                                <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider ${badgeBgClass}`}>
                                  {entry.name === 'صلالة' ? 'تجمع رئيسي' : entry.area > 10000 ? 'شاسعة' : 'حضرية'}
                                </span>
                              </div>
                            </motion.button>
                          );
                        });
                      })()}
                    </div>

                    {/* Arabic RTL aligned Heatmap Legend */}
                    <div className="flex flex-col space-y-2 pt-3 border-t border-[var(--border-ui)]">
                      <div className="flex justify-between items-center text-[10px] font-black text-[var(--text-muted)]">
                        <span>مستوى منخفض (كثافة خفيفة)</span>
                        <span>مستوى متوازن</span>
                        <span>مستوى مرتفع جداً (تجمع مركزي)</span>
                      </div>
                      <div className="w-full h-2 rounded-full opacity-90 shadow-inner" style={{
                        background: heatmapMetric === 'population'
                          ? 'linear-gradient(to left, rgba(55, 48, 163, 0.05), rgba(55, 48, 163, 1))'
                          : 'linear-gradient(to left, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 1))'
                      }}></div>
                    </div>

                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* 4. COMPOSITION DEPLOYED TAB */}
          {activeTab === 'composition' && (
            <motion.div
              key="composition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card-polish p-6 shadow-sm border border-[var(--border-ui)]"
            >
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-[var(--border-ui)] pb-3 gap-3">
                <div className="flex flex-col gap-0.5">
                  <h3 className={`text-base font-black text-[var(--brand-primary)] ${theme === 'royal' ? 'font-serif' : 'font-sans'}`}>
                    التوزيع الجغرافي الجنسية (مواطنين عمانيين مقابل مقيمين وافدين)
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-black">
                     الفحص الحالي للنوع للمخطط: {selectedGenderAge === 'total' ? 'الكل' : selectedGenderAge === 'female' ? 'إناث فقط' : 'ذكور فقط'}
                  </p>
                </div>
              </div>

              <div className="h-[480px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={wilayatComparison}
                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-ui)" />
                    <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} stroke="var(--border-ui)" />
                    <YAxis dataKey="name" type="category" orientation="right" tick={{ fill: 'var(--text-main)', fontSize: 11, fontWeight: 'black' }} stroke="var(--border-ui)" width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-ui)', borderRadius: '12px' }}
                      formatter={(value) => [value?.toLocaleString() ?? 0, 'نسمة']} 
                    />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    {selectedYear === 'compare' ? (
                      <>
                        <Bar dataKey="omani_2024" name="مواطنون 2024" stackId="2024" fill="#3b82f6" fillOpacity={0.6} radius={[0, 3, 3, 0]} />
                        <Bar dataKey="expat_2024" name="وافدون 2024" stackId="2024" fill="#ef4444" fillOpacity={0.6} radius={[0, 3, 3, 0]} />
                        <Bar dataKey="omani_2025" name="مواطنون 2025" stackId="2025" fill="#3b82f6" radius={[0, 3, 3, 0]} />
                        <Bar dataKey="expat_2025" name="وافدون 2025" stackId="2025" fill="#ef4444" radius={[0, 3, 3, 0]} />
                      </>
                    ) : (
                      <>
                        <Bar dataKey={`omani_${selectedYear}`} name="مواطنون عمانيون" stackId="a" fill="#2563eb" radius={[0, 3, 3, 0]} />
                        <Bar dataKey={`expat_${selectedYear}`} name="وافدون مقيمون" stackId="a" fill="#dc2626" radius={[0, 3, 3, 0]} />
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* 5. GENDER CODE TAB */}
          {activeTab === 'gender' && (
            <motion.div
              key="gender"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card-polish p-6 shadow-sm border border-[var(--border-ui)]"
            >
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-[var(--border-ui)] pb-3 gap-3">
                <div className="flex flex-col gap-0.5">
                  <h3 className={`text-base font-black text-[var(--brand-primary)] ${theme === 'royal' ? 'font-serif' : 'font-sans'}`}>
                    التوزيع الجغرافي حسب النوع (الذكور مقابل الإناث)
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-black">
                     الفحص الحالي للجنسية للمخطط: {selectedNatAge === 'total' ? 'جميع السكان' : selectedNatAge === 'omani' ? 'عمانيون فقط' : 'وافدون فقط'}
                  </p>
                </div>
              </div>

              <div className="h-[480px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={wilayatComparison}
                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-ui)" />
                    <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} stroke="var(--border-ui)" />
                    <YAxis dataKey="name" type="category" orientation="right" tick={{ fill: 'var(--text-main)', fontSize: 11, fontWeight: 'black' }} stroke="var(--border-ui)" width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-ui)', borderRadius: '12px' }}
                      formatter={(value) => [value?.toLocaleString() ?? 0, 'نسمة']} 
                    />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    {selectedYear === 'compare' ? (
                      <>
                        <Bar dataKey="male_2024" name="ذكور 2024" stackId="2024" fill="#4f46e5" fillOpacity={0.6} radius={[0, 3, 3, 0]} />
                        <Bar dataKey="female_2024" name="إناث 2024" stackId="2024" fill="#db2777" fillOpacity={0.6} radius={[0, 3, 3, 0]} />
                        <Bar dataKey="male_2025" name="ذكور 2025" stackId="2025" fill="#4f46e5" radius={[0, 3, 3, 0]} />
                        <Bar dataKey="female_2025" name="إناث 2025" stackId="2025" fill="#db2777" radius={[0, 3, 3, 0]} />
                      </>
                    ) : (
                      <>
                        <Bar dataKey={`male_${selectedYear}`} name="الذكور" stackId="a" fill="#4f46e5" radius={[0, 3, 3, 0]} />
                        <Bar dataKey={`female_${selectedYear}`} name="الإناث" stackId="a" fill="#db2777" radius={[0, 3, 3, 0]} />
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* 6. AGE PYRAMID TAB */}
          {activeTab === 'age' && (
            <motion.div
              key="age"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="card-polish p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-[var(--border-ui)] pb-3 gap-3">
                  <div className="flex flex-col gap-0.5">
                    <h3 className={`text-base font-black text-[var(--brand-primary)] ${theme === 'royal' ? 'font-serif' : 'font-sans'}`}>
                      مخطط الهرم السكاني للفئات العمرية
                    </h3>
                    <p className="text-[10px] text-[var(--text-muted)] font-black">
                      {selectedWilayatAge === 'all' ? '' : `بيانات دقيقة مفصلة لولاية: ${selectedWilayatAge}`}
                      {highlightedAgeGroup && <span className="mr-2 text-[var(--brand-accent)]">| الفئة النشطة للمعاينة: {highlightedAgeGroup}</span>}
                    </p>
                  </div>
                  {highlightedAgeGroup && (
                    <button 
                      onClick={() => setHighlightedAgeGroup(null)}
                      className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                    >
                      إعادة تهيئة التحديد
                    </button>
                  )}
                </div>

                <div className="h-[420px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={ageGroupData}
                      margin={{ top: 15, right: 10, left: 10, bottom: 10 }}
                      onClick={(data) => {
                        if (data && data.activeLabel) {
                          setHighlightedAgeGroup(data.activeLabel);
                        }
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-ui)" />
                      <XAxis dataKey="range" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 'bold' }} stroke="var(--border-ui)" />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} stroke="var(--border-ui)" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-ui)', borderRadius: '12px' }}
                        formatter={(value) => [value?.toLocaleString() ?? 0, 'نسمة']} 
                      />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      
                      {selectedYear === 'compare' ? (
                        <>
                          <Bar 
                            dataKey="total_2024" 
                            name="إجمالي 2024" 
                            fill="#cbd5e1" 
                            fillOpacity={highlightedAgeGroup ? (d => d.range === highlightedAgeGroup ? 1 : 0.3) : 1}
                          />
                          <Bar 
                            dataKey="total_2025" 
                            name="إجمالي 2025" 
                            fill="var(--brand-accent)" 
                            fillOpacity={highlightedAgeGroup ? (d => d.range === highlightedAgeGroup ? 1 : 0.3) : 1}
                          />
                          <Line type="monotone" dataKey="total_2025" stroke="var(--brand-primary)" strokeWidth={3} dot={{ r: 4 }} name="مؤشر الانحناء للنمو لـ 2025" />
                        </>
                      ) : (
                        <>
                          <Bar 
                            dataKey="male" 
                            name="الذكور" 
                            stackId="a" 
                            fill="#3b82f6" 
                            fillOpacity={highlightedAgeGroup ? (d => d.range === highlightedAgeGroup ? 1 : 0.3) : 1}
                          />
                          <Bar 
                            dataKey="female" 
                            name="الإناث" 
                            stackId="a" 
                            fill="#db2777" 
                            fillOpacity={highlightedAgeGroup ? (d => d.range === highlightedAgeGroup ? 1 : 0.3) : 1}
                          />
                          <Line type="monotone" dataKey="total" stroke="var(--brand-primary)" strokeWidth={3} dot={{ r: 4 }} name="إجمالي توزيع الفئات العمرية" />
                        </>
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Conditional Micro Analysis of Highlighted Ranges */}
              <AnimatePresence>
                {highlightedAgeGroup && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {(() => {
                      const group = ageGroupData.find(d => d.range === highlightedAgeGroup);
                      if (!group) return null;
                      
                      // Safely fetch counts
                      const maleVal = group.male ?? 0;
                      const femaleVal = group.female ?? 0;
                      const totalVal = group.total ?? (maleVal + femaleVal);
                      
                      return (
                        <>
                          <div className="card-polish p-4 border-t-4 border-blue-600">
                             <div className="text-[10px] font-black text-[var(--text-muted)] uppercase mb-1">الذكور الفئة العمومية للدراسة ({highlightedAgeGroup})</div>
                             <div className="text-2xl font-black text-blue-900 font-mono">{maleVal.toLocaleString()}</div>
                             <div className="text-[9px] font-semibold text-blue-600 mt-1">المشاركة النسبية: {((maleVal / (totalVal || 1)) * 100).toFixed(1)}%</div>
                          </div>
                          <div className="card-polish p-4 border-t-4 border-pink-600">
                             <div className="text-[10px] font-black text-[var(--text-muted)] uppercase mb-1">الإناث الفئة العمومية للدراسة ({highlightedAgeGroup})</div>
                             <div className="text-2xl font-black text-pink-900 font-mono">{femaleVal.toLocaleString()}</div>
                             <div className="text-[9px] font-semibold text-pink-600 mt-1">المشاركة النسبية: {((femaleVal / (totalVal || 1)) * 100).toFixed(1)}%</div>
                          </div>
                          <div className="card-polish p-4 border-t-4 border-[var(--brand-accent)]">
                             <div className="text-[10px] font-black text-[var(--text-muted)] uppercase mb-1">إجمالي الفئة السكنية بالتعداد ({highlightedAgeGroup})</div>
                             <div className="text-2xl font-black text-[var(--brand-primary)] font-mono">{totalVal.toLocaleString()}</div>
                             <div className="text-[9px] font-semibold text-[var(--brand-accent)] mt-1">إحصاء دقيق مرن وموثوق</div>
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* 7. HEALTH PLANNING INDICATORS TAB */}
          {activeTab === 'health_planning' && (
            <motion.div
              key="health_planning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* SECTION 1: Health Target Groups */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Target Demographics Card */}
                <div className="card-polish p-6 shadow-sm border border-[var(--border-ui)] lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--border-ui)] pb-3">
                    <Users className="text-[var(--brand-accent)]" size={18} />
                    <h4 className="font-black text-sm text-[var(--brand-primary)]">
                      الفئات العمرية الصحية المستهدفة ({selectedWilayatAge === 'all' ? 'محافظة ظفار' : selectedWilayatAge})
                    </h4>
                  </div>
                  
                  {(() => {
                    const yearToUse = selectedYear === 'compare' ? '2025' : selectedYear;
                    const stats = healthPlanningData[yearToUse] || { infants: 0, schoolAge: 0, maternalFemales: 0, elderly: 0, total: 1, dependencyRatio: 0 };
                    
                    const infantPercent = ((stats.infants / stats.total) * 100).toFixed(1);
                    const schoolPercent = ((stats.schoolAge / stats.total) * 100).toFixed(1);
                    const maternalPercent = ((stats.maternalFemales / stats.total) * 100).toFixed(1);
                    const elderlyPercent = ((stats.elderly / stats.total) * 100).toFixed(1);

                    const prevYearStats = healthPlanningData['2024'] || stats;
                    const currYearStats = healthPlanningData['2025'] || stats;

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Infants */}
                        <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl hover:bg-amber-50 duration-200">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-black text-amber-800">الرضع والأطفال دون 5 سنوات</span>
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded-full">التحصينات والنمو</span>
                          </div>
                          <div className="text-xl font-[900] text-amber-955 font-mono">{stats.infants.toLocaleString()} نسمة</div>
                          <div className="text-[10px] font-black text-amber-700/80 mt-1 flex justify-between">
                            <span>النسبة من السكان: {infantPercent}%</span>
                            <span>النمو السنوي: {(((currYearStats.infants - prevYearStats.infants) / (prevYearStats.infants || 1)) * 100).toFixed(1)}%</span>
                          </div>
                        </div>

                        {/* Maternal Females */}
                        <div className="p-4 bg-pink-50/50 border border-pink-100 rounded-xl hover:bg-pink-50 duration-200">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-black text-pink-800">النساء في سن الإنجاب (15-49)</span>
                            <span className="text-[10px] font-bold text-pink-600 bg-pink-100/50 px-2 py-0.5 rounded-full">رعاية الأمومة والطفولة</span>
                          </div>
                          <div className="text-xl font-[900] text-pink-955 font-mono">{stats.maternalFemales.toLocaleString()} نسمة</div>
                          <div className="text-[10px] font-black text-pink-700/80 mt-1 flex justify-between">
                            <span>النسبة من السكان: {maternalPercent}%</span>
                            <span>النمو السنوي: {(((currYearStats.maternalFemales - prevYearStats.maternalFemales) / (prevYearStats.maternalFemales || 1)) * 100).toFixed(1)}%</span>
                          </div>
                        </div>

                        {/* School age */}
                        <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-xl hover:bg-sky-50 duration-200">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-black text-sky-800">اليافعين وطلاب المدارس (5-14)</span>
                            <span className="text-[10px] font-bold text-sky-600 bg-sky-100/50 px-2 py-0.5 rounded-full">الصحة المدرسية والوقائية</span>
                          </div>
                          <div className="text-xl font-[900] text-sky-955 font-mono">{stats.schoolAge.toLocaleString()} نسمة</div>
                          <div className="text-[10px] font-black text-sky-700/80 mt-1 flex justify-between">
                            <span>النسبة من السكان: {schoolPercent}%</span>
                            <span>النمو السنوي: {(((currYearStats.schoolAge - prevYearStats.schoolAge) / (prevYearStats.schoolAge || 1)) * 100).toFixed(1)}%</span>
                          </div>
                        </div>

                        {/* Elderly */}
                        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl hover:bg-emerald-50 duration-200">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-black text-emerald-800">كبار السن والمسنين (60+ سنة)</span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-full">الأمراض المزمنة والرعاية المنزلية</span>
                          </div>
                          <div className="text-xl font-[900] text-emerald-955 font-mono">{stats.elderly.toLocaleString()} نسمة</div>
                          <div className="text-[10px] font-black text-emerald-700/80 mt-1 flex justify-between">
                            <span>النسبة من السكان: {elderlyPercent}%</span>
                            <span>النمو السنوي: {(((currYearStats.elderly - prevYearStats.elderly) / (prevYearStats.elderly || 1)) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 2. Primary Healthcare consultations card */}
                <div className="card-polish p-6 shadow-sm border border-[var(--border-ui)] space-y-4">
                  <div className="flex items-center gap-2 border-b border-[var(--border-ui)] pb-3">
                    <Activity className="text-[var(--brand-accent)]" size={18} />
                    <h4 className="font-black text-sm text-[var(--brand-primary)]">
                      الضغط التشغيلي والزيارات الطبية المتوقعة
                    </h4>
                  </div>
                  
                  {(() => {
                    const yearToUse = selectedYear === 'compare' ? '2025' : selectedYear;
                    const stats = healthPlanningData[yearToUse] || { expectedConsultations: 0, infants: 0, elderly: 0, maternalFemales: 0, dependencyRatio: 0 };
                    
                    return (
                      <div className="space-y-4">
                        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl font-sans">
                          <p className="text-[10px] font-black text-indigo-700 leading-none mb-1">الزيارات السنوية المقدرة للرعاية الأولية</p>
                          <div className="text-2xl font-black text-indigo-950 font-mono">
                            {stats.expectedConsultations.toLocaleString()} <span className="text-xs font-bold font-sans">زيارة/سنة</span>
                          </div>
                          <p className="text-[9px] text-[var(--text-muted)] font-bold mt-1.5 leading-normal">
                            * تقديرات مبنية على معدلات الاستشارة السنوية المرجعية لوزارة الصحة العمانية لكل فئة ديموغرافية نشطة.
                          </p>
                        </div>
                        
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between items-center text-xs font-semibold">
                            <span className="text-[var(--text-muted)]">معدل الإعالة العمرية العامة:</span>
                            <span className="font-black text-[var(--brand-primary)] font-mono">{stats.dependencyRatio}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[var(--brand-primary)] h-full rounded-full" style={{ width: `${Math.min(stats.dependencyRatio, 100)}%` }}></div>
                          </div>
                          <p className="text-[9px] text-[var(--text-muted)] leading-tight">
                            كل 100 فرد في سن العمل يدعمون حوالي {stats.dependencyRatio} طفلاً ومسناً في المنظومة الصحية لولاية {selectedWilayatAge === 'all' ? 'ظفار' : selectedWilayatAge}.
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* SECTION 2: Demographic Sustainability Index */}
              {(() => {
                const yearToUse = selectedYear === 'compare' ? '2025' : selectedYear;
                const stats = healthPlanningData[yearToUse] || { 
                  total: 1, 
                  infants: 0, 
                  schoolAge: 0, 
                  maternalFemales: 0, 
                  elderly: 0, 
                  childrenTotal: 0, 
                  workingAge: 0, 
                  dependencyRatio: 0 
                };

                const childrenVal = stats.childrenTotal;
                const elderlyVal = stats.elderly;
                const dependentsTotal = childrenVal + elderlyVal;
                const workingAgeVal = stats.workingAge;
                
                // Demographic Sustainability Index = Working Age / Dependents
                const dsi = dependentsTotal > 0 ? (workingAgeVal / dependentsTotal) : 0;
                
                // Percentages
                const totalVal = stats.total || 1;
                const workingAgePercent = ((workingAgeVal / totalVal) * 100).toFixed(1);
                const childrenPercent = ((childrenVal / totalVal) * 100).toFixed(1);
                const elderlyPercent = ((elderlyVal / totalVal) * 100).toFixed(1);

                // Classification and Recommendations
                let statusLabel = "";
                let statusColorClass = "";
                let statusBgClass = "";
                let statusBorderClass = "";
                let recommendations: string[] = [];

                if (dsi >= 2.0) {
                  statusLabel = "استدامة ديموغرافية قوية وممتازة";
                  statusColorClass = "text-emerald-700";
                  statusBgClass = "bg-emerald-50/70";
                  statusBorderClass = "border-emerald-200";
                  recommendations = [
                    "توجيه الاستثمارات الصحية نحو تطوير الخدمات التخصصية المتقدمة وجراحات اليوم الواحد نظراً لوفرة الطاقة الإنتاجية السكانية.",
                    "التركيز على تعزيز الخدمات الوقائية والصحة المهنية لضمان استدامة لياقة القوة العاملة وتقليل الإجازات المرضية الطويلة.",
                    "استغلال النافذة الديموغرافية الإيجابية لبناء الشراكات بين القطاعين الصحي الخاص والحكومي لتمويل وتوطين المشاريع الطبية الكبرى."
                  ];
                } else if (dsi >= 1.5) {
                  statusLabel = "استدامة متوازنة ومستقرة ديموغرافياً";
                  statusColorClass = "text-amber-700";
                  statusBgClass = "bg-amber-50/70";
                  statusBorderClass = "border-amber-200";
                  recommendations = [
                    "الحفاظ على وتيرة متوازنة لتوزيع الموارد عبر الاستمرار في دعم الرعاية الصحية الأولية بالتوازي مع التوسع الطفيف في العيادات التخصصية.",
                    "توسيع برامج الكشف المبكر والوقاية عن الأمراض غير المعدية لتخفيف وتأخير العبء السريري لكبار السن داخل المجتمع.",
                    "مراقبة الهجرة السكانية الداخلية والاستقرار الجغرافي لديمومة توفر الملاكات الطبية والسريرية بالنسبة للمحيط الخدمي."
                  ];
                } else {
                  statusLabel = "ضغط إعالة مرتفع (يتطلب الاستجابة السريرية القصوى)";
                  statusColorClass = "text-rose-700";
                  statusBgClass = "bg-rose-50/70";
                  statusBorderClass = "border-rose-200";
                  recommendations = [
                    "ضرورة التوسع الفوري في تأسيس عيادات الأمومة والطفولة وطب الأطفال نظرًا لزيادة كثافة الفئة العمرية الفتية في المجتمع.",
                    "تأهيل وتوسيع برامج الرعاية الطبية المنزلية المخصصة للمسنين لتقليل فترات إشغال الأسرة بالمستشفيات العامة للمقاعد طويلة الأجل.",
                    "إعطاء الأولوية للحملات الوطنية الشاملة للتطعيمات والتحصينات لتقليص وطأة الضغوط الموسمية على أقسام الطوارئ الصحية."
                  ];
                }

                return (
                  <div className="card-polish p-6 shadow-sm border border-[var(--border-ui)] space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-ui)] pb-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="text-[var(--brand-accent)]" size={20} />
                          <h4 className="font-black text-sm text-[var(--brand-primary)]">
                            مؤشر الاستدامة الديموغرافية والتخطيط الصحي
                          </h4>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] font-bold">
                          أداة تخطيطية استراتيجية تقيس مدى قدرة الفئة المنتجة في سن العمل على دعم وإعالة الفئات الهشة صحياً (الأطفال دون 15 سنة وكبار السن 60+).
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-black border ${statusBgClass} ${statusColorClass} ${statusBorderClass} self-start md:self-auto`}>
                        {statusLabel}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Column 1: KPI Visual Display */}
                      <div className="p-5 bg-gradient-to-br from-slate-50 to-indigo-50/20 border border-[var(--border-ui)] rounded-2xl flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Demographic Sustainability Index</span>
                          <div className="flex items-baseline gap-2 pt-1">
                            <span className="text-4xl font-[900] text-[var(--brand-primary)] font-mono">{dsi.toFixed(2)}</span>
                            <span className="text-xs font-bold text-[var(--text-muted)]">مؤشر الاستقرار</span>
                          </div>
                          <span className="text-xs font-black text-[var(--brand-accent)] block pt-1">
                            {dsi.toFixed(2)} فرد منتج لكل فرد معال (أطفال ومسنون)
                          </span>
                        </div>

                        {/* Circular styled visual gauge or horizontal indicator */}
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between text-[10px] font-black text-slate-600">
                            <span>ضغط مرتفع (&lt; 1.5)</span>
                            <span>متزن (1.5 - 2.0)</span>
                            <span>مستدام (&gt; 2.0)</span>
                          </div>
                          <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                            {/* Visual markers */}
                            <div className="absolute left-1/3 w-[1.5px] h-full bg-white z-10"></div>
                            <div className="absolute left-2/3 w-[1.5px] h-full bg-white z-10"></div>
                            {/* Active pointer bar */}
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                dsi < 1.5 ? 'bg-rose-500' : dsi < 2.0 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min((dsi / 3.0) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed font-bold">
                            كلما ارتفع هذا المؤشر عن حاجز الـ (2.0)، كلما دل ذلك على وجود مجتمع حيوي ذو قدرة جيدة على تمويل وتلقي التوسعات في البرامج والمشاريع الطبية المبتكرة.
                          </p>
                        </div>
                      </div>

                      {/* Column 2: Comparative Breakdown Visual Progress bars */}
                      <div className="p-5 bg-white border border-[var(--border-ui)] rounded-2xl space-y-5 flex flex-col justify-center">
                        <h5 className="font-extrabold text-xs text-[var(--brand-primary)] border-b border-[var(--border-ui)] pb-2">
                          توزيع وحظوظ المكون الاجتماعي العام
                        </h5>

                        <div className="space-y-4 border-b border-[var(--border-ui)]/50 pb-2">
                          {/* Working Age */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-extrabold text-slate-800">سن العمل والإنتاج (15-59 سنة)</span>
                              <span className="font-black text-indigo-700 font-mono">{workingAgePercent}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${workingAgePercent}%` }}></div>
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                              <span>العدد الفعلي:</span>
                              <span className="font-mono">{workingAgeVal.toLocaleString()} نسمة</span>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-extrabold text-slate-800">الأطفال والفئات الناشئة (أقل من 15 سنة)</span>
                              <span className="font-black text-amber-600 font-mono">{childrenPercent}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${childrenPercent}%` }}></div>
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                              <span>العدد الفعلي:</span>
                              <span className="font-mono">{childrenVal.toLocaleString()} نسمة</span>
                            </div>
                          </div>

                          {/* Elderly */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-extrabold text-slate-800">كبار السن والمسنين (60+ سنة)</span>
                              <span className="font-black text-rose-600 font-mono">{elderlyPercent}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${elderlyPercent}%` }}></div>
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                              <span>العدد الفعلي:</span>
                              <span className="font-mono">{elderlyVal.toLocaleString()} نسمة</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Column 3: Custom Strategic Advice list */}
                      <div className="p-5 bg-slate-50/50 border border-[var(--border-ui)] rounded-2xl space-y-4">
                        <div className="flex items-center gap-1.5 text-[var(--brand-primary)] border-b border-[var(--border-ui)] pb-2">
                          <UserCheck size={16} />
                          <h5 className="font-extrabold text-xs">التوصيات الصحية والخططية المقترحة</h5>
                        </div>
                        <ul className="space-y-2.5">
                          {recommendations.map((recommendation, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="w-5 h-5 shrink-0 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center text-[10px] font-black font-mono">
                                {i + 1}
                              </span>
                              <p className="text-xs text-slate-700 leading-normal font-bold">
                                {recommendation}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>
                );
              })()}

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 pt-6 border-t border-[var(--border-ui)] flex flex-col md:flex-row justify-between items-center gap-6 opacity-85">
        <div className="flex items-center gap-3">
          <LubanTreeIcon />
          <div className="text-right">
            <p className="font-extrabold text-[var(--brand-primary)] text-xs">المديرية العامة للخدمات الصحية بمحافظة ظفار</p>
            <p className="text-[9px] text-[var(--text-muted)] font-black">Health Planning and Organization - Dhofar Directorate General of Health Services</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
