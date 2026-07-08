"use client";

import { EditBirthFlow } from "@/components/edit-birth-flow";
import { ProfileGate } from "@/components/profile-gate";

export default function EditBirthPage() {
  return <ProfileGate>{(profile) => <EditBirthFlow profile={profile} />}</ProfileGate>;
}
