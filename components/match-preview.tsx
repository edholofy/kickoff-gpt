'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trophy, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { ChatMessage } from '@/lib/types';

interface Fixture {
  id: number;
  name: string;
  startingAt: string;
  state: string;
  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };
  league: {
    name: string;
    logo: string;
  };
  hasOdds: boolean;
}

interface MatchPreviewProps {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>['sendMessage'];
}

export function MatchPreview({ chatId, sendMessage }: MatchPreviewProps) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await fetch('/api/fixtures');
        if (!response.ok) {
          throw new Error('Failed to fetch fixtures');
        }
        const data = await response.json();
        setFixtures(data.fixtures.slice(0, 6)); // Show top 6 matches
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleMatchClick = (fixture: Fixture) => {
    const prompt = `Analyze the upcoming match ${fixture.homeTeam.name} vs ${fixture.awayTeam.name} scheduled for ${formatTime(fixture.startingAt)}. Provide detailed pre-match analysis including team form, head-to-head records, and betting recommendations.`;

    window.history.replaceState({}, '', `/chat/${chatId}`);
    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: prompt }],
    });
  };

  if (loading) {
    return (
      <div className="mb-4 px-4 w-full max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <Clock size={16} />
          Today's Matches
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-24">
              <CardContent className="p-3">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 px-4 w-full max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <Clock size={16} />
          Today's Matches
        </p>
        <Card className="border-destructive/20">
          <CardContent className="p-4 text-center text-sm text-muted-foreground">
            Unable to load today's matches. Please try the quick actions below.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (fixtures.length === 0) {
    return (
      <div className="mb-4 px-4 w-full max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <Clock size={16} />
          Today's Matches
        </p>
        <Card>
          <CardContent className="p-4 text-center text-sm text-muted-foreground">
            No matches scheduled for today. Check out weekend fixtures or upcoming matches!
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6 px-4 w-full max-w-3xl mx-auto">
      <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
        <Clock size={16} />
        Today's Matches - Click to Analyze
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {fixtures.map((fixture, index) => (
          <motion.div
            key={fixture.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
          >
            <Card
              className="hover:border-primary/50 cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => handleMatchClick(fixture)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} />
                    {formatTime(fixture.startingAt)}
                  </div>
                  {fixture.hasOdds && (
                    <div className="text-xs text-green-600 flex items-center gap-1">
                      <Zap size={12} />
                      Odds
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium truncate">
                    {fixture.homeTeam.name}
                  </div>
                  <div className="text-xs text-muted-foreground">vs</div>
                  <div className="text-sm font-medium truncate">
                    {fixture.awayTeam.name}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Trophy size={12} />
                    {fixture.league.name}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    fixture.state === 'Not Started'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {fixture.state}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}