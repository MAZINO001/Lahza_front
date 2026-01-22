import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Server, Globe, Shield, Wrench, MessageSquare, Bot } from "lucide-react";

const plans = [
    {
        title: "Web Hosting",
        description: "Reliable web hosting solutions for your website",
        icon: Globe,
        url: "/admin/plans/web-hosting",
        features: ["99.9% Uptime", "SSL Certificate", "Daily Backups", "24/7 Support"]
    },
    {
        title: "SEO",
        description: "Search engine optimization services",
        icon: Server,
        url: "/admin/plans/seo",
        features: ["Keyword Research", "On-page SEO", "Link Building", "Analytics"]
    },
    {
        title: "Maintenance & Security",
        description: "Keep your website secure and up-to-date",
        icon: Shield,
        url: "/admin/plans/maintenance-security",
        features: ["Security Updates", "Performance Monitoring", "Bug Fixes", "Security Audits"]
    },
    {
        title: "SAV",
        description: "After-sales support and services",
        icon: Wrench,
        url: "/admin/plans/sav",
        features: ["Technical Support", "Training", "Documentation", "Consulting"]
    },
    {
        title: "SM",
        description: "Social media management services",
        icon: MessageSquare,
        url: "/admin/plans/sm",
        features: ["Content Creation", "Scheduling", "Analytics", "Community Management"]
    },
    {
        title: "Automation",
        description: "Business automation solutions",
        icon: Bot,
        url: "/admin/plans/automation",
        features: ["Workflow Automation", "Integration", "Process Optimization", "Reporting"]
    }
];

export default function PlansPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-3xl font-bold">Plans & Services</h1>
                <p className="text-muted-foreground">Choose the right plan for your business needs</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => {
                    const IconComponent = plan.icon;
                    return (
                        <Card key={plan.title} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <IconComponent className="h-8 w-8 text-primary" />
                                    <CardTitle className="text-xl">{plan.title}</CardTitle>
                                </div>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="mb-4 space-y-2 text-sm">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button asChild className="w-full">
                                    <a href={plan.url}>View Details</a>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
