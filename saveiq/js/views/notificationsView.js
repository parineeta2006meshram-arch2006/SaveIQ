/**
 * SaveIQ - Notifications & Email Reminder View
 * Notification feed, simulated email reminder dispatches, and alert preferences.
 */

window.NotificationsView = {
  currentTab: 'all', // 'all', 'unread', 'deadlines', 'milestones'

  render(container) {
    const store = window.saveIQStore;
    const allNotifs = store.getNotifications();
    const unreadCount = store.getUnreadNotificationsCount();
    const allGoals = store.getAllGoals();

    // Filter notifications based on tab
    let filteredNotifs = allNotifs.filter(n => {
      if (this.currentTab === 'unread') return !n.read;
      if (this.currentTab === 'deadlines') return n.type === 'warning' || n.title.toLowerCase().includes('overdue') || n.title.toLowerCase().includes('deadline');
      if (this.currentTab === 'milestones') return n.type === 'success' || n.title.toLowerCase().includes('milestone') || n.title.toLowerCase().includes('completed');
      return true;
    });

    container.innerHTML = `
      <div class="max-w-6xl mx-auto space-y-6">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <i data-lucide="bell" class="w-6 h-6 text-amber-500"></i>
              <span>Notifications & Reminders</span>
            </h2>
            <p class="text-xs sm:text-sm text-slate-500">Stay updated on upcoming deadlines, milestone achievements, and email reminders.</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              onclick="window.NotificationsView.markAllRead()"
              class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <i data-lucide="check-check" class="w-4 h-4 text-emerald-600"></i>
              <span>Mark All Read</span>
            </button>
            <button
              onclick="window.NotificationsView.clearAll()"
              class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <i data-lucide="trash-2" class="w-4 h-4"></i>
              <span>Clear History</span>
            </button>
          </div>
        </div>

        <!-- TWO COLUMN LAYOUT: FEED (LEFT) & EMAIL SIMULATOR / PREFERENCES (RIGHT) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- LEFT: NOTIFICATIONS FEED (7 cols) -->
          <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            
            <!-- Tabs Bar -->
            <div class="flex items-center gap-1 border-b border-slate-100 pb-3 overflow-x-auto">
              <button
                onclick="window.NotificationsView.setTab('all')"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${this.currentTab === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}"
              >
                All (${allNotifs.length})
              </button>
              <button
                onclick="window.NotificationsView.setTab('unread')"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${this.currentTab === 'unread' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}"
              >
                Unread (${unreadCount})
              </button>
              <button
                onclick="window.NotificationsView.setTab('deadlines')"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${this.currentTab === 'deadlines' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}"
              >
                Deadlines
              </button>
              <button
                onclick="window.NotificationsView.setTab('milestones')"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${this.currentTab === 'milestones' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}"
              >
                Milestones
              </button>
            </div>

            <!-- Notifications List -->
            <div class="space-y-3">
              ${filteredNotifs.length === 0 ? `
                <div class="p-10 text-center text-slate-400 space-y-2">
                  <i data-lucide="bell-off" class="w-8 h-8 mx-auto text-slate-300"></i>
                  <p class="text-xs font-medium">No notifications in this category.</p>
                </div>
              ` : filteredNotifs.map(n => this.renderNotificationItem(n)).join('')}
            </div>

          </div>

          <!-- RIGHT: EMAIL REMINDER SIMULATOR & PREFERENCES (5 cols) -->
          <div class="lg:col-span-5 space-y-6">
            
            <!-- SIMULATE EMAIL REMINDER DISPATCH -->
            <div class="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <i data-lucide="mail-check" class="w-4 h-4"></i>
                </div>
                <div>
                  <h3 class="font-extrabold text-slate-900 text-sm">Email Reminder Simulator</h3>
                  <p class="text-[11px] text-slate-500">Preview scheduled reminder email before dispatch</p>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Goal to Test
                </label>
                <select
                  id="simulator-goal-select"
                  class="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  ${allGoals.map(g => `
                    <option value="${g.id}">
                      ${g.name} (${g.progressPercent}% - ${g.email})
                    </option>
                  `).join('')}
                </select>
              </div>

              <div class="pt-1 flex gap-2">
                <button
                  onclick="window.NotificationsView.previewReminderEmail()"
                  class="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <i data-lucide="eye" class="w-4 h-4"></i>
                  <span>Preview Email</span>
                </button>
                <button
                  onclick="window.NotificationsView.simulateSendEmail()"
                  class="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <i data-lucide="send" class="w-4 h-4"></i>
                  <span>Send Test Alert</span>
                </button>
              </div>
              <p class="text-[11px] text-slate-400">
                Tests email dispatch without hitting external SMTP servers. Staged for Phase 2 API integration.
              </p>
            </div>

            <!-- NOTIFICATION PREFERENCES -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 class="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <i data-lucide="sliders" class="w-4 h-4 text-slate-600"></i>
                <span>Notification Settings</span>
              </h3>

              <div class="space-y-3 text-xs">
                
                <!-- Email Alerts Toggle -->
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span class="font-bold text-slate-800 block">Email Reminders</span>
                    <span class="text-slate-400 text-[11px]">Send weekly goal check-ins</span>
                  </div>
                  <input
                    type="checkbox"
                    id="pref-email-alerts"
                    ${store.settings.emailAlerts ? 'checked' : ''}
                    onchange="window.NotificationsView.updatePref('emailAlerts', this.checked)"
                    class="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                </div>

                <!-- Overdue Alerts Toggle -->
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span class="font-bold text-slate-800 block">Urgent Deadline Warnings</span>
                    <span class="text-slate-400 text-[11px]">Alert when within 7 days of deadline</span>
                  </div>
                  <input
                    type="checkbox"
                    id="pref-overdue-alerts"
                    ${store.settings.overdueAlerts ? 'checked' : ''}
                    onchange="window.NotificationsView.updatePref('overdueAlerts', this.checked)"
                    class="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                </div>

                <!-- Milestone Celebrations -->
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span class="font-bold text-slate-800 block">Celebration Toasts</span>
                    <span class="text-slate-400 text-[11px]">Notify upon reaching 50%, 75%, 100%</span>
                  </div>
                  <input
                    type="checkbox"
                    id="pref-milestone-alerts"
                    ${store.settings.milestoneAlerts ? 'checked' : ''}
                    onchange="window.NotificationsView.updatePref('milestoneAlerts', this.checked)"
                    class="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                </div>

              </div>

              <div class="pt-2 text-[11px] text-slate-400">
                Preferences are automatically saved to your browser session.
              </div>
            </div>

          </div>

        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  renderNotificationItem(notif) {
    let icon = 'info';
    let iconBg = 'bg-blue-50 text-blue-600';
    if (notif.type === 'warning') {
      icon = 'alert-triangle';
      iconBg = 'bg-rose-50 text-rose-600';
    } else if (notif.type === 'success') {
      icon = 'check-circle-2';
      iconBg = 'bg-emerald-50 text-emerald-600';
    }

    // Relative timestamp format
    const timeAgo = this.formatTimeAgo(notif.timestamp);

    return `
      <div class="p-4 rounded-2xl border transition-all ${notif.read ? 'border-slate-100 bg-white' : 'border-amber-200/80 bg-amber-50/30'} flex items-start gap-3.5">
        <div class="w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5">
          <i data-lucide="${icon}" class="w-4 h-4"></i>
        </div>

        <div class="flex-1 space-y-1">
          <div class="flex items-center justify-between gap-2">
            <h4 class="font-bold text-xs sm:text-sm text-slate-900">${notif.title}</h4>
            <span class="text-[10px] text-slate-400 font-medium whitespace-nowrap">${timeAgo}</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">${notif.message}</p>
        </div>

        ${!notif.read ? `
          <button
            onclick="window.NotificationsView.markSingleRead('${notif.id}')"
            class="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 flex-shrink-0"
            title="Mark as read"
          >
            <i data-lucide="check" class="w-4 h-4"></i>
          </button>
        ` : ''}
      </div>
    `;
  },

  formatTimeAgo(isoString) {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  },

  setTab(tab) {
    this.currentTab = tab;
    this.render(document.getElementById('section-notifications'));
  },

  markSingleRead(id) {
    window.saveIQStore.markNotificationAsRead(id);
    this.render(document.getElementById('section-notifications'));
    window.saveIQApp.updateGlobalBadges();
  },

  markAllRead() {
    window.saveIQStore.markAllNotificationsAsRead();
    this.render(document.getElementById('section-notifications'));
    window.saveIQApp.updateGlobalBadges();
    window.saveIQApp.showToast('All notifications marked as read', 'info');
  },

  clearAll() {
    window.saveIQStore.clearAllNotifications();
    this.render(document.getElementById('section-notifications'));
    window.saveIQApp.updateGlobalBadges();
    window.saveIQApp.showToast('Notification history cleared', 'info');
  },

  updatePref(key, value) {
    window.saveIQStore.settings[key] = value;
    window.saveIQStore.saveSettings();
    window.saveIQApp.showToast('Preferences updated', 'success');
  },

  previewReminderEmail() {
    const select = document.getElementById('simulator-goal-select');
    if (!select) return;
    const goalId = select.value;
    const goal = window.saveIQStore.getGoalById(goalId);
    if (!goal) return;

    window.saveIQApp.openEmailPreviewModal(goal);
  },

  simulateSendEmail() {
    const select = document.getElementById('simulator-goal-select');
    if (!select) return;
    const goalId = select.value;
    const goal = window.saveIQStore.getGoalById(goalId);
    if (!goal) return;

    // Add simulated dispatch notification
    window.saveIQStore.addNotification({
      type: 'info',
      title: `Reminder Dispatched: ${goal.name}`,
      message: `Simulated weekly reminder email successfully delivered to ${goal.email} with current balance (₹${goal.saved.toLocaleString('en-IN')} of ₹${goal.target.toLocaleString('en-IN')}).`,
      goalId: goal.id
    });

    window.saveIQApp.showToast(`Test reminder sent to ${goal.email} ✉️`, 'success');
    this.render(document.getElementById('section-notifications'));
  }
};
