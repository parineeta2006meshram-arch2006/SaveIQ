/**
 * SaveIQ - AI Financial Advice View (Indian Rupee - INR)
 * Dynamic AI goal-aware health audits, personalized guidance, and interactive AI chat simulator.
 */

window.AiAdviceView = {
  chatMessages: [
    {
      sender: 'ai',
      text: 'Namaste Parineeta! I am your **SaveIQ Financial Coach**. I have analyzed your 4 active goals and overall savings progress (₹6,23,000 saved of ₹10,10,000 total target). How can I help you accelerate your financial goals today?'
    }
  ],

  render(container) {
    const store = window.saveIQStore;
    const allGoals = store.getAllGoals();
    const metrics = store.getDashboardMetrics();

    // Compute tailored insights based on live goal data
    const insights = this.generateGoalInsights(allGoals, metrics);

    container.innerHTML = `
      <div class="max-w-7xl mx-auto space-y-8">
        
        <!-- Header Hero Banner -->
        <div class="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div class="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="relative z-10 max-w-3xl space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
              <span>SaveIQ Intelligent Advisory Engine</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Personalized Financial Guidance & Strategy
            </h2>
            <p class="text-slate-300 text-sm leading-relaxed">
              Our AI evaluates your active deadlines, target balances in Rupees, and deposit velocity to recommend tailored monthly allocations and risk-reduction strategies.
            </p>
          </div>
        </div>

        <!-- DYNAMIC AI AUDIT CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Insight 1: Urgent Deadline / Overdue Alert -->
          <div class="p-6 rounded-3xl bg-white border ${insights.alertBorder} shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl ${insights.alertBg} flex items-center justify-center">
                  <i data-lucide="${insights.alertIcon}" class="w-5 h-5 ${insights.alertText}"></i>
                </div>
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Pace & Feasibility</span>
              </div>
              <h3 class="font-extrabold text-base text-slate-900">${insights.alertTitle}</h3>
              <p class="text-xs text-slate-600 leading-relaxed">${insights.alertBody}</p>
            </div>
            <div class="pt-3 border-t border-slate-100">
              <button onclick="window.AiAdviceView.askPresetQuestion('${insights.alertQuestion}')" class="text-xs font-bold ${insights.alertActionText} hover:underline flex items-center gap-1">
                <span>Ask Coach for Resolution</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- Insight 2: Recommended Monthly Commitment -->
          <div class="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <i data-lucide="calculator" class="w-5 h-5"></i>
                </div>
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Optimal Savings Pace</span>
              </div>
              <h3 class="font-extrabold text-base text-slate-900">₹${insights.recommendedMonthlyTotal.toLocaleString('en-IN')}/mo to Hit All Goals</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                To fulfill your active targets (MacBook Pro & Emergency Buffer) on time, set aside roughly <strong>₹${insights.recommendedMonthlyTotal.toLocaleString('en-IN')} each month</strong> (~₹${Math.round(insights.recommendedMonthlyTotal / 4.3).toLocaleString('en-IN')}/week).
              </p>
            </div>
            <div class="pt-3 border-t border-slate-100">
              <button onclick="window.AiAdviceView.askPresetQuestion('Create a step-by-step monthly budget plan for my remaining goals')" class="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                <span>Generate Budget Breakdown</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

          <!-- Insight 3: Financial Hierarchy Priority -->
          <div class="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <i data-lucide="shield-check" class="w-5 h-5"></i>
                </div>
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Hierarchy Recommendation</span>
              </div>
              <h3 class="font-extrabold text-base text-slate-900">Prioritize Emergency Safety Net</h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Maintain 70% of discretionary savings toward your Emergency buffer until it reaches ₹5,00,000, and 30% towards gadget purchases to avoid expensive debt.
              </p>
            </div>
            <div class="pt-3 border-t border-slate-100">
              <button onclick="window.AiAdviceView.askPresetQuestion('Why should I prioritize my Emergency Fund over tech gadgets?')" class="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                <span>View Strategy Details</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>

        </div>

        <!-- INTERACTIVE AI ADVISOR CHAT & 50/30/20 CALCULATOR (2 cols) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- LEFT: INTERACTIVE AI CHAT ENGINE (7 cols) -->
          <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[580px] overflow-hidden">
            
            <!-- Chat Header -->
            <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                  <i data-lucide="bot" class="w-5 h-5"></i>
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>SaveIQ AI Advisor</span>
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </h3>
                  <p class="text-[11px] text-slate-500">Trained on wealth-building & goal prioritization principles</p>
                </div>
              </div>
              <button onclick="window.AiAdviceView.clearChat()" class="text-xs text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1">
                <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                <span>Restart</span>
              </button>
            </div>

            <!-- Chat Messages Container -->
            <div id="ai-chat-messages" class="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              ${this.chatMessages.map(msg => this.renderMessage(msg)).join('')}
            </div>

            <!-- Quick Prompt Suggestions Bar -->
            <div class="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
              <span class="text-[10px] uppercase font-bold text-slate-400 flex-shrink-0">Suggestions:</span>
              <button onclick="window.AiAdviceView.askPresetQuestion('How can I reach my goals 20% faster?')" class="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 whitespace-nowrap font-medium transition-colors">
                ⚡ Save 20% faster
              </button>
              <button onclick="window.AiAdviceView.askPresetQuestion('Should I fund Emergency Fund or MacBook first?')" class="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 whitespace-nowrap font-medium transition-colors">
                🛡️ Goal Priority
              </button>
              <button onclick="window.AiAdviceView.askPresetQuestion('What should I do about my overdue Home Office goal?')" class="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 whitespace-nowrap font-medium transition-colors">
                ⚠️ Fix Overdue Goal
              </button>
            </div>

            <!-- Chat Input Form -->
            <form onsubmit="window.AiAdviceView.handleSend(event)" class="p-3 sm:p-4 border-t border-slate-100 bg-white flex items-center gap-2">
              <input
                type="text"
                id="ai-chat-input"
                placeholder="Ask about savings strategies, budgeting, or goal deadlines..."
                class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>Send</span>
                <i data-lucide="send" class="w-3.5 h-3.5"></i>
              </button>
            </form>

          </div>

          <!-- RIGHT: FINANCIAL PLAYBOOKS & 50/30/20 CALCULATOR (5 cols) -->
          <div class="lg:col-span-5 space-y-6">
            
            <!-- Interactive 50/30/20 Budget Tool -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <i data-lucide="pie-chart" class="w-4 h-4 text-emerald-600"></i>
                    <span>50/30/20 Savings Allocator</span>
                  </h3>
                  <p class="text-xs text-slate-500">Calculate how much you can allocate to your SaveIQ targets</p>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Monthly After-Tax Income (₹)</label>
                <div class="relative">
                  <span class="absolute left-3.5 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    id="income-input"
                    value="80000"
                    step="1000"
                    min="10000"
                    class="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    oninput="window.AiAdviceView.calculateBudget()"
                  />
                </div>
              </div>

              <!-- Breakdown Grid -->
              <div class="grid grid-cols-3 gap-2 text-center text-xs">
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span class="text-[10px] uppercase font-bold text-slate-400">Needs (50%)</span>
                  <div id="budget-needs" class="font-black text-slate-800 text-sm mt-0.5">₹40,000</div>
                  <span class="text-[10px] text-slate-400">Rent, Groceries, Bills</span>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span class="text-[10px] uppercase font-bold text-slate-400">Wants (30%)</span>
                  <div id="budget-wants" class="font-black text-slate-800 text-sm mt-0.5">₹24,000</div>
                  <span class="text-[10px] text-slate-400">Dining, Hobbies</span>
                </div>
                <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span class="text-[10px] uppercase font-bold text-emerald-700">SaveIQ (20%)</span>
                  <div id="budget-savings" class="font-black text-emerald-800 text-sm mt-0.5">₹16,000</div>
                  <span class="text-[10px] text-emerald-600 font-semibold">Goal Deposits</span>
                </div>
              </div>

              <div id="budget-verdict" class="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-100 leading-relaxed font-medium">
                At ₹80,000/mo income, your 20% savings capacity is <strong>₹16,000/month</strong> (~₹3,721/week) for your SaveIQ goals.
              </div>
            </div>

            <!-- Savings Rule Cards -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 class="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <i data-lucide="book-open" class="w-4 h-4 text-indigo-600"></i>
                <span>Smart Saving Rules for Beginners</span>
              </h3>

              <div class="space-y-3 text-xs">
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div class="font-bold text-slate-800">The 72-Hour Impulse Rule</div>
                  <p class="text-slate-500">Wait 72 hours before non-essential purchases over ₹3,000. If you still want it, deposit 20% of the item cost into your SaveIQ fund first!</p>
                </div>

                <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div class="font-bold text-slate-800">Pay Yourself First (Reverse Budgeting)</div>
                  <p class="text-slate-500">Deposit your goal contribution the moment your salary is credited, rather than saving whatever happens to be left over at month end.</p>
                </div>
              </div>
            </div>

            <!-- API Integration Note -->
            <div class="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-[11px] text-indigo-900/80 flex items-center gap-2.5">
              <i data-lucide="info" class="w-4 h-4 text-indigo-600 flex-shrink-0"></i>
              <span>SaveIQ AI Advisor runs on an internal financial intelligence model. Direct Groq / Gemini LLM endpoint connectors are staged for Phase 2.</span>
            </div>

          </div>

        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.calculateBudget();
  },

  generateGoalInsights(goals, metrics) {
    const overdue = goals.find(g => g.status === 'overdue');
    const active = goals.filter(g => g.status === 'active');

    // Total required monthly savings for all active goals
    const totalMonthly = active.reduce((acc, g) => acc + (g.monthlyRate || 0), 0);

    if (overdue) {
      return {
        alertTitle: `Goal Overdue: ${overdue.name}`,
        alertBody: `This goal was due ${Math.abs(overdue.diffDays)} days ago with ₹${overdue.remaining.toLocaleString('en-IN')} remaining. Adjusting your target deadline by 45 days would normalize your required savings to ₹${Math.round(overdue.remaining / 1.5).toLocaleString('en-IN')}/month.`,
        alertIcon: 'alert-circle',
        alertBg: 'bg-rose-50',
        alertText: 'text-rose-600',
        alertBorder: 'border-rose-200',
        alertActionText: 'text-rose-600',
        alertQuestion: `How should I handle my overdue ${overdue.name} goal?`,
        recommendedMonthlyTotal: Math.max(15000, totalMonthly)
      };
    }

    return {
      alertTitle: 'All Active Goals On Schedule',
      alertBody: 'Your deadlines are well-spaced and your current progress is on a healthy velocity. Continue consistent weekly contributions to avoid last-minute crunches.',
      alertIcon: 'check-circle-2',
      alertBg: 'bg-emerald-50',
      alertText: 'text-emerald-600',
      alertBorder: 'border-slate-200/80',
      alertActionText: 'text-emerald-600',
      alertQuestion: 'How can I optimize my savings velocity even further?',
      recommendedMonthlyTotal: Math.max(15000, totalMonthly)
    };
  },

  renderMessage(msg) {
    const isAi = msg.sender === 'ai';
    return `
      <div class="flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}">
        <div class="w-7 h-7 rounded-lg ${isAi ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'} flex items-center justify-center flex-shrink-0 text-xs font-bold">
          ${isAi ? '<i data-lucide="bot" class="w-4 h-4"></i>' : 'AM'}
        </div>
        <div class="max-w-[85%] p-3.5 rounded-2xl ${isAi ? 'bg-slate-100 text-slate-800 rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm'} leading-relaxed space-y-1.5 shadow-2xs">
          ${this.formatMarkdown(msg.text)}
        </div>
      </div>
    `;
  },

  formatMarkdown(text) {
    // Lightweight markdown parser for bold, bullets, linebreaks
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
    return formatted;
  },

  handleSend(e) {
    e.preventDefault();
    const input = document.getElementById('ai-chat-input');
    if (!input || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = '';

    this.processUserQuery(userText);
  },

  askPresetQuestion(question) {
    this.processUserQuery(question);
  },

  processUserQuery(userText) {
    // Add User message
    this.chatMessages.push({ sender: 'user', text: userText });
    this.updateChatUI();

    // Generate intelligent contextual AI response based on goals data
    setTimeout(() => {
      const reply = this.generateAiResponse(userText);
      this.chatMessages.push({ sender: 'ai', text: reply });
      this.updateChatUI();
    }, 450);
  },

  generateAiResponse(query) {
    const q = query.toLowerCase();
    const store = window.saveIQStore;
    const allGoals = store.getAllGoals();
    const metrics = store.getDashboardMetrics();

    if (q.includes('faster') || q.includes('20%') || q.includes('accelerate')) {
      return `To reach your targets **20% faster**, here are 3 targeted moves:
1. **Automate Weekly Micro-Transfers**: Move from monthly deposits to depositing **₹5,000 every Friday**. Users who save weekly encounter fewer spending temptations.
2. **Assign Windfalls Immediately**: Allocate 50% of any unexpected cash (Diwali bonus, tax refunds, freelance gigs, gifts) directly to your *Emergency Safety Net*.
3. **Trim Recurring Subscriptions**: Auditing redundant streaming apps and memberships typically recovers **₹2,500–₹5,000/month**, which cuts 18 days off your *MacBook Pro* deadline!`;
    }

    if (q.includes('overdue') || q.includes('home office')) {
      const overdue = allGoals.find(g => g.status === 'overdue');
      const goalName = overdue ? overdue.name : 'Home Office Standing Desk';
      const remaining = overdue ? overdue.remaining : 42000;
      return `For your **${goalName}** (which is currently overdue with ₹${remaining.toLocaleString('en-IN')} remaining):
- **Option A (Recommended)**: Extend your target deadline by **45 to 60 days**. This lowers the required pace to a very manageable **₹3,500/week** without straining your other commitments.
- **Option B (Milestone Split)**: Fund the most critical piece first (e.g. ₹15,000 motorized frame) before adding accessories.`;
    }

    if (q.includes('prioritize') || q.includes('macbook') || q.includes('emergency')) {
      return `**Prioritization Strategy: Safety First, Upgrades Second**
- Your *Emergency Safety Net* is currently at **65% (₹3,25,000 / ₹5,00,000)**.
- **Rule of Thumb**: Until you have at least 3 months of essential buffer in place, allocate **70% of your available savings to Emergency** and **30% to tech gadgets**.
- This protects you from having to take personal loans or credit card debt if an unexpected medical emergency or vehicle repair arrives!`;
    }

    if (q.includes('budget') || q.includes('plan')) {
      return `Here is your customized **Monthly Savings Blueprint**:
- **Total active savings needed**: ~₹46,500/month
- **Allocation breakdown**:
  - *Emergency Safety Net*: ₹29,167/month (due in 6 months)
  - *MacBook Pro M3*: ₹18,889/month (due in 3 months)
- If your monthly disposable surplus is ₹50,000, you have a **₹3,500 buffer** for leisure or unexpected minor expenses!`;
    }

    // Generic intelligent financial response
    return `Great financial question! Looking at your current portfolio:
- You have **${metrics.activeGoals} active goals** with an overall completion of **${metrics.overallProgressPercent}%**.
- Total remaining to be saved is **₹${metrics.totalRemaining.toLocaleString('en-IN')}**.
- The most effective strategy right now is to maintain steady deposits toward your highest priority target while keeping non-essential impulse spending capped via the 72-hour rule. Let me know if you would like me to adjust any specific goal timeline!`;
  },

  updateChatUI() {
    const container = document.getElementById('ai-chat-messages');
    if (!container) return;

    container.innerHTML = this.chatMessages.map(msg => this.renderMessage(msg)).join('');
    if (window.lucide) window.lucide.createIcons();
    container.scrollTop = container.scrollHeight;
  },

  clearChat() {
    this.chatMessages = [
      {
        sender: 'ai',
        text: 'Chat history reset. How can I assist your financial planning today?'
      }
    ];
    this.updateChatUI();
  },

  calculateBudget() {
    const income = Number(document.getElementById('income-input')?.value) || 80000;
    const needs = Math.round(income * 0.50);
    const wants = Math.round(income * 0.30);
    const savings = Math.round(income * 0.20);

    const elNeeds = document.getElementById('budget-needs');
    const elWants = document.getElementById('budget-wants');
    const elSavings = document.getElementById('budget-savings');
    const elVerdict = document.getElementById('budget-verdict');

    if (elNeeds) elNeeds.textContent = `₹${needs.toLocaleString('en-IN')}`;
    if (elWants) elWants.textContent = `₹${wants.toLocaleString('en-IN')}`;
    if (elSavings) elSavings.textContent = `₹${savings.toLocaleString('en-IN')}`;

    if (elVerdict) {
      elVerdict.innerHTML = `At <strong>₹${income.toLocaleString('en-IN')}/mo</strong> income, your 20% savings capacity is <strong class="text-emerald-700 font-bold">₹${savings.toLocaleString('en-IN')}/month</strong> (~₹${Math.round(savings / 4.3).toLocaleString('en-IN')}/week) for your SaveIQ goals.`;
    }
  }
};
