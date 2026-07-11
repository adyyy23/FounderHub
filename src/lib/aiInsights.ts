import type { Goal } from '@/services/goals';
import type { Investor } from '@/services/investors';
import type { ActivityLog } from '@/services/activity';
import type { Idea } from '@/services/ideas';
import type { TeamMember } from '@/services/team';
import type { RoadmapItem } from '@/services/roadmap';

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'action' | 'priority' | 'health';
  title: string;
  description: string;
  severity?: 'high' | 'medium' | 'low';
  metric?: string;
}

export interface AIAnalysisResult {
  healthScore: number;
  healthLabel: string;
  insights: AIInsight[];
  weeklyPriorities: string[];
  summary: string;
}

function randomId() {
  return Math.random().toString(36).substring(2, 11);
}

export function generateDashboardInsights(
  goals: Goal[],
  investors: Investor[],
  activities: ActivityLog[],
  metrics: { totalCommitment: number; investorCount: number; goalCompletion: number; activityCount: number }
): AIAnalysisResult {
  const insights: AIInsight[] = [];
  const weeklyPriorities: string[] = [];

  // Health Score Calculation
  let healthScore = 70;
  healthScore += Math.min(20, metrics.goalCompletion * 0.2);
  healthScore += Math.min(10, investors.length * 1);
  healthScore = Math.min(100, Math.round(healthScore));

  const healthLabel = healthScore >= 85 ? 'Excellent' : healthScore >= 70 ? 'Strong' : healthScore >= 50 ? 'Moderate' : 'At Risk';

  // Growth Opportunities
  if (investors.length > 0) {
    const negotiatingInvestors = investors.filter((i) => i.stage === 'NEGOTIATING' || i.stage === 'INTERESTED');
    if (negotiatingInvestors.length > 0) {
      insights.push({
        id: randomId(),
        type: 'opportunity',
        title: 'Accelerate Investor Momentum',
        description: `${negotiatingInvestors.length} investor${negotiatingInvestors.length > 1 ? 's are' : ' is'} in ${negotiatingInvestors[0].stage} stage. Schedule follow-up meetings this week to capitalize on positive sentiment and move toward term sheets.`,
        severity: 'high',
        metric: `${negotiatingInvestors.length} active pipeline`,
      });
      weeklyPriorities.push(`Schedule follow-up with ${negotiatingInvestors[0].name} at ${negotiatingInvestors[0].firm || 'their firm'}`);
    }

    const sourcedInvestors = investors.filter((i) => i.stage === 'SOURCED');
    if (sourcedInvestors.length > 2) {
      insights.push({
        id: randomId(),
        type: 'opportunity',
        title: 'Warm Up Sourced Pipeline',
        description: `${sourcedInvestors.length} investors are still in SOURCED stage. Initiate contact with the top 3 based on focus area alignment to expand your active pipeline.`,
        severity: 'medium',
        metric: `${sourcedInvestors.length} cold contacts`,
      });
    }
  }

  if (metrics.totalCommitment > 0) {
    insights.push({
      id: randomId(),
      type: 'opportunity',
      title: 'Leverage Capital Position',
      description: `With ${formatCurrency(metrics.totalCommitment)} in total commitments, consider allocating 15% toward growth experiments that could 2x your ARR trajectory before the next raise.`,
      severity: 'medium',
      metric: formatCurrency(metrics.totalCommitment),
    });
  }

  // Risks
  const stalledGoals = goals.filter((g) => g.status === 'active' && g.completion < 30);
  if (stalledGoals.length > 0) {
    insights.push({
      id: randomId(),
      type: 'risk',
      title: 'Stalled Strategic Objectives',
      description: `${stalledGoals.length} goal${stalledGoals.length > 1 ? 's are' : ' is'} below 30% completion. "${stalledGoals[0].title}" is at ${stalledGoals[0].completion}% — consider breaking it into smaller milestones or reassigning ownership.`,
      severity: 'high',
      metric: `${stalledGoals.length} stalled`,
    });
    weeklyPriorities.push(`Review and unblock "${stalledGoals[0].title}"`);
  }

  const overdueGoals = goals.filter((g) => g.due_date && new Date(g.due_date) < new Date() && g.status === 'active');
  if (overdueGoals.length > 0) {
    insights.push({
      id: randomId(),
      type: 'risk',
      title: 'Overdue Deadlines',
      description: `${overdueGoals.length} goal${overdueGoals.length > 1 ? 's have' : ' has'} passed the due date. Reprioritize or extend deadlines to maintain team confidence in the OKR system.`,
      severity: 'high',
      metric: `${overdueGoals.length} overdue`,
    });
  }

  if (investors.length === 0) {
    insights.push({
      id: randomId(),
      type: 'risk',
      title: 'Empty Investor Pipeline',
      description: 'No investors in your pipeline yet. Start by sourcing 5-10 investors that align with your stage and sector. Focus on warm introductions from your network.',
      severity: 'high',
    });
    weeklyPriorities.push('Source 5 target investors aligned with your sector');
  }

  // Recommended Actions
  if (metrics.goalCompletion < 50 && goals.length > 0) {
    insights.push({
      id: randomId(),
      type: 'action',
      title: 'Focus on Key Result Execution',
      description: `Overall goal completion is at ${metrics.goalCompletion}%. Identify the 2 key results closest to completion and rally the team to close them this week for a momentum boost.`,
      severity: 'medium',
      metric: `${metrics.goalCompletion}% complete`,
    });
  }

  if (activities.length < 3) {
    insights.push({
      id: randomId(),
      type: 'action',
      title: 'Increase Activity Velocity',
      description: 'Low recent activity detected. Log investor conversations, goal updates, and team check-ins to give your AI advisor more data to work with.',
      severity: 'low',
    });
    weeklyPriorities.push('Log at least 3 activities (investor updates, goal progress, team notes)');
  }

  insights.push({
    id: randomId(),
    type: 'action',
    title: 'Weekly Investor Update',
    description: 'Send a concise progress update to all INTERESTED and NEGOTIATING investors. Highlight this week\'s wins, metrics movement, and next steps. Keep it under 200 words.',
    severity: 'medium',
  });
  weeklyPriorities.push('Send weekly investor update to active pipeline');

  // Health Score insight
  insights.push({
    id: randomId(),
    type: 'health',
    title: `Startup Health: ${healthLabel}`,
    description: `Your health score is ${healthScore}/100. ${healthScore >= 85 ? 'You\'re in excellent shape — maintain current momentum and focus on scaling.' : healthScore >= 70 ? 'You\'re on solid footing. Focus on closing stalled goals and warming up the investor pipeline.' : 'Attention needed. Prioritize unblocking stalled goals and activating your investor pipeline.'}`,
    severity: healthScore >= 85 ? 'low' : healthScore >= 70 ? 'medium' : 'high',
    metric: `${healthScore}/100`,
  });

  // Ensure at least 3 weekly priorities
  if (weeklyPriorities.length < 3) {
    weeklyPriorities.push('Review roadmap progress and adjust timelines if needed');
    weeklyPriorities.push('Conduct team 1:1s to identify blockers');
  }

  const summary = `Your startup is in ${healthLabel} condition with a health score of ${healthScore}/100. You have ${goals.length} active goals at ${metrics.goalCompletion}% average completion, ${investors.length} investors in your pipeline representing ${formatCurrency(metrics.totalCommitment)} in commitments, and ${activities.length} recent activities. ${stalledGoals.length > 0 ? `Focus on unblocking ${stalledGoals.length} stalled goals. ` : ''}${investors.length > 0 ? 'Capitalize on investor momentum by scheduling follow-ups this week.' : 'Begin building your investor pipeline immediately.'}`;

  return {
    healthScore,
    healthLabel,
    insights: insights.slice(0, 8),
    weeklyPriorities: weeklyPriorities.slice(0, 5),
    summary,
  };
}

export function generateGoalInsights(goals: Goal[], category?: string): AIAnalysisResult {
  const filteredGoals = category ? goals.filter((g) => g.category === category) : goals;
  const insights: AIInsight[] = [];
  const weeklyPriorities: string[] = [];

  const avgCompletion = filteredGoals.length > 0
    ? Math.round(filteredGoals.reduce((sum, g) => sum + g.completion, 0) / filteredGoals.length)
    : 0;

  let healthScore = Math.min(100, 50 + avgCompletion * 0.5);
  const healthLabel = healthScore >= 85 ? 'Excellent' : healthScore >= 70 ? 'Strong' : healthScore >= 50 ? 'Moderate' : 'At Risk';

  // Progress Summary
  insights.push({
    id: randomId(),
    type: 'health',
    title: `${category ? category.charAt(0).toUpperCase() + category.slice(1) + ' Goals' : 'All Goals'} Progress Overview`,
    description: `You have ${filteredGoals.length} active goals averaging ${avgCompletion}% completion. ${avgCompletion >= 70 ? 'Strong execution velocity — maintain current pace.' : avgCompletion >= 40 ? 'Steady progress. Focus on accelerating key results nearest to completion.' : 'Below target trajectory. Consider restructuring goals or reallocating resources.'}`,
    severity: avgCompletion >= 70 ? 'low' : avgCompletion >= 40 ? 'medium' : 'high',
    metric: `${avgCompletion}% avg`,
  });

  // Bottlenecks
  const lowProgressGoals = filteredGoals.filter((g) => g.completion < 30 && g.status === 'active');
  lowProgressGoals.slice(0, 3).forEach((goal) => {
    insights.push({
      id: randomId(),
      type: 'risk',
      title: `Bottleneck: "${goal.title}"`,
      description: `This goal is at ${goal.completion}% completion. ${goal.due_date ? `Due date is ${new Date(goal.due_date).toLocaleDateString()}. ` : ''}Break it down into smaller key results or reassign ownership to unblock progress.`,
      severity: 'high',
      metric: `${goal.completion}%`,
    });
  });

  // Priority Recommendations
  const nearCompletion = filteredGoals.filter((g) => g.completion >= 70 && g.status === 'active').sort((a, b) => b.completion - a.completion);
  if (nearCompletion.length > 0) {
    insights.push({
      id: randomId(),
      type: 'opportunity',
      title: 'Quick Wins Available',
      description: `"${nearCompletion[0].title}" is at ${nearCompletion[0].completion}%. Allocate focused effort this week to close it out and build momentum.`,
      severity: 'medium',
      metric: `${nearCompletion[0].completion}%`,
    });
    weeklyPriorities.push(`Push "${nearCompletion[0].title}" to completion`);
  }

  // Risk Alerts
  const overdueGoals = filteredGoals.filter((g) => g.due_date && new Date(g.due_date) < new Date() && g.status === 'active');
  if (overdueGoals.length > 0) {
    insights.push({
      id: randomId(),
      type: 'risk',
      title: 'Overdue Goals Alert',
      description: `${overdueGoals.length} goal${overdueGoals.length > 1 ? 's are' : ' is'} past the due date. Review and either extend the deadline, reduce scope, or mark as complete if criteria are met.`,
      severity: 'high',
      metric: `${overdueGoals.length} overdue`,
    });
    weeklyPriorities.push(`Address ${overdueGoals.length} overdue goal${overdueGoals.length > 1 ? 's' : ''}`);
  }

  // Suggested Next Actions
  insights.push({
    id: randomId(),
    type: 'action',
    title: 'Realign Key Results',
    description: 'Review each goal\'s key results and update current values. Accurate data ensures the AI can provide meaningful strategic guidance.',
    severity: 'low',
  });

  if (filteredGoals.length < 3) {
    insights.push({
      id: randomId(),
      type: 'action',
      title: 'Expand Goal Framework',
      description: `You have only ${filteredGoals.length} goal${filteredGoals.length !== 1 ? 's' : ''} in this category. Consider adding 2-3 more objectives to create a comprehensive strategic framework.`,
      severity: 'low',
    });
    weeklyPriorities.push(`Add 2 new ${category || 'strategic'} goals for the quarter`);
  }

  weeklyPriorities.push('Update key result progress for all active goals');
  weeklyPriorities.push('Conduct a goal review session with key stakeholders');

  const summary = `Analysis of ${filteredGoals.length} ${category ? category : 'all'} goals shows ${avgCompletion}% average completion. ${lowProgressGoals.length > 0 ? `${lowProgressGoals.length} goals are stalled below 30%. ` : ''}${nearCompletion.length > 0 ? `${nearCompletion.length} goals are near completion — prioritize closing them. ` : ''}Focus on data accuracy and momentum building.`;

  return {
    healthScore,
    healthLabel,
    insights: insights.slice(0, 8),
    weeklyPriorities: weeklyPriorities.slice(0, 5),
    summary,
  };
}

export function generateIdeaInsights(ideas: Idea[]): AIAnalysisResult {
  const insights: AIInsight[] = [];
  const weeklyPriorities: string[] = [];

  const avgImpact = ideas.length > 0 ? ideas.reduce((s, i) => s + (i.impact || 0), 0) / ideas.length : 0;
  const avgEffort = ideas.length > 0 ? ideas.reduce((s, i) => s + (i.effort || 0), 0) / ideas.length : 0;
  const healthScore = Math.min(100, Math.round(60 + avgImpact * 3 - avgEffort * 2));
  const healthLabel = healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Strong' : 'Moderate';

  // High-impact, low-effort ideas
  const quickWins = ideas.filter((i) => (i.impact || 0) >= 7 && (i.effort || 0) <= 4);
  if (quickWins.length > 0) {
    insights.push({
      id: randomId(),
      type: 'opportunity',
      title: 'Quick Win Identified',
      description: `"${quickWins[0].title}" has high impact (${quickWins[0].impact}/10) with low effort (${quickWins[0].effort}/10). Move it to "ready" status and schedule execution this sprint.`,
      severity: 'high',
      metric: `Impact ${quickWins[0].impact}/Effort ${quickWins[0].effort}`,
    });
    weeklyPriorities.push(`Promote "${quickWins[0].title}" to ready status`);
  }

  // High-impact, high-effort
  const bigBets = ideas.filter((i) => (i.impact || 0) >= 8 && (i.effort || 0) >= 6);
  if (bigBets.length > 0) {
    insights.push({
      id: randomId(),
      type: 'action',
      title: 'Strategic Bet Needs Scoping',
      description: `"${bigBets[0].title}" is high-impact but high-effort. Break it into 3-4 smaller experiments to validate assumptions before committing full resources.`,
      severity: 'medium',
    });
  }

  // Low confidence ideas
  const lowConfidence = ideas.filter((i) => (i.confidence || 0) < 4 && (i.impact || 0) >= 6);
  if (lowConfidence.length > 0) {
    insights.push({
      id: randomId(),
      type: 'risk',
      title: 'Validate High-Import, Low-Confidence Ideas',
      description: `${lowConfidence.length} idea${lowConfidence.length > 1 ? 's have' : ' has'} high impact potential but low confidence. Run a 1-week validation sprint with customer interviews to increase confidence before committing.`,
      severity: 'medium',
    });
    weeklyPriorities.push('Run validation sprint for low-confidence, high-impact ideas');
  }

  if (ideas.length === 0) {
    insights.push({
      id: randomId(),
      type: 'action',
      title: 'Start Capturing Ideas',
      description: 'Your Idea Vault is empty. Start by capturing 3-5 ideas from your last team brainstorm or customer feedback session. Score them by impact, confidence, and effort.',
      severity: 'low',
    });
    weeklyPriorities.push('Capture 3-5 ideas from recent brainstorm sessions');
  }

  weeklyPriorities.push('Review and update status of all ideas');
  weeklyPriorities.push('Score new ideas using the impact/effort matrix');

  const summary = `Your Idea Vault contains ${ideas.length} ideas with average impact of ${avgImpact.toFixed(1)}/10 and effort of ${avgEffort.toFixed(1)}/10. ${quickWins.length > 0 ? `${quickWins.length} quick wins are ready for execution. ` : ''}Focus on high-impact, low-effort ideas first.`;

  return { healthScore, healthLabel, insights: insights.slice(0, 6), weeklyPriorities: weeklyPriorities.slice(0, 4), summary };
}

export function generateTeamInsights(members: TeamMember[], tasks: { team_member_id: string | null; priority: string; status: string; title: string }[]): AIAnalysisResult {
  const insights: AIInsight[] = [];
  const weeklyPriorities: string[] = [];

  const overloadedMembers = members.filter((m) => (m.workload || 0) >= 85);
  const underutilized = members.filter((m) => (m.workload || 0) < 40);
  const avgWorkload = members.length > 0 ? members.reduce((s, m) => s + (m.workload || 0), 0) / members.length : 0;
  const healthScore = Math.max(20, Math.min(100, Math.round(100 - avgWorkload * 0.3 - overloadedMembers.length * 10)));
  const healthLabel = healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention';

  if (overloadedMembers.length > 0) {
    insights.push({
      id: randomId(),
      type: 'risk',
      title: 'Capacity Overload Detected',
      description: `${overloadedMembers[0].name} is at ${overloadedMembers[0].workload}% workload. Reassign ${overloadedMembers.length > 1 ? 'tasks from overloaded members' : 'some of their tasks'} to ${underutilized.length > 0 ? underutilized[0].name : 'a new hire or contractor'}.`,
      severity: 'high',
      metric: `${overloadedMembers[0].workload}% load`,
    });
    weeklyPriorities.push(`Reassign tasks from ${overloadedMembers[0].name}`);
  }

  if (underutilized.length > 0 && overloadedMembers.length > 0) {
    insights.push({
      id: randomId(),
      type: 'opportunity',
      title: 'Redistribute Workload',
      description: `${underutilized.length} team member${underutilized.length > 1 ? 's are' : ' is'} below 40% capacity. Shift non-critical tasks from overloaded members to balance the team.`,
      severity: 'medium',
    });
  }

  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done');
  if (urgentTasks.length > 0) {
    insights.push({
      id: randomId(),
      type: 'risk',
      title: 'Urgent Tasks Unassigned',
      description: `${urgentTasks.length} urgent task${urgentTasks.length > 1 ? 's are' : ' is'} still open. "${urgentTasks[0].title}" needs immediate assignment and a deadline.`,
      severity: 'high',
    });
    weeklyPriorities.push(`Assign and deadline the ${urgentTasks.length} urgent task${urgentTasks.length > 1 ? 's' : ''}`);
  }

  if (members.length === 0) {
    insights.push({
      id: randomId(),
      type: 'action',
      title: 'Build Your Team',
      description: 'No team members yet. Start by adding your core team — co-founder, key engineers, and growth lead. Assign roles and departments to enable capacity planning.',
      severity: 'high',
    });
    weeklyPriorities.push('Add your first 3 team members');
  }

  insights.push({
    id: randomId(),
    type: 'health',
    title: `Team Health: ${healthLabel}`,
    description: `Average workload is ${Math.round(avgWorkload)}% across ${members.length} members. ${overloadedMembers.length > 0 ? `${overloadedMembers.length} member${overloadedMembers.length > 1 ? 's are' : ' is'} overloaded. ` : ''}${underutilized.length > 0 ? `${underutilized.length} member${underutilized.length > 1 ? 's have' : ' has'} spare capacity.` : 'Workload is well distributed.'}`,
    severity: overloadedMembers.length > 0 ? 'high' : 'low',
    metric: `${Math.round(avgWorkload)}% avg`,
  });

  weeklyPriorities.push('Review team capacity and task assignments');
  weeklyPriorities.push('Hold 1:1 check-ins with overloaded members');

  const summary = `Team health is ${healthLabel} with ${members.length} members at ${Math.round(avgWorkload)}% average workload. ${overloadedMembers.length > 0 ? `${overloadedMembers.length} overloaded. ` : ''}${urgentTasks.length > 0 ? `${urgentTasks.length} urgent tasks need attention. ` : ''}Balance workload and close urgent tasks to improve team velocity.`;

  return { healthScore, healthLabel, insights: insights.slice(0, 6), weeklyPriorities: weeklyPriorities.slice(0, 4), summary };
}

export function generateRoadmapInsights(items: RoadmapItem[]): AIAnalysisResult {
  const insights: AIInsight[] = [];
  const weeklyPriorities: string[] = [];

  const inProgress = items.filter((i) => i.status === 'in_progress');
  const backlog = items.filter((i) => i.status === 'backlog');
  const completed = items.filter((i) => i.status === 'completed');
  const avgProgress = inProgress.length > 0 ? inProgress.reduce((s, i) => s + i.progress, 0) / inProgress.length : 0;
  const healthScore = Math.min(100, Math.round(40 + completed.length * 5 + avgProgress * 0.4));
  const healthLabel = healthScore >= 80 ? 'On Track' : healthScore >= 60 ? 'Progressing' : 'Behind Schedule';

  if (inProgress.length > 0) {
    const stalled = inProgress.filter((i) => i.progress < 25);
    if (stalled.length > 0) {
      insights.push({
        id: randomId(),
        type: 'risk',
        title: 'Stalled Initiatives',
        description: `"${stalled[0].title}" is in progress but only at ${stalled[0].progress}%. ${stalled[0].assignee ? `Assigned to ${stalled[0].assignee}. ` : ''}Review blockers and provide additional resources or adjust the timeline.`,
        severity: 'high',
        metric: `${stalled[0].progress}%`,
      });
      weeklyPriorities.push(`Unblock "${stalled[0].title}"`);
    }

    const nearDone = inProgress.filter((i) => i.progress >= 80).sort((a, b) => b.progress - a.progress);
    if (nearDone.length > 0) {
      insights.push({
        id: randomId(),
        type: 'opportunity',
        title: 'Near Completion',
        description: `"${nearDone[0].title}" is at ${nearDone[0].progress}%. Push to complete this week for a momentum win and roadmap credibility.`,
        severity: 'medium',
        metric: `${nearDone[0].progress}%`,
      });
      weeklyPriorities.push(`Finalize "${nearDone[0].title}"`);
    }
  }

  if (backlog.length > 5) {
    insights.push({
      id: randomId(),
      type: 'action',
      title: 'Triage Backlog',
      description: `${backlog.length} items in backlog. Prioritize the top 3 by impact and move them to planned status. Archive items older than 6 months that haven't been started.`,
      severity: 'low',
    });
    weeklyPriorities.push('Triage and prioritize backlog items');
  }

  const overdue = items.filter((i) => i.end_date && new Date(i.end_date) < new Date() && i.status !== 'completed' && i.status !== 'cancelled');
  if (overdue.length > 0) {
    insights.push({
      id: randomId(),
      type: 'risk',
      title: 'Overdue Milestones',
      description: `${overdue.length} milestone${overdue.length > 1 ? 's have' : ' has'} passed the target end date. Reschedule or reduce scope to get back on track.`,
      severity: 'high',
    });
  }

  if (items.length === 0) {
    insights.push({
      id: randomId(),
      type: 'action',
      title: 'Build Your Roadmap',
      description: 'No roadmap items yet. Start by adding 3-5 key initiatives for the quarter. Assign target dates, priorities, and owners to create a clear execution path.',
      severity: 'medium',
    });
    weeklyPriorities.push('Add 3-5 key initiatives for the quarter');
  }

  weeklyPriorities.push('Update progress on all in-progress items');
  weeklyPriorities.push('Review and adjust timelines for upcoming milestones');

  const summary = `Roadmap health is ${healthLabel} with ${items.length} total items: ${inProgress.length} in progress, ${backlog.length} in backlog, ${completed.length} completed. ${overdue.length > 0 ? `${overdue.length} overdue. ` : ''}Focus on closing in-progress items and triaging the backlog.`;

  return { healthScore, healthLabel, insights: insights.slice(0, 6), weeklyPriorities: weeklyPriorities.slice(0, 4), summary };
}

function formatCurrency(val: number): string {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
  return `$${val}`;
}
