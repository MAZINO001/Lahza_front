import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Server, Shield, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const hostingPlans = [
    {
        name: "Starter",
        price: "$9.99/month",
        description: "Perfect for small websites and blogs",
        features: [
            "10 GB Storage",
            "100 GB Bandwidth",
            "1 Website",
            "Free SSL Certificate",
            "Daily Backups",
            "Email Support"
        ],
        popular: false
    },
    {
        name: "Professional",
        price: "$19.99/month",
        description: "Ideal for growing businesses",
        features: [
            "50 GB Storage",
            "500 GB Bandwidth",
            "5 Websites",
            "Free SSL Certificate",
            "Daily Backups",
            "Priority Support",
            "CDN Integration"
        ],
        popular: true
    },
    {
        name: "Enterprise",
        price: "$49.99/month",
        description: "For large-scale applications",
        features: [
            "200 GB Storage",
            "Unlimited Bandwidth",
            "Unlimited Websites",
            "Free SSL Certificate",
            "Real-time Backups",
            "24/7 Phone Support",
            "CDN Integration",
            "Dedicated Resources"
        ],
        popular: false
    }
];

export default function WebHostingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => navigate("/admin/plans")} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Plans
                </Button>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Globe className="h-8 w-8 text-primary" />
                        Web Hosting
                    </h1>
                    <p className="text-muted-foreground">Reliable and secure hosting solutions for your website</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {hostingPlans.map((plan) => (
                    <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                        {plan.popular && (
                            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                Most Popular
                            </Badge>
                        )}
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                            <div className="text-3xl font-bold text-primary">{plan.price}</div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                                Choose Plan
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="h-5 w-5" />
                            Technical Specifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Server Location:</span>
                            <span>US, EU, Asia</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Uptime Guarantee:</span>
                            <span>99.9%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">PHP Versions:</span>
                            <span>7.4 - 8.2</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Database:</span>
                            <span>MySQL, PostgreSQL</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Security Features
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Free SSL Certificate</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>DDoS Protection</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Malware Scanning</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Firewall Protection</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Support & Maintenance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">24/7</div>
                            <div className="text-sm text-muted-foreground">Monitoring</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">Daily</div>
                            <div className="text-sm text-muted-foreground">Backups</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">99.9%</div>
                            <div className="text-sm text-muted-foreground">Uptime</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
