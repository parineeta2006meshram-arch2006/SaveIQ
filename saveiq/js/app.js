/**
 * SaveIQ - Main Application Controller & Router (Indian Rupee - INR)
 */

class SaveIQApp {
  constructor() {
    this.currentRoute = 'dashboard';
    this.routeParams = {};
    this.init();
  }

  init() {
    // Setup event listeners
    this.setupNavigation();
    this.setupMobileDrawer();
    this.setupQuickButtons();
    
    // Subscribe to store updates
    window.saveIQStore.subscribe(() => {
      this.updateGlobalBadges();
      // Re-render current active view
      this.renderCurrentView();
    });

    // Initial render
    this.updateGlobalBadges();
    this.navigateTo('dashboard');
  }

  setupNavigation() {
    // Desktop sidebar nav items
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const route = btn.dataset.nav;
        if (route) this.navigateTo(route);
      });
    });

    // Mobile bottom nav items
    document.querySelectorAll('.mobile-nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const route = btn.dataset.nav;
        if (route) this.navigateTo(route);
      });
    });

    // Mobile drawer nav items
    document.querySelectorAll('.mobile-drawer-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const route = btn.dataset.nav;
        if (route) {
          this.closeDrawer();
          this.navigateTo(route);
        }
      });
    });

    // Header notification bell
    const headerNotifBtn = document.getElementById('btn-header-notif');
    if (headerNotifBtn) {
      headerNotifBtn.addEventListener('click', () => {
        this.navigateTo('notifications');
      });
    }

    // Header quick deposit button
    const headerDepositBtn = document.getElementById('btn-header-deposit');
    if (headerDepositBtn) {
      headerDepositBtn.addEventListener('click', () => {
        this.openDepositModal();
      });
    }
  }

  setupMobileDrawer() {
    const btnOpen = document.getElementById('btn-mobile-menu');
    const btnClose = document.getElementById('btn-close-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const drawer = document.getElementById('mobile-drawer');

    if (btnOpen) {
      btnOpen.addEventListener('click', () => this.openDrawer());
    }
    if (btnClose) {
      btnClose.addEventListener('click', () => this.closeDrawer());
    }
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeDrawer());
    }
  }

  openDrawer() {
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const drawer = document.getElementById('mobile-drawer');
    if (backdrop && drawer) {
      backdrop.classList.remove('hidden');
      drawer.classList.remove('-translate-x-full');
    }
  }

  closeDrawer() {
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const drawer = document.getElementById('mobile-drawer');
    if (backdrop && drawer) {
      backdrop.classList.add('hidden');
      drawer.classList.add('-translate-x-full');
    }
  }

  setupQuickButtons() {
    const btnQuick = document.getElementById('btn-quick-new-goal');
    if (btnQuick) {
      btnQuick.addEventListener('click', () => this.navigateTo('create-goal'));
    }

    const btnReset = document.getElementById('btn-reset-demo');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.confirmResetDemo());
    }

    const btnMobileReset = document.getElementById('btn-mobile-reset-demo');
    if (btnMobileReset) {
      btnMobileReset.addEventListener('click', () => {
        this.closeDrawer();
        this.confirmResetDemo();
      });
    }
  }

  navigateTo(route, params = {}) {
    this.currentRoute = route;
    this.routeParams = params;

    // Update section visibility
    const sections = {
      'dashboard': document.getElementById('section-dashboard'),
      'create-goal': document.getElementById('section-create-goal'),
      'my-goals': document.getElementById('section-my-goals'),
      'ai-advice': document.getElementById('section-ai-advice'),
      'notifications': document.getElementById('section-notifications')
    };

    Object.keys(sections).forEach(key => {
      const el = sections[key];
      if (el) {
        if (key === route) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    });

    // Update Desktop Nav styles
    document.querySelectorAll('.nav-item').forEach(btn => {
      if (btn.dataset.nav === route) {
        btn.className = 'nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group active-nav';
      } else {
        btn.className = 'nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group text-slate-400 hover:text-slate-100 hover:bg-slate-800/60';
      }
    });

    // Update Mobile Bottom Nav styles
    document.querySelectorAll('.mobile-nav-item').forEach(btn => {
      if (btn.dataset.nav === route) {
        btn.classList.add('active-mobile-nav');
        btn.classList.remove('text-slate-500');
      } else {
        btn.classList.remove('active-mobile-nav');
        btn.classList.add('text-slate-500');
      }
    });

    // Update Topbar Title & Subtitle
    this.updateTopbar(route);

    // Render the view
    this.renderCurrentView();

    // Scroll to top of main container
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTop = 0;
  }

  updateTopbar(route) {
    const titleEl = document.getElementById('topbar-title');
    const subtitleEl = document.getElementById('topbar-subtitle');
    if (!titleEl || !subtitleEl) return;

    const titles = {
      'dashboard': {
        title: 'Dashboard',
        subtitle: 'Real-time savings performance & goal insights'
      },
      'create-goal': {
        title: 'Create Savings Goal',
        subtitle: 'Define your financial target in Rupees, deadline, and reminder schedule'
      },
      'my-goals': {
        title: 'My Goals',
        subtitle: 'Track, filter, and deposit towards all active savings targets'
      },
      'ai-advice': {
        title: 'AI Financial Advice',
        subtitle: 'Personalized recommendations and smart wealth-building strategies'
      },
      'notifications': {
        title: 'Notifications & Alerts',
        subtitle: 'Deadline alerts, milestone celebrations, and email previews'
      }
    };

    const info = titles[route] || titles['dashboard'];
    titleEl.textContent = info.title;
    subtitleEl.textContent = info.subtitle;
  }

  renderCurrentView() {
    const route = this.currentRoute;
    if (route === 'dashboard' && window.DashboardView) {
      window.DashboardView.render(document.getElementById('section-dashboard'));
    } else if (route === 'create-goal' && window.CreateGoalView) {
      window.CreateGoalView.render(document.getElementById('section-create-goal'));
    } else if (route === 'my-goals' && window.MyGoalsView) {
      window.MyGoalsView.render(document.getElementById('section-my-goals'), this.routeParams);
    } else if (route === 'ai-advice' && window.AiAdviceView) {
      window.AiAdviceView.render(document.getElementById('section-ai-advice'));
    } else if (route === 'notifications' && window.NotificationsView) {
      window.NotificationsView.render(document.getElementById('section-notifications'));
    }

    if (window.lucide) window.lucide.createIcons();
  }

  updateGlobalBadges() {
    const store = window.saveIQStore;
    const metrics = store.getDashboardMetrics();
    const unreadNotifs = store.getUnreadNotificationsCount();

    // Goals count badge
    const goalsBadge = document.getElementById('nav-goals-badge');
    if (goalsBadge) goalsBadge.textContent = metrics.totalGoals;

    // Notification badges & dots
    const notifBadge = document.getElementById('nav-notif-badge');
    const notifDot = document.getElementById('nav-unread-dot');
    const headerNotifDot = document.getElementById('header-notif-dot');
    const mobileNotifBadge = document.getElementById('mobile-notif-badge');

    if (notifBadge) notifBadge.textContent = unreadNotifs;
    if (notifDot) {
      if (unreadNotifs > 0) notifDot.classList.remove('hidden');
      else notifDot.classList.add('hidden');
    }
    if (headerNotifDot) {
      if (unreadNotifs > 0) headerNotifDot.classList.remove('hidden');
      else headerNotifDot.classList.add('hidden');
    }
    if (mobileNotifBadge) {
      if (unreadNotifs > 0) mobileNotifBadge.classList.remove('hidden');
      else mobileNotifBadge.classList.add('hidden');
    }

    // Sidebar mini savings widget
    const sbPercent = document.getElementById('sidebar-progress-percent');
    const sbBar = document.getElementById('sidebar-progress-bar');
    const sbSaved = document.getElementById('sidebar-saved-amount');
    const sbTarget = document.getElementById('sidebar-target-amount');

    if (sbPercent) sbPercent.textContent = `${metrics.overallProgressPercent}%`;
    if (sbBar) sbBar.style.width = `${metrics.overallProgressPercent}%`;
    if (sbSaved) sbSaved.textContent = `₹${metrics.totalSaved.toLocaleString('en-IN')}`;
    if (sbTarget) sbTarget.textContent = `₹${metrics.totalTarget.toLocaleString('en-IN')}`;
  }

  // --- MODAL CONTROLLER ---
  openModal(htmlContent) {
    const container = document.getElementById('modal-container');
    if (!container) return;

    container.innerHTML = `
      <div id="modal-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div id="modal-card" class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto transform transition-all">
          ${htmlContent}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Close on backdrop click
    const backdrop = document.getElementById('modal-backdrop');
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.closeModal();
    });
  }

  closeModal() {
    const container = document.getElementById('modal-container');
    if (container) container.innerHTML = '';
  }

  // Quick Deposit Modal
  openDepositModal(defaultGoalId = null) {
    const store = window.saveIQStore;
    const goals = store.getAllGoals();

    if (goals.length === 0) {
      this.showToast('Please create a goal first before depositing funds.', 'info');
      this.navigateTo('create-goal');
      return;
    }

    const html = `
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <i data-lucide="arrow-down-circle" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-extrabold text-slate-900 text-base">Record Savings Deposit</h3>
              <p class="text-xs text-slate-500">Add funds directly to your goals</p>
            </div>
          </div>
          <button onclick="window.saveIQApp.closeModal()" class="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <form onsubmit="window.saveIQApp.handleDepositSubmit(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Select Goal</label>
            <select id="deposit-goal-select" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
              ${goals.map(g => `
                <option value="${g.id}" ${g.id === defaultGoalId ? 'selected' : ''}>
                  ${g.name} (Saved: ₹${g.saved.toLocaleString('en-IN')} of ₹${g.target.toLocaleString('en-IN')})
                </option>
              `).join('')}
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Deposit Amount (₹)</label>
            <div class="relative">
              <span class="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                id="deposit-amount"
                required
                min="1"
                step="1"
                placeholder="5000"
                class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <!-- Quick Presets -->
            <div class="flex items-center gap-2 mt-2">
              <button type="button" onclick="document.getElementById('deposit-amount').value = '1000'" class="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200">+₹1,000</button>
              <button type="button" onclick="document.getElementById('deposit-amount').value = '2000'" class="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200">+₹2,000</button>
              <button type="button" onclick="document.getElementById('deposit-amount').value = '5000'" class="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200">+₹5,000</button>
              <button type="button" onclick="document.getElementById('deposit-amount').value = '10000'" class="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200">+₹10,000</button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Note / Source</label>
            <input
              type="text"
              id="deposit-note"
              placeholder="e.g. Monthly salary savings, Sold second-hand phone, Freelance bonus"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div class="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button type="button" onclick="window.saveIQApp.closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20">
              Confirm Deposit
            </button>
          </div>
        </form>
      </div>
    `;

    this.openModal(html);
  }

  handleDepositSubmit(e) {
    e.preventDefault();
    const goalId = document.getElementById('deposit-goal-select').value;
    const amount = Number(document.getElementById('deposit-amount').value);
    const note = document.getElementById('deposit-note').value;

    if (!goalId || isNaN(amount) || amount <= 0) return;

    const updated = window.saveIQStore.depositFunds(goalId, amount, note);
    this.closeModal();

    if (updated) {
      this.showToast(`Successfully deposited ₹${amount.toLocaleString('en-IN')} into "${updated.name}"! 💰`, 'success');
    }
  }

  // Edit Goal Modal
  openEditGoalModal(goalId) {
    const goal = window.saveIQStore.getGoalById(goalId);
    if (!goal) return;

    const html = `
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="font-extrabold text-slate-900 text-base">Edit Savings Goal</h3>
          <button onclick="window.saveIQApp.closeModal()" class="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <form onsubmit="window.saveIQApp.handleEditSubmit(event, '${goal.id}')" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Goal Name</label>
            <input type="text" id="edit-name" required value="${goal.name}" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target Amount (₹)</label>
              <input type="number" id="edit-target" required min="1" value="${goal.target}" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Current Savings (₹)</label>
              <input type="number" id="edit-saved" required min="0" value="${goal.saved}" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Deadline Date</label>
            <input type="date" id="edit-deadline" required value="${goal.deadline}" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Reminder Email</label>
            <input type="email" id="edit-email" required value="${goal.email}" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Motivation / Notes</label>
            <textarea id="edit-notes" rows="2" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">${goal.notes || ''}</textarea>
          </div>

          <div class="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button type="button" onclick="window.saveIQApp.closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    `;

    this.openModal(html);
  }

  handleEditSubmit(e, goalId) {
    e.preventDefault();
    const name = document.getElementById('edit-name').value.trim();
    const target = Number(document.getElementById('edit-target').value);
    const saved = Number(document.getElementById('edit-saved').value);
    const deadline = document.getElementById('edit-deadline').value;
    const email = document.getElementById('edit-email').value.trim();
    const notes = document.getElementById('edit-notes').value.trim();

    window.saveIQStore.updateGoal(goalId, {
      name,
      target,
      saved,
      deadline,
      email,
      notes
    });

    this.closeModal();
    this.showToast(`Updated "${name}" successfully!`, 'success');
  }

  // Delete Confirmation
  confirmDeleteGoal(goalId) {
    const goal = window.saveIQStore.getGoalById(goalId);
    if (!goal) return;

    const html = `
      <div class="space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <i data-lucide="trash-2" class="w-6 h-6"></i>
        </div>
        <div class="text-center space-y-1">
          <h3 class="font-extrabold text-slate-900 text-base">Delete "${goal.name}"?</h3>
          <p class="text-xs text-slate-500">
            This will remove this savings goal and its deposit logs. You currently have ₹${goal.saved.toLocaleString('en-IN')} recorded.
          </p>
        </div>
        <div class="pt-3 flex items-center justify-center gap-3">
          <button onclick="window.saveIQApp.closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">
            Cancel
          </button>
          <button onclick="window.saveIQApp.executeDeleteGoal('${goal.id}')" class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm">
            Yes, Delete Goal
          </button>
        </div>
      </div>
    `;

    this.openModal(html);
  }

  executeDeleteGoal(goalId) {
    window.saveIQStore.deleteGoal(goalId);
    this.closeModal();
    this.showToast('Goal deleted successfully', 'info');
  }

  // Reset Demo Data Confirmation
  confirmResetDemo() {
    const html = `
      <div class="space-y-4 text-center">
        <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
          <i data-lucide="rotate-ccw" class="w-6 h-6"></i>
        </div>
        <div class="space-y-1">
          <h3 class="font-extrabold text-slate-900 text-base">Reset Demo Data?</h3>
          <p class="text-xs text-slate-500">
            This will reload the 4 sample goals (Emergency Safety Net, Kyoto Vacation, MacBook Pro, Home Office Desk) in Indian Rupees (INR) for immediate testing.
          </p>
        </div>
        <div class="pt-3 flex items-center justify-center gap-3">
          <button onclick="window.saveIQApp.closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">
            Cancel
          </button>
          <button onclick="window.saveIQApp.executeResetDemo()" class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold">
            Reset to Demo
          </button>
        </div>
      </div>
    `;
    this.openModal(html);
  }

  executeResetDemo() {
    window.saveIQStore.resetToDemo();
    this.closeModal();
    this.showToast('Demo data restored successfully in INR! 🇮🇳', 'success');
  }

  // Simulated Email Preview Modal
  openEmailPreviewModal(goal) {
    const html = `
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <i data-lucide="mail" class="w-4 h-4 text-emerald-600"></i>
            <span class="font-bold text-slate-900 text-xs uppercase tracking-wider">Email Dispatch Mockup</span>
          </div>
          <button onclick="window.saveIQApp.closeModal()" class="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Rendered Email Card -->
        <div class="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white text-xs">
          <!-- Email Header Bar -->
          <div class="bg-slate-900 p-4 text-white flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center font-bold text-[10px]">IQ</div>
              <span class="font-bold text-sm">SaveIQ Reminders</span>
            </div>
            <span class="text-[10px] text-slate-400">To: ${goal.email}</span>
          </div>

          <!-- Email Body -->
          <div class="p-5 space-y-3.5 text-slate-700">
            <p class="font-semibold text-slate-900 text-sm">Your Weekly Progress Check-in 📈</p>
            <p>Hi Parineeta, here is your automated progress update for <strong class="text-slate-900">${goal.name}</strong>:</p>

            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div class="flex justify-between font-semibold">
                <span>Total Saved:</span>
                <span class="text-emerald-600 font-bold">₹${goal.saved.toLocaleString('en-IN')} of ₹${goal.target.toLocaleString('en-IN')}</span>
              </div>
              <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full" style="width: ${goal.progressPercent}%"></div>
              </div>
              <div class="flex justify-between text-[11px] text-slate-500">
                <span>Remaining: ₹${goal.remaining.toLocaleString('en-IN')}</span>
                <span>${goal.countdownText}</span>
              </div>
            </div>

            <p class="text-slate-500 text-[11px]">
              "Consistency is the secret to building financial resilience." — SaveIQ AI Coach
            </p>

            <div class="pt-2 text-center">
              <span class="inline-block py-2 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                Open SaveIQ & Deposit Now
              </span>
            </div>
          </div>
        </div>

        <div class="text-center pt-2">
          <button onclick="window.saveIQApp.closeModal()" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200">
            Close Preview
          </button>
        </div>
      </div>
    `;

    this.openModal(html);
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toastId = 'toast-' + Date.now();
    let borderClass = 'border-slate-200';
    let icon = 'info';
    let iconColor = 'text-blue-500';

    if (type === 'success') {
      borderClass = 'border-emerald-300';
      icon = 'check-circle';
      iconColor = 'text-emerald-500';
    } else if (type === 'error') {
      borderClass = 'border-rose-300';
      icon = 'alert-circle';
      iconColor = 'text-rose-500';
    }

    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast-enter p-3.5 rounded-2xl bg-white border ${borderClass} shadow-xl flex items-center gap-3 text-xs text-slate-800 font-semibold pointer-events-auto transition-all`;
    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-4 h-4 ${iconColor} flex-shrink-0"></i>
      <span class="flex-1">${message}</span>
      <button onclick="document.getElementById('${toastId}').remove()" class="text-slate-400 hover:text-slate-600 p-0.5">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    // Auto dismiss after 3.8s
    setTimeout(() => {
      const el = document.getElementById(toastId);
      if (el) {
        el.classList.add('toast-exit');
        setTimeout(() => el.remove(), 300);
      }
    }, 3800);
  }
}

// Start Application on Load
document.addEventListener('DOMContentLoaded', () => {
  window.saveIQApp = new SaveIQApp();
});
