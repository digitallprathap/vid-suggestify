import { Card } from "@/components/ui/card";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-youtube-light p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
          <div className="prose max-w-none">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using this YouTube Keywords Generator tool, you accept and agree to be bound by these Terms and Conditions.
            </p>
            <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
            <p className="mb-4">
              This tool is provided for personal and commercial use. You may not:
              - Use the service for any illegal purpose
              - Attempt to decompile or reverse engineer any software contained in the tool
              - Remove any copyright or proprietary notations
            </p>
            <h2 className="text-xl font-semibold mb-4">3. Disclaimer</h2>
            <p className="mb-4">
              The keywords generated are suggestions based on algorithms and may not guarantee specific results or rankings.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}