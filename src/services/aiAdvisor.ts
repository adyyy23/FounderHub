import { supabase } from '@/lib/supabase';
import { investorService } from '@/services/investors';
import { goalService } from '@/services/goals';
import { ideaService } from '@/services/ideas';
import { roadmapService } from '@/services/roadmap';
import { teamService } from '@/services/team';
import { generateDashboardInsights } from '@/lib/aiInsights';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export const aiAdvisorService = {
  async generateResponse(userMessage: string): Promise<string> {
    const [investors, goals, ideas, roadmap, members] = await Promise.all([
      investorService.getAll(),
      goalService.getAll(),
      ideaService.getAll(),
      roadmapService.getAll(),
      teamService.getAll(),
    ]);

    const msg = userMessage.toLowerCase();
    const activeGoals = goals.filter((g) => g.status === 'active');
    const completedGoals = goals.filter((g) => g.status === 'completed');
    const negotiatingInvestors = investors.filter((i) => i.stage === 'NEGOTIATING' || i.stage === 'INTERESTED');
    const stalledGoals = activeGoals.filter((g) => g.completion < 30);
    const overloadedMembers = members.filter((m) => (m.workload || 0) >= 85);
    const inProgressRoadmap = roadmap.filter((r) => r.status === 'in_progress');
    const quickWinIdeas = ideas.filter((i) => (i.impact || 0) >= 7 && (i.effort || 0) <= 4);

    if (msg.includes('burn') || msg.includes('runway') || msg.includes('cash')) {
      const totalCommitment = investors.reduce((s, i) => s + (i.commitment || 0), 0);
      const monthlyBurn = 128000;
      const runway = totalCommitment > 0 ? (totalCommitment / monthlyBurn).toFixed(1) : '0';
      return `Based on your current data:\n\n• Total commitments: $${(totalCommitment / 1000).toFixed(0)}k\n• Estimated monthly burn: $${(monthlyBurn / 1000).toFixed(0)}k\n• Runway: ${runway} months\n\n${parseFloat(runway) < 12 ? 'Your runway is below 12 months. I recommend accelerating fundraising conversations with your ' + negotiatingInvestors.length + ' active pipeline investors and reducing non-essential spend.' : 'Your runway looks healthy. Focus on growth initiatives and capital efficiency to extend it further.'}`;
    }

    if (msg.includes('investor') || msg.includes('fundrais') || msg.includes('capital') || msg.includes('raise')) {
      const stages = {
        SOURCED: investors.filter((i) => i.stage === 'SOURCED').length,
        CONTACTED: investors.filter((i) => i.stage === 'CONTACTED').length,
        INTERESTED: investors.filter((i) => i.stage === 'INTERESTED').length,
        NEGOTIATING: investors.filter((i) => i.stage === 'NEGOTIATING').length,
      };
      return `Your investor pipeline:\n\n• Sourced: ${stages.SOURCED}\n• Contacted: ${stages.CONTACTED}\n• Interested: ${stages.INTERESTED}\n• Negotiating: ${stages.NEGOTIATING}\n\n${negotiatingInvestors.length > 0 ? `You have ${negotiatingInvestors.length} investor(s) in active negotiation. Focus on closing ${negotiatingInvestors[0].name} from ${negotiatingInvestors[0].firm || 'their firm'} — they're your hottest lead.` : 'No investors in active negotiation yet. Focus on warming up your sourced and contacted leads.'}\n\n${stages.SOURCED > 3 ? `You have ${stages.SOURCED} sourced investors. Prioritize outreach to the top 3 that best align with your focus areas.` : ''}`;
    }

    if (msg.includes('goal') || msg.includes('okr') || msg.includes('objective') || msg.includes('progress')) {
      const avgCompletion = activeGoals.length > 0 ? Math.round(activeGoals.reduce((s, g) => s + g.completion, 0) / activeGoals.length) : 0;
      return `Goal progress overview:\n\n• Active goals: ${activeGoals.length}\n• Completed: ${completedGoals.length}\n• Average completion: ${avgCompletion}%\n\n${stalledGoals.length > 0 ? `⚠️ ${stalledGoals.length} goal(s) are stalled below 30%: "${stalledGoals[0].title}" at ${stalledGoals[0].completion}%. Consider breaking it into smaller milestones.` : 'All goals are progressing well.'}\n\n${activeGoals.filter((g) => g.completion >= 70).length > 0 ? `Quick wins available: ${activeGoals.filter((g) => g.completion >= 70).length} goal(s) are above 70% — push to close them this week.` : ''}`;
    }

    if (msg.includes('team') || msg.includes('hire') || msg.includes('capacity') || msg.includes('workload')) {
      return `Team capacity analysis:\n\n• Team size: ${members.length}\n• Overloaded members: ${overloadedMembers.length}\n\n${overloadedMembers.length > 0 ? `⚠️ ${overloadedMembers[0].name} is at ${overloadedMembers[0].workload}% workload. Consider redistributing tasks or hiring support.` : 'Workload is well distributed across the team.'}\n\n${members.filter((m) => (m.workload || 0) < 40).length > 0 ? `${members.filter((m) => (m.workload || 0) < 40).length} member(s) have spare capacity — assign them from the task backlog.` : ''}`;
    }

    if (msg.includes('idea') || msg.includes('experiment') || msg.includes('prioriti')) {
      return `Idea portfolio analysis:\n\n• Total ideas: ${ideas.length}\n• Quick wins (high impact, low effort): ${quickWinIdeas.length}\n\n${quickWinIdeas.length > 0 ? `🎯 Focus on "${quickWinIdeas[0].title}" — it has ${quickWinIdeas[0].impact}/10 impact with only ${quickWinIdeas[0].effort}/10 effort. Move it to "ready" and execute this sprint.` : 'No quick wins identified. Focus on capturing more ideas with high impact and low effort scores.'}`;
    }

    if (msg.includes('roadmap') || msg.includes('milestone') || msg.includes('timeline')) {
      return `Roadmap status:\n\n• Total items: ${roadmap.length}\n• In progress: ${inProgressRoadmap.length}\n• Completed: ${roadmap.filter((r) => r.status === 'completed').length}\n• Backlog: ${roadmap.filter((r) => r.status === 'backlog').length}\n\n${inProgressRoadmap.length > 0 ? `Active: "${inProgressRoadmap[0].title}" at ${inProgressRoadmap[0].progress}%. ${inProgressRoadmap[0].progress < 25 ? 'This is stalled — review blockers.' : 'On track.'}` : 'No items in progress. Move something from the backlog to planned.'}`;
    }

    if (msg.includes('strategy') || msg.includes('recommend') || msg.includes('advice') || msg.includes('what should')) {
      const insights = generateDashboardInsights(goals, investors, [], {
        totalCommitment: investors.reduce((s, i) => s + (i.commitment || 0), 0),
        investorCount: investors.length,
        goalCompletion: activeGoals.length > 0 ? Math.round(activeGoals.reduce((s, g) => s + g.completion, 0) / activeGoals.length) : 0,
        activityCount: 0,
      });

      let response = `Strategic Assessment (Health Score: ${insights.healthScore}/100 - ${insights.healthLabel})\n\n`;
      response += insights.summary + '\n\n';
      response += 'Key Priorities This Week:\n';
      insights.weeklyPriorities.forEach((p, i) => {
        response += `${i + 1}. ${p}\n`;
      });
      return response;
    }

    // Default response with context
    return `I'm your AI strategic advisor. I can help with:\n\n• Fundraising strategy and investor pipeline analysis\n• Goal progress and OKR recommendations\n• Team capacity and workload optimization\n• Idea prioritization and experiment planning\n• Roadmap milestones and timeline management\n• Burn rate and runway calculations\n\nYou currently have ${investors.length} investors, ${activeGoals.length} active goals, ${ideas.length} ideas, and ${members.length} team members. Ask me about any of these areas for specific recommendations.`;
  },

  async saveConversation(messages: ChatMessage[]): Promise<void> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        await supabase.from('conversations').update({
          updated_at: new Date().toISOString(),
        }).eq('id', existing.id);

        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
          await supabase.from('messages').insert({
            conversation_id: existing.id,
            content: lastMessage.content,
            sender_id: userId,
          });
        }
      } else {
        const { data: conv } = await supabase.from('conversations').insert({
          user_id: userId,
        }).select().single();

        if (conv) {
          for (const msg of messages) {
            await supabase.from('messages').insert({
              conversation_id: conv.id,
              content: msg.content,
              sender_id: userId,
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to save conversation:', err);
    }
  },
};
