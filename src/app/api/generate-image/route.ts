import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prompt = formData.get("prompt");
    const file = formData.get("image");

    if (!prompt || !file) {
      return NextResponse.json(
        { error: "Missing prompt or image" },
        { status: 400 }
      );
    }

    const apiFormData = new FormData();
    apiFormData.append("image", file);
    apiFormData.append("prompt", prompt as string);
    apiFormData.append("output_format", "jpeg");
    apiFormData.append("mode", "image-to-image");
    apiFormData.append("strength", "1");

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/sd3",
      {
        method: "POST",
        body: apiFormData,
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({ url: dataUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "An error occurred while generating the image" },
      { status: 500 }
    );
  }
}
