/**
 * SaveIQ - State Management & Storage Engine (Indian Rupees - INR Edition)
 */

// Global INR Formatter Utility
window.formatINR = function(amount) {
  const num = Number(amount) || 0;
  return '₹' + num.toLocaleString('en-IN');
};

class SaveIQStore {
  constructor() {
    this.STORAGE_KEY_GOALS = 'saveiq_goals_inr_v1';
    this.STORAGE_KEY_NOTIFS = 'saveiq_notifs_inr_v1';
    this.STORAGE_KEY_SETTINGS = 'saveiq_settings_inr_v1';
    
    this.goals = [];
    this.notifications = [];
    this.settings = {
      emailAlerts: true,
      cadence: 'weekly',
      milestoneAlerts: true,
      overdueAlerts: true,
      currency: '₹'
    };
    
    this.listeners = [];
    this.init();
  }

  formatINR(amount) {
    return window.formatINR(amount);
  }

  // Generate dynamic relative dates (e.g. +6 months, -12 days)
  getDateOffset(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  }

  getDemoGoals() {
    return [
      {
        id: 'goal-demo-1',
        name: 'Emergency Safety Net',
        target: 500000, // ₹5,00,000
        saved: 325000,  // ₹3,25,000 (65%)
        deadline: this.getDateOffset(180), // ~6 months
        purpose: 'Emergency Fund',
        category: 'emergency',
        email: 'Pari.meshram@saveiq.demo',
        reminderFrequency: 'Weekly',
        notes: '6 months of living expenses buffer for financial security and unforeseen emergencies.',
        createdAt: this.getDateOffset(-60),
        history: [
          { date: this.getDateOffset(-60), amount: 200000, note: 'Initial deposit from annual bonus' },
          { date: this.getDateOffset(-30), amount: 75000, note: 'Monthly automated savings' },
          { date: this.getDateOffset(-7), amount: 50000, note: 'Consulting project payout' }
        ]
      },
      {
        id: 'goal-demo-2',
        name: 'Kyoto Vacation Trip',
        target: 200000, // ₹2,00,000
        saved: 200000,  // ₹2,00,000 (100% Completed)
        deadline: this.getDateOffset(30), // 1 month
        purpose: 'Travel & Vacation',
        category: 'travel',
        email: 'pari.meshram@saveiq.demo',
        reminderFrequency: 'Bi-weekly',
        notes: 'Round-trip flights, traditional ryokan lodging, and food tour in Japan.',
        createdAt: this.getDateOffset(-90),
        history: [
          { date: this.getDateOffset(-90), amount: 80000, note: 'Trip kick-off funds' },
          { date: this.getDateOffset(-45), amount: 70000, note: 'Bi-weekly transfer' },
          { date: this.getDateOffset(-3), amount: 50000, note: 'Final milestone reached!' }
        ]
      },
      {
        id: 'goal-demo-3',
        name: 'Laptop',
        target: 250000, // ₹2,50,000
        saved: 80000,   // ₹80,000 (32%)
        deadline: this.getDateOffset(90), // 3 months
        purpose: 'Gadgets & Tech',
        category: 'tech',
        email: 'pari.meshram@saveiq.demo',
        reminderFrequency: 'Monthly',
        notes: 'Upgrading work laptop to speed up local AI compilation & 4K video rendering.',
        createdAt: this.getDateOffset(-20),
        history: [
          { date: this.getDateOffset(-20), amount: 50000, note: 'Initial allocation' },
          { date: this.getDateOffset(-5), amount: 30000, note: 'Sold old iPad' }
        ]
      },
      {
        id: 'goal-demo-4',
        name: 'Office Table',
        target: 60000, // ₹60,000 (Overdue demo)
        saved: 18000,  // ₹18,000 (30%)
        deadline: this.getDateOffset(-12), // 12 days OVERDUE
        purpose: 'Home & Living',
        category: 'home',
        email: 'pari.meshram@saveiq.demo',
        reminderFrequency: 'Weekly',
        notes: 'Motorized standing desk with dual monitor arms for ergonomic setup.',
        createdAt: this.getDateOffset(-75),
        history: [
          { date: this.getDateOffset(-75), amount: 10000, note: 'Starting balance' },
          { date: this.getDateOffset(-40), amount: 8000, note: 'Weekend savings transfer' }
        ]
      }
    ];
  }

  getDemoNotifications() {
    return [
      {
        id: 'notif-1',
        type: 'warning',
        title: 'Goal Overdue: Home Office Standing Desk',
        message: 'The deadline was 12 days ago (₹18,000 of ₹60,000 saved). Review your pace or adjust the target date.',
        goalId: 'goal-demo-4',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hrs ago
        read: false
      },
      {
        id: 'notif-2',
        type: 'success',
        title: 'Milestone Reached: Vacation Trip',
        message: 'Congratulations! You reached 100% of your ₹2,00,000 target. Time to pack your bags!',
        goalId: 'goal-demo-2',
        timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
        read: true
      },
      {
        id: 'notif-3',
        type: 'info',
        title: 'Scheduled Reminder Sent',
        message: 'Dispatched weekly savings check-in to pari.meshram@saveiq.demo for Emergency Safety Net.',
        goalId: 'goal-demo-1',
        timestamp: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
        read: true
      }
    ];
  }

  init() {
    try {
      const storedGoals = localStorage.getItem(this.STORAGE_KEY_GOALS);
      if (storedGoals) {
        this.goals = JSON.parse(storedGoals);
      } else {
        this.goals = this.getDemoGoals();
        this.saveGoals();
      }

      const storedNotifs = localStorage.getItem(this.STORAGE_KEY_NOTIFS);
      if (storedNotifs) {
        this.notifications = JSON.parse(storedNotifs);
      } else {
        this.notifications = this.getDemoNotifications();
        this.saveNotifications();
      }

      const storedSettings = localStorage.getItem(this.STORAGE_KEY_SETTINGS);
      if (storedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(storedSettings) };
      }
    } catch (e) {
      console.warn('LocalStorage error, using fallback memory state:', e);
      this.goals = this.getDemoGoals();
      this.notifications = this.getDemoNotifications();
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  saveGoals() {
    try {
      localStorage.setItem(this.STORAGE_KEY_GOALS, JSON.stringify(this.goals));
    } catch (e) {
      console.warn('Could not save goals to localStorage:', e);
    }
    this.notify();
  }

  saveNotifications() {
    try {
      localStorage.setItem(this.STORAGE_KEY_NOTIFS, JSON.stringify(this.notifications));
    } catch (e) {
      console.warn('Could not save notifications to localStorage:', e);
    }
    this.notify();
  }

  saveSettings() {
    try {
      localStorage.setItem(this.STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Could not save settings to localStorage:', e);
    }
    this.notify();
  }

  resetToDemo() {
    this.goals = this.getDemoGoals();
    this.notifications = this.getDemoNotifications();
    this.saveGoals();
    this.saveNotifications();
  }

  // --- Goal Enrichment & Status Helpers ---
  getEnrichedGoal(goal) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(goal.deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const target = Number(goal.target) || 0;
    const saved = Number(goal.saved) || 0;
    const remaining = Math.max(0, target - saved);
    const progressPercent = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;

    let status = 'active';
    let countdownText = '';
    let countdownBadgeClass = '';

    if (saved >= target) {
      status = 'completed';
      countdownText = 'Goal Completed! 🎉';
      countdownBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (diffDays < 0) {
      status = 'overdue';
      const absDays = Math.abs(diffDays);
      countdownText = `Overdue by ${absDays} day${absDays === 1 ? '' : 's'}`;
      countdownBadgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
    } else if (diffDays === 0) {
      status = 'active';
      countdownText = 'Due Today!';
      countdownBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
    } else {
      status = 'active';
      if (diffDays < 30) {
        countdownText = `${diffDays} days left`;
      } else {
        const months = Math.floor(diffDays / 30);
        const remDays = diffDays % 30;
        countdownText = remDays > 5 ? `~${months}m ${remDays}d left` : `~${months} month${months === 1 ? '' : 's'} left`;
      }
      countdownBadgeClass = diffDays <= 14 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200';
    }

    // Recommended monthly saving calculation
    let monthlyRate = 0;
    if (status === 'active' && remaining > 0 && diffDays > 0) {
      const months = Math.max(0.5, diffDays / 30.4);
      monthlyRate = Math.round(remaining / months);
    }

    return {
      ...goal,
      target,
      saved,
      remaining,
      progressPercent,
      status,
      diffDays,
      countdownText,
      countdownBadgeClass,
      monthlyRate
    };
  }

  getAllGoals() {
    return this.goals.map(g => this.getEnrichedGoal(g));
  }

  getGoalById(id) {
    const goal = this.goals.find(g => g.id === id);
    return goal ? this.getEnrichedGoal(goal) : null;
  }

  // --- CRUD Operations ---
  createGoal(goalData) {
    const id = 'goal-' + Date.now();
    const newGoal = {
      id,
      name: goalData.name.trim(),
      target: Math.max(1, Number(goalData.target)),
      saved: Math.max(0, Number(goalData.saved) || 0),
      deadline: goalData.deadline,
      purpose: goalData.purpose || 'Other',
      category: goalData.category || 'other',
      email: goalData.email.trim(),
      reminderFrequency: goalData.reminderFrequency || 'Weekly',
      notes: (goalData.notes || '').trim(),
      createdAt: new Date().toISOString().split('T')[0],
      history: [
        {
          date: new Date().toISOString().split('T')[0],
          amount: Math.max(0, Number(goalData.saved) || 0),
          note: 'Initial deposit'
        }
      ]
    };

    this.goals.unshift(newGoal);
    this.saveGoals();

    // Create a notification for creation
    this.addNotification({
      type: 'info',
      title: `New Goal Created: ${newGoal.name}`,
      message: `Target of ${window.formatINR(newGoal.target)} by ${newGoal.deadline}. Reminders set for ${newGoal.email}.`,
      goalId: id
    });

    return newGoal;
  }

  updateGoal(id, updatedFields) {
    const index = this.goals.findIndex(g => g.id === id);
    if (index === -1) return null;

    this.goals[index] = {
      ...this.goals[index],
      ...updatedFields,
      target: Number(updatedFields.target ?? this.goals[index].target),
      saved: Number(updatedFields.saved ?? this.goals[index].saved)
    };

    this.saveGoals();
    return this.getEnrichedGoal(this.goals[index]);
  }

  deleteGoal(id) {
    const goal = this.goals.find(g => g.id === id);
    if (!goal) return false;

    this.goals = this.goals.filter(g => g.id !== id);
    this.saveGoals();

    this.addNotification({
      type: 'info',
      title: `Goal Removed: ${goal.name}`,
      message: 'The goal has been archived and removed from your active dashboard.',
      goalId: null
    });

    return true;
  }

  depositFunds(id, amount, note = 'Deposit added') {
    const index = this.goals.findIndex(g => g.id === id);
    if (index === -1) return null;

    const depositAmount = Number(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) return null;

    const goal = this.goals[index];
    const oldSaved = goal.saved;
    const newSaved = oldSaved + depositAmount;
    goal.saved = newSaved;

    if (!goal.history) goal.history = [];
    const now = new Date();

goal.history.push({
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    }),
    amount: amount,
    note: note
});
    this.saveGoals();

    // Check if reached 100%
    if (oldSaved < goal.target && newSaved >= goal.target) {
      this.addNotification({
        type: 'success',
        title: `Goal Completed: ${goal.name}!`,
        message: `Incredible work! You just deposited ${window.formatINR(depositAmount)} and reached your ${window.formatINR(goal.target)} target!`,
        goalId: id
      });
    } else {
      this.addNotification({
        type: 'info',
        title: `Saved ${window.formatINR(depositAmount)} to ${goal.name}`,
        message: `Current progress: ${window.formatINR(newSaved)} of ${window.formatINR(goal.target)} (${Math.min(100, Math.round((newSaved / goal.target) * 100))}%).`,
        goalId: id
      });
    }

    return this.getEnrichedGoal(goal);
  }

  // --- Dashboard Analytics Computations ---
  getDashboardMetrics() {
    const enriched = this.getAllGoals();
    
    const totalGoals = enriched.length;
    const activeGoals = enriched.filter(g => g.status === 'active').length;
    const completedGoals = enriched.filter(g => g.status === 'completed').length;
    const overdueGoals = enriched.filter(g => g.status === 'overdue').length;

    const totalTarget = enriched.reduce((acc, g) => acc + g.target, 0);
    const totalSaved = enriched.reduce((acc, g) => acc + g.saved, 0);
    const totalRemaining = Math.max(0, totalTarget - totalSaved);
    const overallProgressPercent = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

    // Category breakdown
    const categoryMap = {};
    enriched.forEach(g => {
      const cat = g.purpose || 'Other';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { saved: 0, target: 0, count: 0 };
      }
      categoryMap[cat].saved += g.saved;
      categoryMap[cat].target += g.target;
      categoryMap[cat].count += 1;
    });

    // Closest deadline active goals
    const priorityGoals = enriched
      .filter(g => g.status === 'active' || g.status === 'overdue')
      .sort((a, b) => a.diffDays - b.diffDays)
      .slice(0, 3);

    // Recent activity log across all goals
    const recentActivity = [];
    enriched.forEach(g => {
      if (g.history) {
        g.history.forEach(h => {
          recentActivity.push({
            goalId: g.id,
            goalName: g.name,
            date: h.date,
            amount: h.amount,
            note: h.note
          });
        });
      }
    });
    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      totalGoals,
      activeGoals,
      completedGoals,
      overdueGoals,
      totalTarget,
      totalSaved,
      totalRemaining,
      overallProgressPercent,
      categoryMap,
      priorityGoals,
      recentActivity: recentActivity.slice(0, 5)
    };
  }

  // --- Notification Methods ---
  getNotifications() {
    return [...this.notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  getUnreadNotificationsCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  addNotification(notif) {
    const newNotif = {
      id: 'notif-' + Date.now(),
      type: notif.type || 'info',
      title: notif.title,
      message: notif.message,
      goalId: notif.goalId || null,
      timestamp: new Date().toISOString(),
      read: false
    };
    this.notifications.unshift(newNotif);
    this.saveNotifications();
    return newNotif;
  }

  markNotificationAsRead(id) {
    const item = this.notifications.find(n => n.id === id);
    if (item) {
      item.read = true;
      this.saveNotifications();
    }
  }

  markAllNotificationsAsRead() {
    this.notifications.forEach(n => { n.read = true; });
    this.saveNotifications();
  }

  clearAllNotifications() {
    this.notifications = [];
    this.saveNotifications();
  }
}

// Global Store Instance
window.saveIQStore = new SaveIQStore();
