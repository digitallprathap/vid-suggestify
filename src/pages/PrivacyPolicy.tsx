import { Card } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-youtube-light p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <div className="prose max-w-none">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information that you provide directly to us when using our YouTube Keywords Generator tool. This includes:
              - Search queries and keywords
              - Usage data and interactions with our tool
            </p>
            <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use the collected information to:
              - Provide and improve our keyword generation service
              - Analyze usage patterns to enhance user experience
              - Maintain and optimize our tool's performance
            </p>
            <h2 className="text-xl font-semibold mb-4">3. Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your information from unauthorized access or disclosure.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}