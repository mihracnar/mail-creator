"use client"

import EmailTemplate from "@/components/email-template"

export default function EmailPreview() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">E-posta Önizleme</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Tarayıcıda Önizleme:</h2>
          <div className="border rounded-lg overflow-hidden">
            <EmailTemplate name="Test Kullanıcısı" buttonUrl="https://example.com" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">E-posta Gönderme Testi:</h2>
          <button
            onClick={async () => {
              const response = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  to: "test@example.com",
                  name: "Test Kullanıcısı",
                  buttonUrl: "https://example.com",
                }),
              })
              const result = await response.json()
              alert(result.message)
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Test E-postası Gönder
          </button>
        </div>
      </div>
    </div>
  )
}
