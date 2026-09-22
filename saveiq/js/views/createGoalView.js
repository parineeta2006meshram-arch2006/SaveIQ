/**
 * SaveIQ - Create Savings Goal View (Indian Rupee - INR)
 * Guided form with real-time reactive preview card and feasibility calculation.
 */

window.CreateGoalView = {
  render(container) {
    // Default deadline 6 months out
    const defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() + 6);
    const defaultDeadlineStr = defaultDate.toISOString().split('T')[0];

    container.innerHTML = `
      <div class="max-w-6xl mx-auto space-y-6">
        
        <!-- Header Breadcrumb / Title -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <i data-lucide="plus-circle" class="w-6 h-6 text-emerald-600"></i>
              <span>Create New Savings Goal</span>
            </h2>
            <p class="text-xs sm:text-sm text-slate-500">Set a clear target in Rupees, deadline, and reminder email to stay on track.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400 font-medium">Quick Template:</span>
            <button type="button" onclick="window.CreateGoalView.applyPreset('emergency')" class="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
              🛡️ Emergency Fund
            </button>
            <button type="button" onclick="window.CreateGoalView.applyPreset('vacation')" class="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
              ✈️ Dream Vacation
            </button>
          </div>
        </div>

        <!-- TWO COLUMN FORM & PREVIEW -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- LEFT COLUMN: INPUT FORM (7 cols) -->
          <div class="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <form id="form-create-goal" onsubmit="window.CreateGoalView.handleSubmit(event)" class="space-y-5">
              
              <!-- Goal Name -->
              <div>
                <label for="goal-name" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Goal Name <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <input
                    type="text"
                    id="goal-name"
                    required
                    placeholder="e.g., Emergency Buffer, Ladakh Bike Tour, EV Car Down Payment"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                    oninput="window.CreateGoalView.updatePreview()"
                  />
                </div>
              </div>

              <!-- Target Amount & Initial Savings (2-col) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="goal-target" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Amount (₹) <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      id="goal-target"
                      required
                      min="1"
                      step="1"
                      placeholder="250000"
                      class="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                      oninput="window.CreateGoalView.updatePreview()"
                    />
                  </div>
                </div>

                <div>
                  <label for="goal-saved" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current / Initial Savings (₹)
                  </label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      id="goal-saved"
                      min="0"
                      step="1"
                      placeholder="25000"
                      value="0"
                      class="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                      oninput="window.CreateGoalView.updatePreview()"
                    />
                  </div>
                  <span class="text-[11px] text-slate-400 mt-1 block">Starting amount you already have set aside</span>
                </div>
              </div>

              <!-- Deadline with Quick Shortcuts -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label for="goal-deadline" class="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Target Deadline <span class="text-rose-500">*</span>
                  </label>
                  <div class="flex items-center gap-1.5 text-xs text-slate-500">
                    <button type="button" onclick="window.CreateGoalView.setDeadlineMonths(3)" class="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">+3 Mos</button>
                    <button type="button" onclick="window.CreateGoalView.setDeadlineMonths(6)" class="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">+6 Mos</button>
                    <button type="button" onclick="window.CreateGoalView.setDeadlineMonths(12)" class="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">+1 Year</button>
                  </div>
                </div>
                <input
                  type="date"
                  id="goal-deadline"
                  required
                  value="${defaultDeadlineStr}"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  onchange="window.CreateGoalView.updatePreview()"
                />
              </div>

              <!-- Purpose & Category -->
              <div>
                <label for="goal-purpose" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Goal Purpose / Category <span class="text-rose-500">*</span>
                </label>
                <select
                  id="goal-purpose"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  onchange="window.CreateGoalView.updatePreview()"
                >
                  <option value="Emergency Fund">🛡️ Emergency Fund</option>
                  <option value="Travel & Vacation">✈️ Travel & Vacation</option>
                  <option value="Gadgets & Tech">💻 Gadgets & Tech</option>
                  <option value="Vehicle & Car">🚗 Vehicle & Transport</option>
                  <option value="Home & Living">🏡 Home & Living</option>
                  <option value="Education & Courses">🎓 Education & Career</option>
                  <option value="Investment & Wealth">📈 Investment & Wealth</option>
                  <option value="Wedding & Events">💍 Wedding & Celebrations</option>
                  <option value="Other">🎯 Other Goal</option>
                </select>
              </div>

              <!-- Email for Reminders & Cadence (2-col) -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-2">
                  <label for="goal-email" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email for Reminders <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative">
                    <i data-lucide="mail" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"></i>
                    <input
                      type="email"
                      id="goal-email"
                      required
                      placeholder="your.email@example.com"
                      value="pari.meshram@saveiq.demo"
                      class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                      oninput="window.CreateGoalView.updatePreview()"
                    />
                  </div>
                  <span class="text-[11px] text-slate-400 mt-1 block">Where you will receive milestone progress updates</span>
                </div>

                <div>
                  <label for="goal-frequency" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Frequency
                  </label>
                  <select
                    id="goal-frequency"
                    class="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    onchange="window.CreateGoalView.updatePreview()"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-weekly">Bi-weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <!-- Optional Notes / Motivation -->
              <div>
                <label for="goal-notes" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Personal Motivation / Notes <span class="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  id="goal-notes"
                  rows="2"
                  placeholder="Why is this goal important to you? What will change once achieved?"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                  oninput="window.CreateGoalView.updatePreview()"
                ></textarea>
              </div>

              <!-- Submit Buttons -->
              <div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onclick="window.CreateGoalView.resetForm()"
                  class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <i data-lucide="check" class="w-4 h-4"></i>
                  <span>Create Savings Goal</span>
                </button>
              </div>

            </form>
          </div>

          <!-- RIGHT COLUMN: DYNAMIC LIVE PREVIEW CARD (5 cols) -->
          <div class="lg:col-span-5 space-y-4">
            
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <i data-lucide="eye" class="w-3.5 h-3.5 text-emerald-600"></i>
                <span>Live Interactive Preview</span>
              </span>
              <span class="text-[11px] text-slate-400">Updates as you type</span>
            </div>

            <!-- Preview Card -->
            <div class="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 relative overflow-hidden transition-all">
              
              <div class="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span id="preview-category-badge" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                    🛡️ Emergency Fund
                  </span>
                  <h3 id="preview-name" class="font-extrabold text-lg sm:text-xl text-slate-900 leading-tight">
                    Emergency Safety Buffer
                  </h3>
                  <p id="preview-purpose" class="text-xs text-slate-500 mt-0.5">Emergency Fund</p>
                </div>

                <div class="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                  <i data-lucide="target" class="w-5 h-5 text-emerald-600"></i>
                </div>
              </div>

              <!-- Financial Metric Grid -->
              <div class="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center mb-4">
                <div>
                  <span class="text-[10px] uppercase font-bold text-slate-400">Target</span>
                  <div id="preview-target" class="font-black text-sm text-slate-900">₹3,00,000</div>
                </div>
                <div>
                  <span class="text-[10px] uppercase font-bold text-slate-400">Saved</span>
                  <div id="preview-saved" class="font-black text-sm text-emerald-600">₹50,000</div>
                </div>
                <div>
                  <span class="text-[10px] uppercase font-bold text-slate-400">Remaining</span>
                  <div id="preview-remaining" class="font-black text-sm text-slate-700">₹2,50,000</div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="space-y-1.5 mb-5">
                <div class="flex justify-between text-xs font-semibold">
                  <span class="text-slate-500">Progress</span>
                  <span id="preview-percent" class="text-emerald-600 font-bold">17%</span>
                </div>
                <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div id="preview-progress-bar" class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300" style="width: 17%"></div>
                </div>
              </div>

              <!-- Deadline & Reminders Preview -->
              <div class="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-1.5 text-slate-500"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> Target Date:</span>
                  <span id="preview-deadline" class="font-bold text-slate-800">In ~6 months</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-1.5 text-slate-500"><i data-lucide="bell" class="w-3.5 h-3.5"></i> Reminder Schedule:</span>
                  <span id="preview-reminder-schedule" class="font-semibold text-slate-700">Weekly to pari.meshram@...</span>
                </div>
              </div>

              <!-- SaveIQ Smart Calculation Box -->
              <div class="mt-4 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100/90 text-xs text-indigo-950 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-bold flex items-center gap-1.5 text-indigo-900">
                    <i data-lucide="calculator" class="w-3.5 h-3.5 text-indigo-600"></i>
                    <span>Required Savings Pace</span>
                  </span>
                  <span id="preview-feasibility" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Moderate</span>
                </div>
                <p id="preview-pace-text" class="text-indigo-900/90 leading-relaxed font-medium">
                  To achieve this goal on schedule, you will need to save approx. <strong class="text-indigo-950 font-bold">₹41,667/month</strong> (~₹9,615/week).
                </p>
              </div>

            </div>

            <!-- Helpful Tips Card -->
            <div class="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 space-y-1.5">
              <div class="font-bold flex items-center gap-1.5 text-emerald-950">
                <i data-lucide="lightbulb" class="w-3.5 h-3.5 text-emerald-600"></i>
                <span>Smart Tip for Success</span>
              </div>
              <p class="text-emerald-800/90 leading-relaxed">
                Break large financial targets into weekly automated deposits. Setting automated weekly UPI or recurring deposits helps reach financial targets 3.2x faster!
              </p>
            </div>

          </div>

        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.updatePreview();
  },

  setDeadlineMonths(months) {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    const dateInput = document.getElementById('goal-deadline');
    if (dateInput) {
      dateInput.value = d.toISOString().split('T')[0];
      this.updatePreview();
    }
  },

  applyPreset(type) {
    const nameInput = document.getElementById('goal-name');
    const targetInput = document.getElementById('goal-target');
    const savedInput = document.getElementById('goal-saved');
    const purposeSelect = document.getElementById('goal-purpose');
    const notesInput = document.getElementById('goal-notes');

    if (type === 'emergency') {
      if (nameInput) nameInput.value = '6-Month Emergency Safety Fund';
      if (targetInput) targetInput.value = '300000';
      if (savedInput) savedInput.value = '50000';
      if (purposeSelect) purposeSelect.value = 'Emergency Fund';
      if (notesInput) notesInput.value = 'Financial security buffer to cover 6 months of living expenses, rent, and medical insurance.';
      this.setDeadlineMonths(6);
    } else if (type === 'vacation') {
      if (nameInput) nameInput.value = 'Summer Vacation in Ladakh';
      if (targetInput) targetInput.value = '150000';
      if (savedInput) savedInput.value = '25000';
      if (purposeSelect) purposeSelect.value = 'Travel & Vacation';
      if (notesInput) notesInput.value = 'Flights, mountain resort stays, bike rentals, and local expedition permits.';
      this.setDeadlineMonths(5);
    }
    this.updatePreview();
  },

  updatePreview() {
    const name = document.getElementById('goal-name')?.value || 'Your Goal Name';
    const target = Number(document.getElementById('goal-target')?.value) || 250000;
    const saved = Number(document.getElementById('goal-saved')?.value) || 0;
    const deadline = document.getElementById('goal-deadline')?.value || '';
    const purpose = document.getElementById('goal-purpose')?.value || 'Emergency Fund';
    const email = document.getElementById('goal-email')?.value || 'pari.meshram@saveiq.demo';
    const freq = document.getElementById('goal-frequency')?.value || 'Weekly';

    const remaining = Math.max(0, target - saved);
    const percent = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;

    // Elements in Preview
    const pName = document.getElementById('preview-name');
    const pCategoryBadge = document.getElementById('preview-category-badge');
    const pPurpose = document.getElementById('preview-purpose');
    const pTarget = document.getElementById('preview-target');
    const pSaved = document.getElementById('preview-saved');
    const pRemaining = document.getElementById('preview-remaining');
    const pPercent = document.getElementById('preview-percent');
    const pBar = document.getElementById('preview-progress-bar');
    const pDeadline = document.getElementById('preview-deadline');
    const pReminder = document.getElementById('preview-reminder-schedule');
    const pPaceText = document.getElementById('preview-pace-text');
    const pFeasibility = document.getElementById('preview-feasibility');

    if (pName) pName.textContent = name;
    if (pCategoryBadge) pCategoryBadge.textContent = purpose;
    if (pPurpose) pPurpose.textContent = purpose;
    if (pTarget) pTarget.textContent = window.formatINR(target);
    if (pSaved) pSaved.textContent = window.formatINR(saved);
    if (pRemaining) pRemaining.textContent = window.formatINR(remaining);
    if (pPercent) pPercent.textContent = `${percent}%`;
    if (pBar) pBar.style.width = `${percent}%`;

    // Deadline calculation
    if (deadline && pDeadline) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dDate = new Date(deadline);
      dDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((dDate - today) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        pDeadline.textContent = 'Date is today or past';
        if (pPaceText) pPaceText.textContent = 'The deadline is today or past. Extend the target date to calculate recommended pace.';
        if (pFeasibility) {
          pFeasibility.textContent = 'Immediate';
          pFeasibility.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700';
        }
      } else {
        const months = Math.max(0.5, diffDays / 30.4);
        const monthlyAmount = Math.round(remaining / months);
        const weeklyAmount = Math.round(remaining / (diffDays / 7));

        pDeadline.textContent = `${deadline} (${diffDays} days left)`;
        if (pPaceText) {
          pPaceText.innerHTML = `To achieve this goal on schedule, you will need to save approx. <strong class="text-indigo-950 font-bold">${window.formatINR(monthlyAmount)}/month</strong> (~${window.formatINR(weeklyAmount)}/week).`;
        }
        if (pFeasibility) {
          if (monthlyAmount < 15000) {
            pFeasibility.textContent = 'Easy / Comfortable';
            pFeasibility.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
          } else if (monthlyAmount < 40000) {
            pFeasibility.textContent = 'Moderate';
            pFeasibility.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700';
          } else {
            pFeasibility.textContent = 'Ambitious Target';
            pFeasibility.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800';
          }
        }
      }
    }

    if (pReminder) {
      const emailShort = email.length > 18 ? email.substring(0, 16) + '...' : email;
      pReminder.textContent = `${freq} to ${emailShort}`;
    }
  },

  handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('goal-name').value.trim();
    const target = Number(document.getElementById('goal-target').value);
    const saved = Number(document.getElementById('goal-saved').value) || 0;
    const deadline = document.getElementById('goal-deadline').value;
    const purpose = document.getElementById('goal-purpose').value;
    const email = document.getElementById('goal-email').value.trim();
    const reminderFrequency = document.getElementById('goal-frequency').value;
    const notes = document.getElementById('goal-notes').value.trim();

    if (!name || isNaN(target) || target <= 0 || !deadline || !email) {
      window.saveIQApp.showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Determine category key
    const categoryKeyMap = {
      'Emergency Fund': 'emergency',
      'Travel & Vacation': 'travel',
      'Gadgets & Tech': 'tech',
      'Vehicle & Car': 'vehicle',
      'Home & Living': 'home',
      'Education & Courses': 'education',
      'Investment & Wealth': 'investment',
      'Wedding & Events': 'events',
      'Other': 'other'
    };

    const newGoal = window.saveIQStore.createGoal({
      name,
      target,
      saved,
      deadline,
      purpose,
      category: categoryKeyMap[purpose] || 'other',
      email,
      reminderFrequency,
      notes
    });

    window.saveIQApp.showToast(`Savings goal "${name}" created successfully! 🎉`, 'success');

    // Reset form and route to My Goals
    this.resetForm();
    window.saveIQApp.navigateTo('my-goals');
  },

  resetForm() {
    const form = document.getElementById('form-create-goal');
    if (form) form.reset();
    const defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() + 6);
    const dateInput = document.getElementById('goal-deadline');
    if (dateInput) dateInput.value = defaultDate.toISOString().split('T')[0];
    const savedInput = document.getElementById('goal-saved');
    if (savedInput) savedInput.value = '0';
    this.updatePreview();
  }
};
