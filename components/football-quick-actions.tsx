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
  Clock,
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
      icon: Clock,
      label: "Upcoming Matches",
      prompt: "Show me today's and tomorrow's football fixtures with pre-match analysis and betting opportunities",
      color: "text-blue-500"
    },
    {
      icon: Calendar,
      label: "Today's Fixtures",
      prompt: "Give me all today's football matches with detailed pre-match analysis and betting recommendations",
      color: "text-green-500"
    },
    {
      icon: Trophy,
      label: "Premier League",
      prompt: "Get Premier League standings and analyze upcoming fixtures with betting insights",
      color: "text-purple-500"
    },
    {
      icon: TrendingUp,
      label: "Value Bets",
      prompt: "Find the best value betting opportunities in today's and this week's football matches",
      color: "text-emerald-500"
    },
    {
      icon: Users,
      label: "Team Comparison",
      prompt: "I want to compare two teams - ask me which teams and provide detailed head-to-head analysis and betting insights",
      color: "text-orange-500"
    },
    {
      icon: Target,
      label: "Weekend Fixtures",
      prompt: "Show me this weekend's key football matches with comprehensive pre-match analysis",
      color: "text-indigo-500"
    },
    {
      icon: Zap,
      label: "Underdog Picks",
      prompt: "Identify potential underdog opportunities in upcoming matches with strong value",
      color: "text-yellow-500"
    },
    {
      icon: BarChart3,
      label: "Form Analysis",
      prompt: "Analyze team form and recent performance for today's matches with betting recommendations",
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