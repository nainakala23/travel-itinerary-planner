import React from 'react';
import { DollarSign, Home, Utensils, Compass, Bus, Users, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function BudgetTracker({ costBreakdown, budgetLimit, travelerType, groupSize }) {
  if (!costBreakdown) return null;

  const peopleCount = groupSize && groupSize > 0 ? groupSize : (travelerType === 'couple' ? 2 : 1);
  const total = costBreakdown.total || 0;
  const perPerson = Math.round(total / peopleCount);

  const categories = [
    {
      name: 'Lodging & Stays',
      amount: costBreakdown.accommodations || 0,
      icon: Home,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50 text-indigo-700'
    },
    {
      name: 'Dining & Food',
      amount: costBreakdown.dining || 0,
      icon: Utensils,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50 text-emerald-700'
    },
    {
      name: 'Activities & Entry',
      amount: costBreakdown.activities || 0,
      icon: Compass,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 text-blue-700'
    },
    {
      name: 'Local Transit',
      amount: costBreakdown.local_transit || 0,
      icon: Bus,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50 text-amber-700'
    }
  ];

  const hasBudgetLimit = budgetLimit && budgetLimit > 0;
  const budgetRatio = hasBudgetLimit ? (total / budgetLimit) * 100 : 0;
  const isOverBudget = hasBudgetLimit && total > budgetLimit;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>Estimated Trip Budget & Cost Breakdown</span>
          </h3>
          <p className="text-xs text-slate-500">
            Real-time automated estimation across lodging, dining, activities, and transit.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Est. Total Trip Cost</span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ${total.toLocaleString()}
            </span>
          </div>
          {peopleCount > 1 && (
            <div className="pl-4 border-l border-slate-200 text-right">
              <span className="text-xs text-slate-400 block font-medium flex items-center justify-end gap-1">
                <Users className="w-3 h-3 text-slate-400" /> Per Person ({peopleCount})
              </span>
              <span className="text-lg font-bold text-slate-700">
                ${perPerson.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Target Budget Progress (if configured) */}
      {hasBudgetLimit && (
        <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
          <div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700">
              {isOverBudget ? (
                <AlertCircle className="w-4 h-4 text-rose-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
              Target Budget: ${budgetLimit.toLocaleString()}
            </span>
            <span className={isOverBudget ? 'text-rose-600' : 'text-emerald-600'}>
              {Math.round(budgetRatio)}% utilized ({isOverBudget ? `+$${(total - budgetLimit).toLocaleString()} over limit` : `$${(budgetLimit - total).toLocaleString()} remaining`})
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, budgetRatio)}%` }}
            />
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {categories.map((cat, idx) => {
          const CatIcon = cat.icon;
          const percentage = total > 0 ? Math.round((cat.amount / total) * 100) : 0;
          return (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg ${cat.bgColor} flex items-center justify-center`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-400">{percentage}%</span>
              </div>
              <div className="text-xs font-medium text-slate-500">{cat.name}</div>
              <div className="text-base font-bold text-slate-800 mt-0.5">
                ${cat.amount.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

