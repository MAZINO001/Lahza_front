"use client";

import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
    return (
        <div className="p-4">
            <Card className="shadow-lg">
                <CardContent>
                    <Tabs defaultValue="security" className="w-full">
                        <TabsList className="grid grid-cols-2 mb-4">
                            <TabsTrigger value="security">Security</TabsTrigger>
                            <TabsTrigger value="preferences">Preferences</TabsTrigger>
                        </TabsList>

                        <TabsContent value="security" className="space-y-4">
                            <Separator />

                            <div className="flex items-center justify-between">
                                <Label>Enable Two-Factor Authentication (2FA)</Label>
                                <Switch />
                            </div>

                            <Button className="mt-4">Update Password</Button>

                            <Separator className="my-6" />

                            <div>
                                <Label className="text-red-600">Danger Zone</Label>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Once deleted, your account and all data will be permanently
                                    removed.
                                </p>
                                <Button variant="destructive">Delete Account</Button>
                            </div>
                        </TabsContent>

                        {/* <TabsContent value="notifications" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Email Notifications</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>SMS Notifications</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>System Alerts</Label>
                <Switch defaultChecked />
              </div>
              <Button className="mt-4">Save Preferences</Button>
            </TabsContent> */}

                        <TabsContent value="preferences" className="space-y-6">
                            <div>
                                <Label>Language</Label>
                                <Select defaultValue="en">
                                    <SelectTrigger className="w-[200px] mt-1">
                                        <SelectValue placeholder="Choose language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                        <SelectItem value="ar">Arabic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label>Dark Mode</Label>
                                <Switch />
                            </div>

                            <Button className="mt-4">Save Settings</Button>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
