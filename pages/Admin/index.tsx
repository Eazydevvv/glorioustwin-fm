"use client";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="space-y-3">
          <Link className="block bg-emerald-600 text-white px-4 py-2 rounded" href="/Admin/new">
            Create News
          </Link>
          <Link className="block bg-emerald-600 text-white px-4 py-2 rounded" href="/Admin/UploadPodcast">
            Create Podcast
          </Link>
        </div>
      </div>
   
  );
}
