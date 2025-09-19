"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "../../pages/RequireAuth";
import Link from "next/link";


export default function UploadPodcast() {
  const [form, setForm] = useState({
    title: "",
    description: "", 
    host: "",
    duration: "",
    category: "Music"
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ Please login first");
        return;
      }

      const formData = new FormData();
      
      // Add text fields
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("host", form.host);
      formData.append("duration", form.duration);
      formData.append("category", form.category);

      // Add files
      if (coverImage) formData.append("coverImage", coverImage);
      if (audioFile) formData.append("audioFile", audioFile);

      const response = await fetch("http://localhost:5000/api/podcasts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Podcast uploaded successfully!");
        setForm({ title: "", description: "", host: "", duration: "", category: "Music" });
        setCoverImage(null);
        setAudioFile(null);
      } else {
        setMessage("❌ Error: " + (data.message || "Upload failed"));
      }
    } catch (error: any) {
      setMessage("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Upload Podcast</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Title *"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description *"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-20"
            required
          />

          <input
            name="host"
            placeholder="Host *"
            value={form.host}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            name="duration"
            placeholder="Duration * (e.g., 30 minutes)"
            value={form.duration}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Music">Music</option>
            <option value="Talk">Talk</option>
            <option value="News">News</option>
            <option value="Sports">Sports</option>
          </select>

          <div>
            <label className="block mb-1 font-medium">Cover Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Audio File *</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Podcast"}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded ${
            message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}
        
      </div>
      <div className="space-y-3">
          <Link className="block bg-emerald-600 text-white px-4 py-2 rounded" href="/podcasts">
            CHECK PODCAST
          </Link>
         
        </div>

      
    </RequireAuth>
  );
}