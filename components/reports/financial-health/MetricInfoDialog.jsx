'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function MetricInfoDialog({ metric, open, onOpenChange }) {
  if (!metric) return null;

  const metricInfo = {
    'Savings Rate': {
      description: 'Savings Rate shows the percentage of your total income that you successfully save (not spent on expenses).',
      formula: 'Savings Rate = ((Total Income - Total Expense) / Total Income) × 100%',
      example: 'If income is Rp 10,000,000 and expense is Rp 7,000,000:\nSavings Rate = ((10,000,000 - 7,000,000) / 10,000,000) × 100% = 30%',
      ideal: [
        '≥ 30% = Excellent! 🎉 (You save more than 30% of your income)',
        '20-29% = Great! 👍 (You save 20-29% of your income)',
        '10-19% = Good 👌 (You save 10-19% of your income)',
        '1-9% = Keep it up 💪 (You\'re starting to save)',
        '0% = Consider saving 🤔 (Try to start saving)',
      ],
      tips: [
        'Ideal target is at least 20% of total income',
        'Higher savings rate means faster achievement of financial goals',
        'Consider the 50/30/20 method: 50% needs, 30% wants, 20% savings',
      ],
    },
    'Expense-Income Ratio': {
      description: 'Expense-Income Ratio shows how much percentage of your expenses compared to your income.',
      formula: 'Expense-Income Ratio = (Total Expense / Total Income) × 100%',
      example: 'If income is Rp 10,000,000 and expense is Rp 8,000,000:\nExpense-Income Ratio = (8,000,000 / 10,000,000) × 100% = 80%',
      ideal: [
        '≤ 80% = Healthy ratio ✅ (Expenses are within reasonable limits)',
        '81-100% = Close to limit 👀 (Expenses approaching limit, needs attention)',
        '> 100% = Spending more than earning ⚠️ (Expenses exceed income, DANGER!)',
      ],
      tips: [
        'Ideal target is maximum 80% of total income',
        'If ratio > 100%, it means you\'re using savings or debt',
        'Review expense categories to find areas that can be reduced',
        'Consider increasing income or reducing expenses',
      ],
    },
    'Daily Average Spending': {
      description: 'Daily Average Spending shows your average daily expenses over a certain period.',
      formula: 'Daily Average = Total Expense / Number of Days in Period',
      example: 'If total expense is Rp 9,000,000 over 30 days:\nDaily Average = 9,000,000 / 30 = Rp 300,000 per day',
      ideal: [
        'No fixed ideal value as it depends on income and lifestyle',
        'Use this metric to monitor daily spending consistency',
        'Compare with previous periods to see trends',
      ],
      tips: [
        'Know your daily average to create daily budgets',
        'If daily average is high, identify days with large expenses',
        'Use for short-term cash flow planning',
        'Monitor whether daily average increases or decreases over time',
      ],
    },
    'Spending Stability': {
      description: 'Spending Stability shows how consistent your spending patterns are. High value = stable spending, low value = highly variable spending.',
      formula: 'Spending Stability = 100% - (Standard Deviation of Daily Spending / Average Daily Spending) × 100%',
      example: 'If daily spending is consistent around Rp 300,000 with small variations:\nSpending Stability = high (≥ 70%)\n\nIf spending varies drastically (sometimes Rp 100,000, sometimes Rp 1,000,000):\nSpending Stability = low (< 40%)',
      ideal: [
        '≥ 70% = Very consistent ✨ (Spending is very stable and predictable)',
        '40-69% = Moderately stable 📊 (Spending is fairly stable with some variations)',
        '< 40% = Highly variable 📈 (Spending is highly variable, hard to predict)',
      ],
      tips: [
        'Stable spending makes budget planning easier',
        'Low stability may indicate impulse buying habits',
        'Consider creating a monthly budget to increase stability',
        'High stability isn\'t always good if spending is already too high',
      ],
    },
  };

  const info = metricInfo[metric.title];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            📊 {metric.title}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {info?.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Value */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-700 font-medium mb-1">Your Current Value:</p>
            <p className={`text-2xl font-bold ${metric.colorClass}`}>
              {metric.isCurrency 
                ? metric.value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                : `${metric.value}${metric.suffix || ''}`
              }
            </p>
            <p className="text-sm text-blue-600 mt-1">{metric.description}</p>
          </div>

          {/* Formula */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              🧮 How It's Calculated:
            </h4>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm font-mono text-gray-800">{info?.formula}</p>
            </div>
          </div>

          {/* Example */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              💡 Example:
            </h4>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-line">{info?.example}</p>
            </div>
          </div>

          {/* Ideal Conditions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              🎯 Ideal Conditions:
            </h4>
            <ul className="space-y-2">
              {info?.ideal.map((condition, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700 p-2 rounded-lg bg-gray-50">
                  <span className="text-blue-600">•</span>
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              💭 Tips & Recommendations:
            </h4>
            <ul className="space-y-2">
              {info?.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700 p-2 rounded-lg bg-green-50">
                  <span className="text-green-600">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
