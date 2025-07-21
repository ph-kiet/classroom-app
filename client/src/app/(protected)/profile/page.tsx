import EditProfileForm from "@/components/profile/edit-profile-form";

export default async function Page() {
  return (
    <div className="grid sm:grid-cols-2 space-y-4 gap-6">
      <div>
        <div className="text-2xl font-bold">Profile</div>
        <EditProfileForm />
      </div>
    </div>
  );
}
