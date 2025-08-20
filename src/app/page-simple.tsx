"use client"

import { Layout } from "@/components/layout"

export default function SimpleHome() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to UrbanDev</h1>
          <p className="text-xl text-gray-600">This is a simple test page</p>
          <div className="mt-8">
            <button 
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
              onClick={() => alert('Button clicked!')}
            >
              Test Button
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}