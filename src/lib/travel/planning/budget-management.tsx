/**
 * Budget Management Component
 * 
 * Provides comprehensive budget tracking and expense management for Atlas travel agent.
 * Implements budget planning, expense tracking, and financial insights.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Budget Management Variants
const budgetManagementVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'budget-management-mode-standard',
        'enhanced': 'budget-management-mode-enhanced',
        'advanced': 'budget-management-mode-advanced',
        'custom': 'budget-management-mode-custom'
      },
      type: {
        'personal': 'budget-type-personal',
        'group': 'budget-type-group',
        'business': 'budget-type-business',
        'mixed': 'budget-type-mixed'
      },
      style: {
        'minimal': 'budget-style-minimal',
        'moderate': 'budget-style-moderate',
        'detailed': 'budget-style-detailed',
        'custom': 'budget-style-custom'
      },
      format: {
        'text': 'budget-format-text',
        'visual': 'budget-format-visual',
        'interactive': 'budget-format-interactive',
        'mixed': 'budget-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'mixed',
      style: 'moderate',
      format: 'mixed'
    }
  }
);

// Budget Management Props
interface BudgetManagementProps extends VariantProps<typeof budgetManagementVariants> {
  className?: string;
  onBudgetUpdate?: (budget: BudgetData) => void;
  initialBudget?: Partial<BudgetData>;
  showCharts?: boolean;
  showAlerts?: boolean;
  showReports?: boolean;
  showSplitting?: boolean;
}

// Budget Data Interface
interface BudgetData {
  id: string;
  tripId: string;
  tripName: string;
  currency: string;
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
  categories: BudgetCategory[];
  expenses: Expense[];
  alerts: BudgetAlert[];
  reports: BudgetReport[];
  settings: BudgetSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Budget Category Interface
interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  plannedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
  isEssential: boolean;
  subcategories: BudgetSubcategory[];
}

// Budget Subcategory Interface
interface BudgetSubcategory {
  id: string;
  name: string;
  plannedAmount: number;
  spentAmount: number;
  remainingAmount: number;
}

// Expense Interface
interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  subcategory: string;
  date: Date;
  location: string;
  paymentMethod: 'cash' | 'card' | 'mobile' | 'other';
  receipt?: Receipt;
  tags: string[];
  isReimbursable: boolean;
  splitBetween: string[];
  createdAt: Date;
}

// Receipt Interface
interface Receipt {
  id: string;
  url: string;
  thumbnail: string;
  merchant: string;
  date: Date;
  total: number;
  currency: string;
  items: ReceiptItem[];
}

// Receipt Item Interface
interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

// Budget Alert Interface
interface BudgetAlert {
  id: string;
  type: 'over-budget' | 'approaching-limit' | 'unusual-spending' | 'savings-opportunity';
  category: string;
  title: string;
  message: string;
  amount: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: Date;
}

// Budget Report Interface
interface BudgetReport {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'trip-summary';
  period: {
    start: Date;
    end: Date;
  };
  data: ReportData;
  insights: string[];
  recommendations: string[];
  createdAt: Date;
}

// Report Data Interface
interface ReportData {
  totalSpent: number;
  totalBudget: number;
  categoryBreakdown: {
    category: string;
    spent: number;
    budget: number;
    percentage: number;
  }[];
  dailySpending: {
    date: Date;
    amount: number;
  }[];
  topExpenses: Expense[];
  trends: {
    category: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    change: number;
  }[];
}

// Budget Settings Interface
interface BudgetSettings {
  alertsEnabled: boolean;
  alertThresholds: {
    overBudget: number; // percentage
    approachingLimit: number; // percentage
    unusualSpending: number; // amount
  };
  autoCategorization: boolean;
  receiptScanning: boolean;
  currencyConversion: boolean;
  defaultCurrency: string;
}

// Budget Management Component
export const BudgetManagement = React.forwardRef<HTMLDivElement, BudgetManagementProps>(
  ({ 
    className, 
    onBudgetUpdate,
    initialBudget,
    showCharts = true,
    showAlerts = true,
    showReports = true,
    showSplitting = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [budget, setBudget] = useState<BudgetData>(
      initialBudget || {
        id: '',
        tripId: '',
        tripName: '',
        currency: 'USD',
        totalBudget: 0,
        spentAmount: 0,
        remainingAmount: 0,
        categories: [],
        expenses: [],
        alerts: [],
        reports: [],
        settings: {
          alertsEnabled: true,
          alertThresholds: {
            overBudget: 90,
            approachingLimit: 80,
            unusualSpending: 500
          },
          autoCategorization: true,
          receiptScanning: true,
          currencyConversion: true,
          defaultCurrency: 'USD'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [newExpense, setNewExpense] = useState<Partial<Expense>>({});

    const tabs = [
      { id: 'overview', name: 'Overview', icon: '📊' },
      { id: 'expenses', name: 'Expenses', icon: '💳' },
      { id: 'categories', name: 'Categories', icon: '📁' },
      { id: 'alerts', name: 'Alerts', icon: '⚠️' },
      { id: 'reports', name: 'Reports', icon: '📈' }
    ];

    const defaultCategories = [
      { id: 'accommodation', name: 'Accommodation', icon: '🏨', color: 'blue', isEssential: true },
      { id: 'transportation', name: 'Transportation', icon: '🚗', color: 'green', isEssential: true },
      { id: 'food', name: 'Food & Dining', icon: '🍽️', color: 'orange', isEssential: true },
      { id: 'activities', name: 'Activities', icon: '🎯', color: 'purple', isEssential: false },
      { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'pink', isEssential: false },
      { id: 'souvenirs', name: 'Souvenirs', icon: '🎁', color: 'yellow', isEssential: false },
      { id: 'emergency', name: 'Emergency', icon: '🚨', color: 'red', isEssential: true },
      { id: 'miscellaneous', name: 'Miscellaneous', icon: '📦', color: 'gray', isEssential: false }
    ];

    const paymentMethods = [
      { id: 'cash', name: 'Cash', icon: '💵' },
      { id: 'card', name: 'Card', icon: '💳' },
      { id: 'mobile', name: 'Mobile', icon: '📱' },
      { id: 'other', name: 'Other', icon: '🔧' }
    ];

    const updateBudget = useCallback((path: string, value: any) => {
      setBudget(prev => {
        const newBudget = { ...prev };
        const keys = path.split('.');
        let current: any = newBudget;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newBudget.updatedAt = new Date();
        onBudgetUpdate?.(newBudget);
        return newBudget;
      });
    }, [onBudgetUpdate]);

    const addExpense = useCallback(() => {
      if (!newExpense.title || !newExpense.amount) return;
      
      const expense: Expense = {
        id: `expense-${Date.now()}`,
        title: newExpense.title || '',
        description: newExpense.description || '',
        amount: newExpense.amount || 0,
        currency: budget.currency,
        category: newExpense.category || 'miscellaneous',
        subcategory: newExpense.subcategory || '',
        date: newExpense.date || new Date(),
        location: newExpense.location || '',
        paymentMethod: newExpense.paymentMethod || 'card',
        tags: newExpense.tags || [],
        isReimbursable: newExpense.isReimbursable || false,
        splitBetween: newExpense.splitBetween || [],
        createdAt: new Date()
      };
      
      updateBudget('expenses', [...budget.expenses, expense]);
      
      // Update category spent amount
      const updatedCategories = budget.categories.map(cat => 
        cat.id === expense.category 
          ? { ...cat, spentAmount: cat.spentAmount + expense.amount }
          : cat
      );
      updateBudget('categories', updatedCategories);
      
      // Update total spent amount
      updateBudget('spentAmount', budget.spentAmount + expense.amount);
      updateBudget('remainingAmount', budget.totalBudget - (budget.spentAmount + expense.amount));
      
      setNewExpense({});
    }, [budget, updateBudget]);

    const initializeCategories = useCallback(() => {
      const categories: BudgetCategory[] = defaultCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        plannedAmount: 0,
        spentAmount: 0,
        remainingAmount: 0,
        percentage: 0,
        isEssential: cat.isEssential,
        subcategories: []
      }));
      updateBudget('categories', categories);
    }, [updateBudget]);

    const formatCurrency = (amount: number, currency: string) => {
      return `${currency} ${amount.toFixed(2)}`;
    };

    const getCategoryIcon = (categoryId: string) => {
      const category = budget.categories.find(c => c.id === categoryId);
      return category?.icon || '📦';
    };

    const getCategoryColor = (categoryId: string) => {
      const category = budget.categories.find(c => c.id === categoryId);
      return category?.color || 'gray';
    };

    const getPaymentMethodIcon = (method: Expense['paymentMethod']) => {
      const paymentMethod = paymentMethods.find(p => p.id === method);
      return paymentMethod?.icon || '💳';
    };

    const getAlertColor = (type: BudgetAlert['type']) => {
      switch (type) {
        case 'over-budget': return 'text-red-600 dark:text-red-400';
        case 'approaching-limit': return 'text-orange-600 dark:text-orange-400';
        case 'unusual-spending': return 'text-yellow-600 dark:text-yellow-400';
        case 'savings-opportunity': return 'text-green-600 dark:text-green-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getAlertIcon = (type: BudgetAlert['type']) => {
      switch (type) {
        case 'over-budget': return '🔴';
        case 'approaching-limit': return '🟡';
        case 'unusual-spending': return '⚠️';
        case 'savings-opportunity': return '💡';
        default: return 'ℹ️';
      }
    };

    const calculateCategoryPercentage = (spent: number, planned: number) => {
      if (planned === 0) return 0;
      return Math.min((spent / planned) * 100, 100);
    };

    useEffect(() => {
      if (budget.categories.length === 0) {
        initializeCategories();
      }
    }, [budget.categories.length, initializeCategories]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          budgetManagementVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Budget Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage your {budget.tripName || 'trip'} expenses
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              📊 Export
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              💳 Add Expense
            </button>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(budget.totalBudget, budget.currency)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Budget</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(budget.spentAmount, budget.currency)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Spent</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center">
            <div className={cn(
              'text-3xl font-bold',
              budget.remainingAmount >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            )}>
              {formatCurrency(budget.remainingAmount, budget.currency)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Remaining</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Budget Progress
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {budget.totalBudget > 0 ? Math.round((budget.spentAmount / budget.totalBudget) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                budget.spentAmount > budget.totalBudget 
                  ? 'bg-red-500' 
                  : budget.spentAmount > budget.totalBudget * 0.8 
                    ? 'bg-orange-500' 
                    : 'bg-green-500'
              )}
              style={{ 
                width: budget.totalBudget > 0 
                  ? `${Math.min((budget.spentAmount / budget.totalBudget) * 100, 100)}%` 
                  : '0%' 
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-600">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200',
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
              {tab.id === 'alerts' && budget.alerts.filter(a => !a.isRead).length > 0 && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                  {budget.alerts.filter(a => !a.isRead).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Category Breakdown
                  </h3>
                  <div className="space-y-3">
                    {budget.categories.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {category.name}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatCurrency(category.spentAmount, budget.currency)} / {formatCurrency(category.plannedAmount, budget.currency)}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={cn(
                              'h-2 rounded-full',
                              `bg-${category.color}-500`
                            )}
                            style={{ 
                              width: category.plannedAmount > 0 
                                ? `${Math.min((category.spentAmount / category.plannedAmount) * 100, 100)}%` 
                                : '0%' 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Recent Expenses
                  </h3>
                  <div className="space-y-3">
                    {budget.expenses.slice(-5).reverse().map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {expense.title}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {expense.date.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(expense.amount, expense.currency)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {getPaymentMethodIcon(expense.paymentMethod)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Expenses
                </h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                  ➕ Add Expense
                </button>
              </div>
              
              {/* Add Expense Form */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Add New Expense
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newExpense.title || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                      placeholder="Expense title"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={newExpense.amount || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                      placeholder="0.00"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newExpense.category || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    >
                      <option value="">Select category</option>
                      {budget.categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newExpense.date ? newExpense.date.toISOString().split('T')[0] : ''}
                      onChange={(e) => setNewExpense({ ...newExpense, date: new Date(e.target.value) })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={newExpense.paymentMethod || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value as Expense['paymentMethod'] })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    >
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.icon} {method.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={addExpense}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Add Expense
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Expenses List */}
              <div className="space-y-3">
                {budget.expenses.map((expense) => (
                  <div key={expense.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {expense.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {expense.date.toLocaleDateString()} • {expense.location}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(expense.amount, expense.currency)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {getPaymentMethodIcon(expense.paymentMethod)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Budget Categories
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {budget.categories.map((category) => (
                  <div key={category.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {category.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category.isEssential ? 'Essential' : 'Optional'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Planned:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(category.plannedAmount, budget.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Spent:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(category.spentAmount, budget.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                        <span className={cn(
                          'font-medium',
                          category.remainingAmount >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        )}>
                          {formatCurrency(category.remainingAmount, budget.currency)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(calculateCategoryPercentage(category.spentAmount, category.plannedAmount))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={cn(
                            'h-2 rounded-full',
                            `bg-${category.color}-500`
                          )}
                          style={{ 
                            width: category.plannedAmount > 0 
                              ? `${Math.min((category.spentAmount / category.plannedAmount) * 100, 100)}%` 
                              : '0%' 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && showAlerts && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Budget Alerts
              </h3>
              
              {budget.alerts.length > 0 ? (
                <div className="space-y-3">
                  {budget.alerts.map((alert) => (
                    <div key={alert.id} className={cn(
                      'p-4 rounded-lg border-l-4',
                      alert.severity === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                      alert.severity === 'medium' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500' :
                      'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                    )}>
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{getAlertIcon(alert.type)}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {alert.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {alert.message}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {alert.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No alerts
                  </h3>
                  <p>All good! No budget alerts at this time.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && showReports && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Budget Reports
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Reports coming soon
                </h3>
                <p>Detailed budget reports and analytics will be available soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

BudgetManagement.displayName = 'BudgetManagement';

// Budget Management Demo Component
interface BudgetManagementDemoProps {
  className?: string;
  showControls?: boolean;
}

export const BudgetManagementDemo = React.forwardRef<HTMLDivElement, BudgetManagementDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [budget, setBudget] = useState<Partial<BudgetData>>({});

    const handleBudgetUpdate = (updatedBudget: BudgetData) => {
      setBudget(updatedBudget);
      console.log('Budget updated:', updatedBudget);
    };

    const mockBudget: Partial<BudgetData> = {
      id: 'budget-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      currency: 'USD',
      totalBudget: 3000,
      spentAmount: 1250,
      remainingAmount: 1750,
      categories: [],
      expenses: [],
      alerts: [],
      reports: [],
      settings: {
        alertsEnabled: true,
        alertThresholds: {
          overBudget: 90,
          approachingLimit: 80,
          unusualSpending: 500
        },
        autoCategorization: true,
        receiptScanning: true,
        currencyConversion: true,
        defaultCurrency: 'USD'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6 p-6 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Budget Management Demo
        </h3>
        
        <BudgetManagement
          onBudgetUpdate={handleBudgetUpdate}
          initialBudget={mockBudget}
          showCharts={true}
          showAlerts={true}
          showReports={true}
          showSplitting={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive budget tracking with expense management, category breakdown, alerts, and financial insights.
            </p>
          </div>
        )}
      </div>
    );
  }
);

BudgetManagementDemo.displayName = 'BudgetManagementDemo';

// Export all components
export {
  budgetManagementVariants,
  type BudgetManagementProps,
  type BudgetData,
  type BudgetCategory,
  type BudgetSubcategory,
  type Expense,
  type Receipt,
  type ReceiptItem,
  type BudgetAlert,
  type BudgetReport,
  type ReportData,
  type BudgetSettings,
  type BudgetManagementDemoProps
};
