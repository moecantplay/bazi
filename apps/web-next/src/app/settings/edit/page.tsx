"use client";

import { EditBirthFlow } from "@/components/edit-birth-flow";
import { ProfileGate } from "@/components/profile-gate";

export default function SettingsEditPage() {
  return <ProfileGate>{(profile) => <EditBirthFlow profile={profile} />}</ProfileGate>;
}
