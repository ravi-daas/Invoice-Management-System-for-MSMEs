import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/contexts/ProfileContext";
import { Profile } from "@/types";

export default function ProfilePage() {
  const { profile, updateProfile } = useProfile();
  const [formData, setFormData] = useState<Profile>({
    fullName: "",
    displayName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    profileImage: "",
  });

  useEffect(() => {
    setFormData(profile);
  }, [profile]);
  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value || "" });
  };

  // Handle save button click
  const handleSave = () => {
    updateProfile(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-muted">
                  <img
                    src={formData?.profileImage}
                    className="rounded-full"
                    alt="Profile"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1 text-center">
                <h3 className="font-medium">{formData?.fullName}</h3>
                <p className="text-sm text-muted-foreground">
                  {formData?.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData?.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    name="displayName"
                    placeholder="Enter your display name"
                    value={formData?.displayName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData?.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData?.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  name="bio"
                  placeholder="Write a short bio about yourself"
                  value={formData?.bio}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
