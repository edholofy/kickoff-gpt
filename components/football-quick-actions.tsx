'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { VisibilityType } from './visibility-selector';
import type { ChatMessage } from '@/lib/types';
import { Button } from './ui/button';
import { 
  Trophy, 
  TrendingUp, 
  Activity, 
  Users, 
  Calendar,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';

interface FootballQuickActionsProps {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>['sendMessage'];
  selectedVisibilityType: VisibilityType;
}

function PureFootballQuickActions({
  chatId,
  sendMessage,
  selectedVisibilityType,
}: FootballQuickActionsProps) {
  const quickActions = [
    {
      icon: Activity,
      label: "Live Matches",
      prompt: "Show me all live football matches with current scores and in-play betting opportunities",
      color: "text-red-500"
    },
    {
      icon: Calendar,
      label: "Today's Fixtures",
      prompt: "Analyze today's football matches and provide betting recommendations for the best opportunities",
      color: "text-blue-500"
    },
    {
      icon: Trophy,
      label: "Premier League",
      prompt: "Give me the current Premier League standings and analyze the top teams' upcoming fixtures",
      color: "text-purple-500"
    },
    {
      icon: TrendingUp,
      label: "Value Bets",
      prompt: "Find today's best value bets across all major football leagues with detailed analysis",
      color: "text-green-500"
    },
    {
      icon: Users,
      label: "Team Comparison",
      prompt: "I want to compare two teams - please ask me which teams and then provide detailed H2H analysis",
      color: "text-orange-500"
    },
    {
      icon: Target,
      label: "Weekend Fixtures",
      prompt: "Show me this weekend's major football fixtures with betting recommendations",
      color: "text-indigo-500"
    },
    {
      icon: Zap,
      label: "Underdog Picks",
      prompt: "Identify potential underdog wins for today's matches with good odds value",
      color: "text-yellow-500"
    },
    {
      icon: BarChart3,
      label: "Form Analysis",
      prompt: "Analyze the form of teams playing today and suggest bets based on recent performance",
      color: "text-cyan-500"
    }
  ];

  return (
    <div className="mb-4 px-4 w-full max-w-3xl mx-auto">
      <p className="text-sm text-muted-foreground mb-3">Quick Actions</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.02 * index }}
            >
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center gap-1.5 p-3 hover:border-primary/50"
                onClick={() => {
                  window.history.replaceState({}, '', `/chat/${chatId}`);
                  sendMessage({
                    role: 'user',
                    parts: [{ type: 'text', text: action.prompt }],
                  });
                }}
              >
                <Icon className={`h-5 w-5 ${action.color}`} />
                <span className="text-xs font-medium text-center">{action.label}</span>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export const FootballQuickActions = memo(
  PureFootballQuickActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) return false;
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType)
      return false;

    return true;
  },
);