"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import FormField from "@/Components/Form/FormField";
import FormSection from "@/Components/Form/FormSection";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import CountrySelect from "@/Components/Form/CountrySelect";

export default function Profile() {
  const [clientType, setClientType] = useState("individual");

  const country = "maroc";
  return (
    <form className="container mx-auto py-2 px-4">
      <Card className="shadow-md">
        {/* <CardHeader>
          <CardTitle>Client Profile</CardTitle>
          <CardDescription>
            Manage your account information and settings.
          </CardDescription>
        </CardHeader> */}

        <CardContent>
          <Tabs defaultValue="info">
            <TabsList className="flex items-center justify-between w-full">
              <TabsTrigger value="info">Client Information</TabsTrigger>
              <TabsTrigger value="billing">Billing Information</TabsTrigger>
              <TabsTrigger value="account">Account Information</TabsTrigger>
              {clientType !== "individual" && (
                <TabsTrigger value="docs">Technical Documents</TabsTrigger>
              )}
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <div className="mt-4">
                <div className="flex items-center gap-4">
                  <Label>Client Type</Label>
                  <Select
                    onValueChange={(val) => setClientType(val)}
                    defaultValue={clientType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent ValueChange={(val) => setClientType(val)}>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FormSection className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/avatar.png" alt="User" />
                      <AvatarFallback>LA</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Photo</Button>
                  </div>
                  <div>
                    <Label>Full Name</Label>
                    <FormField placeholder="Ex: Ali Ben Ahmed" />
                  </div>

                  {clientType === "company" && (
                    <div>
                      <Label>Company Name</Label>
                      <FormField placeholder="Ex: Lahza Agency" />
                    </div>
                  )}

                  <div>
                    <Label>Address</Label>
                    <FormField placeholder="Ex: Mohammed V Street" />
                  </div>

                  <div>
                    <Label>Phone</Label>
                    <FormField placeholder="+212 6 00 00 00 00" />
                  </div>

                  <div>
                    <Label>Postal Code</Label>
                    <FormField placeholder="Ex: 90000" />
                  </div>

                  <div>
                    <Label>City</Label>
                    <FormField placeholder="Ex: Tangier" />
                  </div>

                  <div>
                    {/* <Label>Country</Label> */}
                    <CountrySelect
                      id="country"
                      // value={paysValue}
                      value={"maroc"}
                      // onChange={(value) => {
                      //   handleChange("country", value);
                      //   registerStore.setField("country", value); // Add this line
                      // }}
                      // errors={errors}
                    />
                  </div>

                  {clientType === "company" && (
                    <>
                      <div>
                        <Label>SIREN</Label>
                        <FormField placeholder="Ex: 123 456 789" />
                      </div>

                      {country === "Maroc" && (
                        <>
                          <div>
                            <Label>ICE</Label>
                            <FormField placeholder="Ex: 001234567890" />
                          </div>
                          <div>
                            <Label>VAT</Label>
                            <FormField placeholder="Ex: FR123456789" />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </FormSection>

                <Button className="mt-4">Save</Button>
              </div>
            </TabsContent>

            <TabsContent value="billing">
              <div className="mt-4 space-y-4">
                <div>
                  <Label>Billing Address</Label>
                  <FormField placeholder="Ex: 23 Peace Street" />
                </div>
                <div>
                  <Label>City</Label>
                  <FormField placeholder="Ex: Casablanca" />
                </div>
                <div>
                  <Label>Postal Code</Label>
                  <FormField placeholder="Ex: 20000" />
                </div>
                <div>
                  <Label>Country</Label>
                  <FormField placeholder="Ex: Morocco" />
                </div>
                <div>
                  <Label>VAT Number</Label>
                  <FormField placeholder="Ex: FR123456789" />
                </div>

                <Button className="mt-4">Save</Button>
              </div>
            </TabsContent>

            <TabsContent value="account">
              <div className="mt-4 space-y-4">
                <div>
                  <Label>Email</Label>
                  <FormField type="email" placeholder="email@example.com" />
                </div>
                <div>
                  <Label>New Password</Label>
                  <FormField type="password" placeholder="********" />
                </div>
                <div>
                  <Label>Confirm Password</Label>
                  <FormField type="password" placeholder="********" />
                </div>

                <Button className="mt-4">Update Account</Button>
              </div>
            </TabsContent>

            {clientType !== "individual" && (
              <TabsContent value="docs">
                <div className="mt-4">
                  <Label>Technical Documents</Label>
                  <FormField type="file" className="mt-2" />
                  <Button className="mt-4">Upload</Button>
                </div>
              </TabsContent>
            )}

            <TabsContent value="notifications">
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>SMS Notifications</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>News & Offers</Label>
                  <Switch />
                </div>

                <Button className="mt-4">Save Preferences</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </form>
  );
}
