import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  Users,
  Heart,
  MessageCircle,
  TrendingUp,
  Calendar
} from "lucide-react";

export default function SocialSection() {
  return (
    <Card className="bg-linear-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Share2 className="h-5 w-5 text-purple-600" />
              Social Media Management
            </CardTitle>
            <CardDescription>Social media services and analytics</CardDescription>
          </div>
          <Badge className="bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800">
            Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Platforms
              </span>
            </div>
            <p className="text-sm font-semibold">5</p>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Posts/Month
              </span>
            </div>
            <p className="text-sm font-semibold">30</p>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Engagement
              </span>
            </div>
            <p className="text-sm font-semibold">4.5%</p>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Growth
              </span>
            </div>
            <p className="text-sm font-semibold">+12%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
