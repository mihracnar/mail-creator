interface EmailTemplateProps {
  name?: string
  buttonUrl?: string
}

export default function EmailTemplate({
  name = "Değerli Kullanıcı",
  buttonUrl = "https://example.com",
}: EmailTemplateProps) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hoş Geldiniz</title>
        {/* E-posta istemcileri için özel meta etiketleri */}
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="format-detection" content="date=no" />
        <meta name="format-detection" content="address=no" />
        <meta name="format-detection" content="email=no" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f4f4f4",
          fontFamily: "Arial, sans-serif",
          WebkitTextSizeAdjust: "100%",
          msTextSizeAdjust: "100%",
        }}
      >
        {/* Outlook için wrapper */}
        <div
          style={{
            display: "none",
            fontSize: "1px",
            color: "#fefefe",
            lineHeight: "1px",
            fontFamily: "Arial, sans-serif",
            maxHeight: "0px",
            maxWidth: "0px",
            opacity: 0,
            overflow: "hidden",
          }}
        >
          Hoş geldiniz! Bu özel davetiye e-postasıdır.
        </div>

        <table
          role="presentation"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          width="100%"
          style={{ borderCollapse: "collapse" }}
        >
          <tr>
            <td align="center" style={{ padding: "40px 0" }}>
              <table
                role="presentation"
                width={600}
                cellPadding={0}
                cellSpacing={0}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  maxWidth: "600px",
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                {/* Header */}
                <tr>
                  <td
                    align="center"
                    style={{
                      padding: "40px 20px 20px 20px",
                      fontFamily: "Arial, sans-serif",
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#333333",
                      lineHeight: "1.2",
                    }}
                  >
                    🌟 Hoş Geldiniz, {name}!
                  </td>
                </tr>

                {/* Content */}
                <tr>
                  <td
                    style={{
                      padding: "0 40px 30px 40px",
                      fontFamily: "Arial, sans-serif",
                      fontSize: "16px",
                      color: "#666666",
                      lineHeight: "1.6",
                      textAlign: "center" as const,
                    }}
                  >
                    Bu e-posta, HTML biçiminde düzgün şekilde görünmesi için özel olarak tasarlandı. Platformumuza
                    katıldığınız için teşekkür ederiz!
                  </td>
                </tr>

                {/* Button */}
                <tr>
                  <td align="center" style={{ padding: "0 20px 40px 20px" }}>
                    <table role="presentation" border={0} cellSpacing={0} cellPadding={0}>
                      <tr>
                        <td style={{ borderRadius: "6px", backgroundColor: "#007BFF" }}>
                          <a
                            href={buttonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              backgroundColor: "#007BFF",
                              color: "#ffffff",
                              padding: "14px 28px",
                              textDecoration: "none",
                              borderRadius: "6px",
                              display: "inline-block",
                              fontFamily: "Arial, sans-serif",
                              fontSize: "16px",
                              fontWeight: "bold",
                              textAlign: "center" as const,
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Hemen Başlayın
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      padding: "20px 40px",
                      fontSize: "12px",
                      color: "#999999",
                      fontFamily: "Arial, sans-serif",
                      textAlign: "center" as const,
                      borderTop: "1px solid #eeeeee",
                    }}
                  >
                    © 2025 Atlas Flâneur. Bu e-posta bilgilendirme amaçlıdır.
                    <br />
                    <a href="#" style={{ color: "#999999", textDecoration: "underline" }}>
                      Abonelikten çık
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}
