import React, { useState } from 'react';
import { 
  PlusCircle, 
  Wallet, 
  Target, 
  PieChart, 
  BarChart3, 
  MessageCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  X,
  Send,
  Settings,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area
} from 'recharts';

const ExpenseTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hi! I am your expense tracker assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Dummy data
  const totalIncome = 5500;
  const totalExpenses = 3200;
  const goalCredit = 850;
  
  const expenses = [
    { id: 1, category: 'Food', amount: 450, date: '2025-01-15', description: 'Groceries' },
    { id: 2, category: 'Transport', amount: 120, date: '2025-01-14', description: 'Gas' },
    { id: 3, category: 'Entertainment', amount: 80, date: '2025-01-13', description: 'Movie tickets' },
    { id: 4, category: 'Shopping', amount: 200, date: '2025-01-12', description: 'Clothes' },
  ];

  const budgets = [
    { category: 'Food', budget: 500, spent: 450 },
    { category: 'Transport', budget: 200, spent: 120 },
    { category: 'Entertainment', budget: 150, spent: 80 },
    { category: 'Shopping', budget: 300, spent: 200 },
  ];

  const goals = [
    { id: 1, name: 'Emergency Fund', target: 10000, current: 2500 },
    { id: 2, name: 'Vacation', target: 3000, current: 850 },
    { id: 3, name: 'New Car', target: 25000, current: 5200 },
  ];

  // Chart data
  const monthlyData = [
    { month: 'Jan', income: 5500, expenses: 3200 },
    { month: 'Feb', income: 6000, expenses: 3800 },
    { month: 'Mar', income: 5800, expenses: 3400 },
    { month: 'Apr', income: 6200, expenses: 3600 },
    { month: 'May', income: 5900, expenses: 3100 },
    { month: 'Jun', income: 6400, expenses: 3900 },
  ];

  const pieChartData = [
    { name: 'Food', value: 450, color: '#60A5FA' },
    { name: 'Transport', value: 120, color: '#34D399' },
    { name: 'Entertainment', value: 80, color: '#FBBF24' },
    { name: 'Shopping', value: 200, color: '#F87171' },
    { name: 'Others', value: 350, color: '#A78BFA' },
  ];

  const weeklyExpenses = [
    { week: 'Week 1', amount: 800 },
    { week: 'Week 2', amount: 950 },
    { week: 'Week 3', amount: 720 },
    { week: 'Week 4', amount: 1100 },
  ];

  const categoryTrends = [
    { month: 'Jan', Food: 450, Transport: 120, Entertainment: 80, Shopping: 200 },
    { month: 'Feb', Food: 520, Transport: 140, Entertainment: 95, Shopping: 180 },
    { month: 'Mar', Food: 480, Transport: 110, Entertainment: 120, Shopping: 220 },
    { month: 'Apr', Food: 510, Transport: 130, Entertainment: 85, Shopping: 240 },
    { month: 'May', Food: 470, Transport: 125, Entertainment: 100, Shopping: 190 },
    { month: 'Jun', Food: 490, Transport: 135, Entertainment: 110, Shopping: 210 },
  ];

  const savingsData = [
    { month: 'Jan', saved: 2300 },
    { month: 'Feb', saved: 2200 },
    { month: 'Mar', saved: 2400 },
    { month: 'Apr', saved: 2600 },
    { month: 'May', saved: 2800 },
    { month: 'Jun', saved: 2500 },
  ];

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, 
        { type: 'user', message: chatInput },
        { type: 'bot', message: 'Thanks for your message! I am here to help with your expense tracking needs.' }
      ]);
      setChatInput('');
    }
  };

  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-slate-800 text-white rounded-lg p-6 w-full max-w-md mx-4 border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Income</p>
              <p className="text-2xl font-bold">${totalIncome}</p>
            </div>
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold">${totalExpenses}</p>
            </div>
            <TrendingDown className="w-8 h-8" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Net Balance</p>
              <p className="text-2xl font-bold">${totalIncome - totalExpenses}</p>
            </div>
            <Wallet className="w-8 h-8" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Goal Credit</p>
              <p className="text-2xl font-bold">${goalCredit}</p>
            </div>
            <Target className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Monthly Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', color: '#F1F5F9' }} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} />
              <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Expense Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', color: '#F1F5F9' }} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-white">Recent Expenses</h3>
        <div className="space-y-3">
          {expenses.slice(0, 5).map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div>
                <p className="font-medium text-white">{expense.description}</p>
                <p className="text-sm text-slate-400">{expense.category} • {expense.date}</p>
              </div>
              <span className="font-semibold text-red-400">-${expense.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Weekly Expense Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyExpenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="week" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', color: '#F1F5F9' }} />
              <Area type="monotone" dataKey="amount" stroke="#60A5FA" fill="#60A5FA" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Savings Progression</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={savingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', color: '#F1F5F9' }} />
              <Area type="monotone" dataKey="saved" stroke="#34D399" fill="#34D399" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Category Spending Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={categoryTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', color: '#F1F5F9' }} />
              <Legend />
              <Line type="monotone" dataKey="Food" stroke="#60A5FA" strokeWidth={2} />
              <Line type="monotone" dataKey="Transport" stroke="#34D399" strokeWidth={2} />
              <Line type="monotone" dataKey="Entertainment" stroke="#FBBF24" strokeWidth={2} />
              <Line type="monotone" dataKey="Shopping" stroke="#F87171" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-lg font-semibold mb-4 text-white">Budget vs Actual Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgets}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="category" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', color: '#F1F5F9' }} />
              <Legend />
              <Bar dataKey="budget" fill="#60A5FA" name="Budget" />
              <Bar dataKey="spent" fill="#F87171" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h4 className="text-lg font-semibold text-white mb-2">Avg Monthly Spending</h4>
          <p className="text-3xl font-bold text-blue-400">${(totalExpenses / 6).toFixed(0)}</p>
          <p className="text-slate-400 text-sm">Last 6 months</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h4 className="text-lg font-semibold text-white mb-2">Highest Expense Day</h4>
          <p className="text-3xl font-bold text-red-400">$120</p>
          <p className="text-slate-400 text-sm">Jan 14, 2025</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h4 className="text-lg font-semibold text-white mb-2">Savings Rate</h4>
          <p className="text-3xl font-bold text-green-400">{((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1)}%</p>
          <p className="text-slate-400 text-sm">Of total income</p>
        </div>
      </div>
    </div>
  );

  const renderBudgets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Budget Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Settings className="w-4 h-4" />
          Set Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget, idx) => {
          const percentage = (budget.spent / budget.budget) * 100;
          const isOverBudget = percentage > 100;
          
          return (
            <div key={idx} className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white">{budget.category}</h3>
                <span className={`text-sm font-medium ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
                  ${budget.spent} / ${budget.budget}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                <div 
                  className={`h-3 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-400">
                {percentage.toFixed(1)}% used • ${budget.budget - budget.spent} remaining
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Financial Goals</h2>
        <button 
          onClick={() => setShowGoalModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Target className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Total Goal Credit</h3>
            <p className="text-3xl font-bold">${goalCredit}</p>
            <p className="text-purple-200 text-sm mt-2">Available for goal contributions</p>
          </div>
          <DollarSign className="w-12 h-12 text-purple-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100;
          
          return (
            <div key={goal.id} className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">{goal.name}</h3>
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-400 mb-1">
                  <span>${goal.current}</span>
                  <span>${goal.target}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  {percentage.toFixed(1)}% complete • ${goal.target - goal.current} remaining
                </p>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm">
                Add Funds
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-white">ExpenseTracker</h1>
            
            <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'analytics', label: 'Analytics', icon: Activity },
                { id: 'budgets', label: 'Budgets', icon: PieChart },
                { id: 'goals', label: 'Goals', icon: Target },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowIncomeModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
              >
                <PlusCircle className="w-4 h-4" />
                Add Income
              </button>
              <button 
                onClick={() => setShowExpenseModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700"
              >
                <PlusCircle className="w-4 h-4" />
                Add Expense
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'budgets' && renderBudgets()}
        {activeTab === 'goals' && renderGoals()}
      </main>

      <div className="fixed bottom-4 left-4 flex flex-col gap-3">
        <button 
          onClick={() => setShowChatbot(!showChatbot)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      <Modal show={showIncomeModal} onClose={() => setShowIncomeModal(false)} title="Add Income">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Amount</label>
            <input type="number" className="w-full p-2 border border-slate-600 bg-slate-700 text-white rounded-md" placeholder="Enter amount" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <input type="text" className="w-full p-2 border border-slate-600 bg-slate-700 text-white rounded-md" placeholder="Source of income" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Add to Goal Credit</label>
            <input type="number" className="w-full p-2 border border-slate-600 bg-slate-700 text-white rounded-md" placeholder="Amount for goals (optional)" />
          </div>
          <div className="flex gap-2 pt-4">
            <button onClick={() => setShowIncomeModal(false)} className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
              Add Income
            </button>
            <button onClick={() => setShowIncomeModal(false)} className="flex-1 bg-slate-600 text-white py-2 rounded-md hover:bg-slate-700">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal show={showExpenseModal} onClose={() => setShowExpenseModal(false)} title="Add Expense">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Amount</label>
            <input type="number" className="w-full p-2 border border-slate-600 bg-slate-700 text-white rounded-md" placeholder="Enter amount" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
            <select className="w-full p-2 border border-slate-600 bg-slate-700 text-white rounded-md">
              <option>Food</option>
              <option>Transport</option>
              <option>Entertainment</option>
              <option>Shopping</option>
              <option>Others</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <input type="text" className="w-full p-2 border border-slate-600 bg-slate-700 text-white rounded-md" placeholder="What did you buy?" />
          </div>
          <div className="flex gap-2 pt-4">
            <button onClick={() => setShowExpenseModal(false)} className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700">
              Add Expense
            </button>
            <button onClick={() => setShowExpenseModal(false)} className="flex-1 bg-slate-600 text-white py-2 rounded-md hover:bg-slate-700">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal show={showGoalModal} onClose={() => setShowGoalModal(false)} title="Add Goal">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Goal Name</label>
            <input type="text" className="w-full p-2 border border-slate-600 bg-slate-700 text-white rounded-md" placeholder="e.g., Emergency Fund" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Target Amount</label>
            <input type="number" className="w-full p-2 border border-slate-600 bg-slate-700 text-white rounded-md" placeholder="Enter target amount" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Current Amount</label>
            <input type="number" className="w-full p-2 border border-slate-600 bg-slate-700 text-white rounded-md" placeholder="Current saved amount" />
          </div>
          <div className="flex gap-2 pt-4">
            <button onClick={() => setShowGoalModal(false)} className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              Add Goal
            </button>
            <button onClick={() => setShowGoalModal(false)} className="flex-1 bg-slate-600 text-white py-2 rounded-md hover:bg-slate-700">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {showChatbot && (
        <div className="fixed bottom-4 right-4 w-80 bg-slate-800 rounded-lg shadow-2xl border border-slate-700">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Expense Assistant</h3>
            <button onClick={() => setShowChatbot(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-2 rounded-lg ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-100'}`}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 p-2 border border-slate-600 bg-slate-700 text-white rounded-md text-sm"
              placeholder="Ask me anything..."
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
            />
            <button onClick={handleChatSubmit} className="bg-blue-600 text-white p-2 rounded-md">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;
