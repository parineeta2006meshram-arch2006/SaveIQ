/**
 * SaveIQ - Dashboard View (Indian Rupee - INR)
 * Displays high-level savings KPIs, charts, priority watchlist, and recent activity.
 */

window.DashboardView = {
  categoryChart: null,

  render(container) {
    const store = window.saveIQStore;
    const metrics = store.getDashboardMetrics();

    // Overdue banner if any
    const overdueBannerHTML = metrics.overdueGoals > 0 ? `
      <div class="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="font-bold text-rose-900 text-sm">Action Needed: ${metrics.overdueGoals} Goal${metrics.overdueGoals > 1 ? 's are' : ' is'} Overdue</h4>
            <p class="text-xs text-rose-700">One or more deadlines have passed without reaching full target. Review and revise your plan.</p>
          </div>
        </div>
        <button onclick="window.saveIQApp.navigateTo('my-goals', { filter: 'overdue' })" class="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap">
          <span>Review Overdue</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="max-w-7xl mx-auto space-y-6">
        
        <!-- Welcome Hero & Quick Action -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-slate-950/10 relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="relative z-10 space-y-1">
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
              <span>AI Financial Engine Active</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome back,Parineeta!</h2>
            <p class="text-slate-300 text-sm max-w-xl">
              You are currently <span class="text-emerald-400 font-bold">${metrics.overallProgressPercent}%</span> of the way to funding all your life targets. Keep building steady momentum!
            </p>
          </div>

          <div class="relative z-10 flex flex-wrap gap-2.5 sm:flex-nowrap">
            <button onclick="window.saveIQApp.openDepositModal()" class="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <i data-lucide="arrow-down-circle" class="w-4 h-4"></i>
              <span>Deposit Savings</span>
            </button>
            <button onclick="window.saveIQApp.navigateTo('create-goal')" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 border border-slate-700 transition-all">
              <i data-lucide="plus-circle" class="w-4 h-4 text-emerald-400"></i>
              <span>New Goal</span>
            </button>
          </div>
        </div>

        ${overdueBannerHTML}

        <!-- 5 KPI METRICS CARDS -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          
          <!-- Total Goals -->
          <div class="stat-card bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Goals</span>
              <div class="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <i data-lucide="folder-kanban" class="w-4 h-4"></i>
              </div>
            </div>
            <div>
              <div class="text-2xl sm:text-3xl font-extrabold text-slate-900">${metrics.totalGoals}</div>
              <div class="text-xs text-slate-500 mt-1 font-medium">Target: <span class="font-semibold text-slate-700">₹${metrics.totalTarget.toLocaleString('en-IN')}</span></div>
            </div>
          </div>

          <!-- Active Goals -->
          <div class="stat-card bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Goals</span>
              <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <i data-lucide="flame" class="w-4 h-4"></i>
              </div>
            </div>
            <div>
              <div class="text-2xl sm:text-3xl font-extrabold text-blue-600">${metrics.activeGoals}</div>
              <div class="text-xs text-slate-500 mt-1 font-medium">In progress saving</div>
            </div>
          </div>

          <!-- Completed Goals -->
          <div class="stat-card bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</span>
              <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i data-lucide="check-circle-2" class="w-4 h-4"></i>
              </div>
            </div>
            <div>
              <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600">${metrics.completedGoals}</div>
              <div class="text-xs text-slate-500 mt-1 font-medium">100% funded! 🎉</div>
            </div>
          </div>

          <!-- Overdue Goals -->
          <div class="stat-card bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Overdue</span>
              <div class="w-8 h-8 rounded-xl ${metrics.overdueGoals > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'} flex items-center justify-center">
                <i data-lucide="clock-alert" class="w-4 h-4"></i>
              </div>
            </div>
            <div>
              <div class="text-2xl sm:text-3xl font-extrabold ${metrics.overdueGoals > 0 ? 'text-rose-600' : 'text-slate-400'}">${metrics.overdueGoals}</div>
              <div class="text-xs text-slate-500 mt-1 font-medium">${metrics.overdueGoals > 0 ? 'Missed deadline' : 'All on track'}</div>
            </div>
          </div>

          <!-- Overall Savings Progress -->
          <div class="col-span-2 lg:col-span-1 stat-card bg-gradient-to-br from-emerald-50 to-teal-50/60 p-5 rounded-2xl border border-emerald-200/80 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-emerald-800 uppercase tracking-wider">Overall Progress</span>
              <div class="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-extrabold text-xs">
                ${metrics.overallProgressPercent}%
              </div>
            </div>
            <div>
              <div class="text-2xl sm:text-3xl font-black text-emerald-950">₹${metrics.totalSaved.toLocaleString('en-IN')}</div>
              <div class="text-xs text-emerald-800/80 mt-1 font-medium flex justify-between">
                <span>Remaining</span>
                <span class="font-bold">₹${metrics.totalRemaining.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- PROGRESS BAR HERO STRIP -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
                <i data-lucide="trending-up" class="w-4 h-4 text-emerald-600"></i>
                <span>Overall Savings Trajectory</span>
              </h3>
              <p class="text-xs text-slate-500">Cumulative balance across all ${metrics.totalGoals} goals</p>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-500 font-medium">Saved </span>
              <span class="text-sm font-bold text-emerald-600">₹${metrics.totalSaved.toLocaleString('en-IN')}</span>
              <span class="text-xs text-slate-400 font-medium"> / ₹${metrics.totalTarget.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <div class="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div class="progress-fill h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full" style="width: ${metrics.overallProgressPercent}%"></div>
          </div>

          <div class="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> ${metrics.overallProgressPercent}% Completed</span>
            <span class="font-semibold text-slate-700">₹${metrics.totalRemaining.toLocaleString('en-IN')} to reach 100% financial freedom</span>
          </div>
        </div>

        <!-- TWO COLUMN SECTION: CHARTS & PRIORITY WATCHLIST -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Category Donut Chart (Col 1) -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-bold text-slate-900 text-sm">Savings by Purpose</h3>
                <p class="text-xs text-slate-500">Allocation breakdown across categories</p>
              </div>
              <div class="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                <i data-lucide="pie-chart" class="w-4 h-4"></i>
              </div>
            </div>

            <div class="relative flex-1 flex items-center justify-center min-h-[200px]">
              <canvas id="categoryDonutChart" class="max-h-52"></canvas>
            </div>

            <div id="category-legend" class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <!-- Dynamically filled below -->
            </div>
          </div>

          <!-- Priority Watchlist (Col 2 & 3) -->
          <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
                    <i data-lucide="clock" class="w-4 h-4 text-emerald-600"></i>
                    <span>Upcoming Deadlines & Priority Watchlist</span>
                  </h3>
                  <p class="text-xs text-slate-500">Goals requiring your focus based on due dates</p>
                </div>
                <button onclick="window.saveIQApp.navigateTo('my-goals')" class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                  <span>View All</span>
                  <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                </button>
              </div>

              <!-- List of closest goals -->
              <div class="space-y-3">
                ${metrics.priorityGoals.length > 0 ? metrics.priorityGoals.map(goal => `
                  <div class="p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-sm text-slate-900">${goal.name}</span>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${goal.countdownBadgeClass}">
                          ${goal.countdownText}
                        </span>
                      </div>
                      <div class="text-xs text-slate-500 flex items-center gap-3">
                        <span>Saved: <strong class="text-slate-800">₹${goal.saved.toLocaleString('en-IN')}</strong> of ₹${goal.target.toLocaleString('en-IN')}</span>
                        <span>•</span>
                        <span>Remaining: <strong class="text-slate-800">₹${goal.remaining.toLocaleString('en-IN')}</strong></span>
                      </div>
                    </div>

                    <div class="flex items-center gap-3">
                      <div class="w-24 sm:w-28 text-right">
                        <div class="text-xs font-bold text-slate-700">${goal.progressPercent}%</div>
                        <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                          <div class="h-full bg-emerald-500 rounded-full" style="width: ${goal.progressPercent}%"></div>
                        </div>
                      </div>
                      <button onclick="window.saveIQApp.openDepositModal('${goal.id}')" class="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 shadow-sm transition-colors whitespace-nowrap">
                        <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                `).join('') : `
                  <div class="p-8 text-center text-slate-400 text-sm">
                    No active or overdue goals found. Create your first goal to get started!
                  </div>
                `}
              </div>
            </div>

            <!-- Quick AI Insight Banner at bottom of watchlist -->
            <div class="mt-4 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                  <i data-lucide="bot" class="w-3.5 h-3.5"></i>
                </div>
                <p class="text-xs text-indigo-950 font-medium">
                  <strong>SaveIQ Coach:</strong> Check out your personalized monthly pace recommendations in the AI Advisor.
                </p>
              </div>
              <button onclick="window.saveIQApp.navigateTo('ai-advice')" class="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 whitespace-nowrap">
                Get Advice
              </button>
            </div>
          </div>

        </div>

        <!-- RECENT SAVINGS ACTIVITY FEED -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-slate-900 text-base">Recent Savings Transactions</h3>
              <p class="text-xs text-slate-500">Deposits logged towards your goals</p>
            </div>
            <button onclick="window.saveIQApp.openDepositModal()" class="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              + Log New Deposit
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th class="pb-3 font-semibold">Goal Name</th>
                  <th class="pb-3 font-semibold">Date</th>
                  <th class="pb-3 font-semibold">Note</th>
                  <th class="pb-3 font-semibold text-right">Amount Deposited</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${metrics.recentActivity.length > 0 ? metrics.recentActivity.map(item => `
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-3 font-bold text-slate-800 flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span>${item.goalName}</span>
                    </td>
                    <td class="py-3 text-slate-500">${item.date}</td>
                    <td class="py-3 text-slate-600">${item.note || 'Manual Deposit'}</td>
                    <td class="py-3 font-bold text-emerald-600 text-right">+₹${item.amount.toLocaleString('en-IN')}</td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="4" class="py-6 text-center text-slate-400">No deposits recorded yet.</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    // Render Lucide Icons
    if (window.lucide) window.lucide.createIcons();

    // Render Category Chart
    this.renderCategoryChart(metrics.categoryMap);
  },

  renderCategoryChart(categoryMap) {
    const canvas = document.getElementById('categoryDonutChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }

    const categories = Object.keys(categoryMap);
    const amounts = categories.map(c => categoryMap[c].saved);

    const colors = [
      '#10b981', // emerald
      '#06b6d4', // cyan
      '#6366f1', // indigo
      '#f59e0b', // amber
      '#ec4899', // pink
      '#8b5cf6', // violet
      '#64748b'  // slate
    ];

    // Fallback if no goals
    if (categories.length === 0) {
      categories.push('No goals');
      amounts.push(1);
      colors[0] = '#e2e8f0';
    }

    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          data: amounts,
          backgroundColor: colors.slice(0, categories.length),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const val = context.parsed || 0;
                return ` ${label}: ₹${val.toLocaleString('en-IN')} saved`;
              }
            }
          }
        },
        cutout: '72%'
      }
    });

    // Populate legend container
    const legendContainer = document.getElementById('category-legend');
    if (legendContainer && categories.length > 0 && categories[0] !== 'No goals') {
      legendContainer.innerHTML = categories.map((cat, idx) => `
        <div class="flex items-center gap-1.5 truncate">
          <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: ${colors[idx % colors.length]}"></span>
          <span class="text-slate-600 truncate">${cat}</span>
          <span class="ml-auto font-bold text-slate-900">₹${categoryMap[cat].saved.toLocaleString('en-IN')}</span>
        </div>
      `).join('');
    }
  }
};
