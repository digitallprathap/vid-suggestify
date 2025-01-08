import { Card } from "@/components/ui/card";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-youtube-light p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-6">About Us</h1>
          <div className="prose max-w-none">
            <p className="mb-4">
              Welcome to YT Keywords Generator, your trusted tool for optimizing YouTube content visibility.
            </p>
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="mb-4">
              We aim to help content creators maximize their reach by providing relevant and effective keywords for their YouTube videos.
            </p>
            <h2 className="text-xl font-semibold mb-4">What We Offer</h2>
            <p className="mb-4">
              Our tool generates targeted keywords based on your topic, taking into account competition levels to help you make informed decisions about your content strategy.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
