/**
 * SaveIQ - My Goals View (Indian Rupee - INR)
 * Interactive grid/list display of goals showing Target, Saved, Remaining, Deadline, and Progress %.
 */

window.MyGoalsView = {
  currentFilter: 'all',
  currentCategory: 'all',
  currentSort: 'deadline-asc',
  currentSearch: '',
  viewMode: 'grid', // 'grid' or 'list'

  render(container, options = {}) {
    if (options.filter) {
      this.currentFilter = options.filter;
    }

    const store = window.saveIQStore;
    const allGoals = store.getAllGoals();

    // Filter goals
    let filtered = allGoals.filter(goal => {
      // Status filter
      if (this.currentFilter !== 'all' && goal.status !== this.currentFilter) {
        return false;
      }
      // Category filter
      if (this.currentCategory !== 'all' && goal.purpose !== this.currentCategory) {
        return false;
      }
      // Search filter
      if (this.currentSearch.trim()) {
        const query = this.currentSearch.toLowerCase();
        const matchName = goal.name.toLowerCase().includes(query);
        const matchPurpose = goal.purpose.toLowerCase().includes(query);
        const matchNotes = (goal.notes || '').toLowerCase().includes(query);
        if (!matchName && !matchPurpose && !matchNotes) return false;
      }
      return true;
    });

    // Sort goals
    filtered.sort((a, b) => {
      switch (this.currentSort) {
        case 'deadline-asc':
          return a.diffDays - b.diffDays;
        case 'deadline-desc':
          return b.diffDays - a.diffDays;
        case 'progress-desc':
          return b.progressPercent - a.progressPercent;
        case 'progress-asc':
          return a.progressPercent - b.progressPercent;
        case 'target-desc':
          return b.target - a.target;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    // Extract unique categories for dropdown
    const categories = Array.from(new Set(allGoals.map(g => g.purpose)));

    // Counts for filter pills
    const countAll = allGoals.length;
    const countActive = allGoals.filter(g => g.status === 'active').length;
    const countCompleted = allGoals.filter(g => g.status === 'completed').length;
    const countOverdue = allGoals.filter(g => g.status === 'overdue').length;

    container.innerHTML = `
      <div class="max-w-7xl mx-auto space-y-6">
        
        <!-- Header & Action Row -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <i data-lucide="target" class="w-6 h-6 text-emerald-600"></i>
              <span>My Savings Goals</span>
            </h2>
            <p class="text-xs sm:text-sm text-slate-500">Track and manage individual targets, balances, and completion pacing.</p>
          </div>
          
          <div class="flex items-center gap-2.5">
            <button onclick="window.saveIQApp.openDepositModal()" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors">
              <i data-lucide="arrow-down-circle" class="w-4 h-4 text-emerald-600"></i>
              <span>Quick Deposit</span>
            </button>
            <button onclick="window.saveIQApp.navigateTo('create-goal')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span>New Goal</span>
            </button>
          </div>
        </div>

        <!-- FILTER & CONTROLS TOOLBAR -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          
          <!-- Top row: Search, Category, Sort, and View Switcher -->
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            
            <!-- Search Bar (5 cols) -->
            <div class="sm:col-span-5 relative">
              <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
              <input
                type="text"
                placeholder="Search goals by name or category..."
                value="${this.currentSearch}"
                class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                oninput="window.MyGoalsView.handleSearch(event)"
              />
            </div>

            <!-- Category Filter (3 cols) -->
            <div class="sm:col-span-3">
              <select
                class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                onchange="window.MyGoalsView.handleCategoryChange(event)"
              >
                <option value="all" ${this.currentCategory === 'all' ? 'selected' : ''}>All Categories (${countAll})</option>
                ${categories.map(c => `<option value="${c}" ${this.currentCategory === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>

            <!-- Sort By (3 cols) -->
            <div class="sm:col-span-3">
              <select
                class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                onchange="window.MyGoalsView.handleSortChange(event)"
              >
                <option value="deadline-asc" ${this.currentSort === 'deadline-asc' ? 'selected' : ''}>Deadline (Soonest first)</option>
                <option value="deadline-desc" ${this.currentSort === 'deadline-desc' ? 'selected' : ''}>Deadline (Furthest first)</option>
                <option value="progress-desc" ${this.currentSort === 'progress-desc' ? 'selected' : ''}>Progress % (High to Low)</option>
                <option value="progress-asc" ${this.currentSort === 'progress-asc' ? 'selected' : ''}>Progress % (Low to High)</option>
                <option value="target-desc" ${this.currentSort === 'target-desc' ? 'selected' : ''}>Target Amount (₹)</option>
                <option value="name-asc" ${this.currentSort === 'name-asc' ? 'selected' : ''}>Goal Name (A-Z)</option>
              </select>
            </div>

            <!-- View Toggle Grid/List (1 col) -->
            <div class="sm:col-span-1 flex justify-end">
              <div class="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                <button onclick="window.MyGoalsView.setViewMode('grid')" class="p-1.5 rounded-md ${this.viewMode === 'grid' ? 'bg-white shadow-xs text-emerald-600' : 'text-slate-400 hover:text-slate-600'}" title="Grid View">
                  <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="window.MyGoalsView.setViewMode('list')" class="p-1.5 rounded-md ${this.viewMode === 'list' ? 'bg-white shadow-xs text-emerald-600' : 'text-slate-400 hover:text-slate-600'}" title="List View">
                  <i data-lucide="list" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>

          </div>

          <!-- Bottom row: Status Pills (All, Active, Completed, Overdue) -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
            <button
              onclick="window.MyGoalsView.setFilter('all')"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${this.currentFilter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
            >
              All Goals (${countAll})
            </button>
            <button
              onclick="window.MyGoalsView.setFilter('active')"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${this.currentFilter === 'active' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}"
            >
              Active (${countActive})
            </button>
            <button
              onclick="window.MyGoalsView.setFilter('completed')"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${this.currentFilter === 'completed' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}"
            >
              Completed (${countCompleted})
            </button>
            <button
              onclick="window.MyGoalsView.setFilter('overdue')"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${this.currentFilter === 'overdue' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}"
            >
              Overdue (${countOverdue})
            </button>
          </div>

        </div>

        <!-- GOALS LIST / GRID CONTAINER -->
        ${filtered.length === 0 ? `
          <div class="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3 shadow-sm">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <i data-lucide="inbox" class="w-6 h-6"></i>
            </div>
            <h3 class="font-bold text-slate-800 text-base">No goals found</h3>
            <p class="text-xs text-slate-500">No savings goals match your active filters or search term.</p>
            <div class="pt-2 flex justify-center gap-2">
              <button onclick="window.MyGoalsView.resetFilters()" class="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200">
                Clear Filters
              </button>
              <button onclick="window.saveIQApp.navigateTo('create-goal')" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500">
                Create Goal
              </button>
            </div>
          </div>
        ` : this.viewMode === 'grid' ? `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filtered.map(goal => this.renderGoalCard(goal)).join('')}
          </div>
        ` : `
          <div class="space-y-3">
            ${filtered.map(goal => this.renderGoalListItem(goal)).join('')}
          </div>
        `}

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  renderGoalCard(goal) {
    const isCompleted = goal.status === 'completed';
    const isOverdue = goal.status === 'overdue';

    // Status pill styling
    let statusPillClass = 'bg-blue-50 text-blue-700 border-blue-200';
    let statusPillText = 'Active';
    if (isCompleted) {
      statusPillClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      statusPillText = 'Completed';
    } else if (isOverdue) {
      statusPillClass = 'bg-rose-50 text-rose-700 border-rose-200';
      statusPillText = 'Overdue';
    }

    return `
      <div class="goal-card bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden">
        
        <!-- Top Row: Category & Status Badge -->
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1.5">
              <span>${goal.purpose}</span>
            </span>
            <span class="text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusPillClass}">
              ${statusPillText}
            </span>
          </div>

          <!-- Goal Name & Notes -->
          <h3 class="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-snug line-clamp-1" title="${goal.name}">
            ${goal.name}
          </h3>
          <p class="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[32px]">
            ${goal.notes || 'No description added.'}
          </p>

          <!-- Core Display Metrics Required: Target, Saved, Remaining, Deadline, Progress % -->
          <div class="mt-4 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target</span>
              <div class="font-black text-xs sm:text-sm text-slate-900 mt-0.5">₹${goal.target.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Saved</span>
              <div class="font-black text-xs sm:text-sm text-emerald-600 mt-0.5">₹${goal.saved.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Remaining</span>
              <div class="font-black text-xs sm:text-sm text-slate-700 mt-0.5">₹${goal.remaining.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <!-- Progress Percentage & Bar -->
          <div class="mt-4 space-y-1.5">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-medium">Progress</span>
              <span class="font-bold ${isCompleted ? 'text-emerald-600' : 'text-slate-800'}">${goal.progressPercent}%</span>
            </div>
            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div class="h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : isOverdue ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}" style="width: ${goal.progressPercent}%"></div>
            </div>
          </div>

          <!-- Deadline Display -->
          <div class="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div class="flex items-center gap-1.5 text-slate-500">
              <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
              <span>Deadline:</span>
              <span class="font-semibold text-slate-700">${goal.deadline}</span>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${goal.countdownBadgeClass}">
              ${goal.countdownText}
            </span>
          </div>
        </div>

        <!-- Card Bottom Actions -->
        <div class="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          
          <button
            onclick="window.saveIQApp.openDepositModal('${goal.id}')"
            class="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>Add Funds</span>
          </button>

          <div class="flex items-center gap-1">
            <button
              onclick="window.saveIQApp.openEditGoalModal('${goal.id}')"
              class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Edit Goal"
            >
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </button>
            <button
              onclick="window.saveIQApp.confirmDeleteGoal('${goal.id}')"
              class="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Goal"
            >
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>

        </div>

      </div>
    `;
  },

  renderGoalListItem(goal) {
    const isCompleted = goal.status === 'completed';
    const isOverdue = goal.status === 'overdue';

    return `
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-slate-300 transition-all">
        
        <!-- Left details -->
        <div class="lg:w-1/3 space-y-1">
          <div class="flex items-center gap-2">
            <span class="font-extrabold text-sm sm:text-base text-slate-900">${goal.name}</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${goal.countdownBadgeClass}">
              ${goal.countdownText}
            </span>
          </div>
          <p class="text-xs text-slate-500 truncate">${goal.purpose} • ${goal.email}</p>
        </div>

        <!-- Middle financial values -->
        <div class="grid grid-cols-3 gap-3 text-center lg:w-1/3 py-2 sm:py-0 border-y lg:border-y-0 lg:border-x border-slate-100 px-3">
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-400">Target</span>
            <div class="font-black text-xs sm:text-sm text-slate-900">₹${goal.target.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-400">Saved</span>
            <div class="font-black text-xs sm:text-sm text-emerald-600">₹${goal.saved.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-400">Remaining</span>
            <div class="font-black text-xs sm:text-sm text-slate-700">₹${goal.remaining.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <!-- Right progress & actions -->
        <div class="lg:w-1/3 flex items-center justify-between sm:justify-end gap-4">
          <div class="w-28 text-right">
            <div class="text-xs font-bold text-slate-800">${goal.progressPercent}%</div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
              <div class="h-full ${isCompleted ? 'bg-emerald-500' : isOverdue ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full" style="width: ${goal.progressPercent}%"></div>
            </div>
            <div class="text-[10px] text-slate-400 mt-1">Due ${goal.deadline}</div>
          </div>

          <div class="flex items-center gap-1.5">
            <button
              onclick="window.saveIQApp.openDepositModal('${goal.id}')"
              class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
            >
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>Deposit</span>
            </button>
            <button
              onclick="window.saveIQApp.openEditGoalModal('${goal.id}')"
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </button>
            <button
              onclick="window.saveIQApp.confirmDeleteGoal('${goal.id}')"
              class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            >
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

      </div>
    `;
  },

  handleSearch(e) {
    this.currentSearch = e.target.value;
    this.render(document.getElementById('section-my-goals'));
  },

  handleCategoryChange(e) {
    this.currentCategory = e.target.value;
    this.render(document.getElementById('section-my-goals'));
  },

  handleSortChange(e) {
    this.currentSort = e.target.value;
    this.render(document.getElementById('section-my-goals'));
  },

  setFilter(filter) {
    this.currentFilter = filter;
    this.render(document.getElementById('section-my-goals'));
  },

  setViewMode(mode) {
    this.viewMode = mode;
    this.render(document.getElementById('section-my-goals'));
  },

  resetFilters() {
    this.currentFilter = 'all';
    this.currentCategory = 'all';
    this.currentSearch = '';
    this.currentSort = 'deadline-asc';
    this.render(document.getElementById('section-my-goals'));
  }
};
