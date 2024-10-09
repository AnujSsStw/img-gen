"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function ImageGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image file");
      return;
    }
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("prompt", prompt);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedImage(data.url);
    } catch (err) {
      setError("An error occurred while generating the image");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="image">Source Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <div>
          <Label htmlFor="prompt">Prompt</Label>
          <Input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt"
            required
          />
        </div>
        <Button type="submit" disabled={isLoading || !file}>
          {isLoading ? "Generating..." : "Generate Image"}
        </Button>
      </form>
      {error && (
        <p className="text-red-500 mt-4" role="alert">
          {error}
        </p>
      )}
      {generatedImage && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Generated Image:</h2>
          <img
            src={generatedImage}
            alt="Generated"
            className="w-full rounded-lg"
          />
        </div>
      )}
    </Card>
  );
}
