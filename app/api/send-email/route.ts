import { type NextRequest, NextResponse } from "next/server"
import { render } from "@react-email/render"
import EmailTemplate from "@/components/email-template"

export async function POST(request: NextRequest) {
  try {
    const { to, name, buttonUrl } = await request.json()

    // React Email ile HTML render et
    const emailHtml = render(EmailTemplate({ name, buttonUrl }))

    // E-posta gönderme örneği (Resend, SendGrid, vs. kullanabilirsiniz)
    const emailData = {
      to,
      subject: "Hoş Geldiniz!",
      html: emailHtml,
      // Önemli: Content-Type başlığını ayarla
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
        "MIME-Version": "1.0",
      },
    }

    // Burada gerçek e-posta servisinizi kullanın
    console.log("E-posta gönderilecek:", emailData)

    return NextResponse.json({
      success: true,
      message: "E-posta başarıyla gönderildi",
      preview: emailHtml,
    })
  } catch (error) {
    console.error("E-posta gönderme hatası:", error)
    return NextResponse.json({ success: false, error: "E-posta gönderilemedi" }, { status: 500 })
  }
}
