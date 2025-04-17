import UserManagement from "~/lib/features/better-auth";
import ContentSection from "../components/content-section";

export default function SettingsAccount() {
  return (
    <>
      <ContentSection
        title="User Management"
        desc="View and manage all users in the system."
        className="mt-8"
      >
        <UserManagement />
      </ContentSection>
    </>
  );
}
