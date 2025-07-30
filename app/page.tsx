"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Copy,
  Eye,
  Palette,
  ExternalLink,
  ImageIcon,
  X,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Type,
  Grid3X3,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  MousePointer,
  Hash,
  FileText,
} from "lucide-react"

interface ContentBlock {
  id: string
  type: "header" | "text" | "image" | "gallery" | "divider" | "quote" | "button" | "footer"
  title?: string
  content?: string
  htmlContent?: string
  imageUrl?: string
  imageUrls?: string[]
  backgroundColor?: string
  textAlign?: "left" | "center" | "right"
  textType?: "paragraph" | "h1" | "h2" | "h3" | "h4"
  buttonUrl?: string
  buttonStyle?: "primary" | "secondary" | "outline"
}

interface EmailData {
  blocks: ContentBlock[]
}

export default function ArtBulletinGenerator() {
  const [emailData, setEmailData] = useState<EmailData>({
    blocks: [
      {
        id: "1",
        type: "header",
        content: "SANAT BÜLTENİ",
        textAlign: "center",
        backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
      {
        id: "2",
        type: "text",
        title: "Hoş Geldiniz",
        content:
          "Bu ay sizler için özenle seçilmiş sanat eserleri, yeni sergiler ve özel etkinliklerle dolu bir bülten hazırladık. Sanatın büyülü dünyasında keyifli bir yolculuğa çıkmaya hazır mısınız?",
        textType: "paragraph",
      },
    ],
  })

  const [newImageUrl, setNewImageUrl] = useState("")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Google Drive link'ini direkt görüntülenebilir hale çevir
  const convertGoogleDriveUrl = (url: string): string => {
    if (url.includes("drive.google.com")) {
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
      if (fileIdMatch) {
        return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w600`
      }
      if (url.includes("uc?") || url.includes("thumbnail?")) {
        return url
      }
    }
    return url
  }

  const generateBlockHtml = (block: ContentBlock) => {
    switch (block.type) {
      case "header":
        return `
          <tr>
            <td style="background: ${block.backgroundColor || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}; padding: 0; position: relative;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding: 50px 40px 40px 40px; position: relative;" class="mobile-padding">
                    <!-- Decorative circles -->
                    <div style="position: absolute; top: 20px; right: 30px; width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2);"></div>
                    <div style="position: absolute; bottom: 20px; left: 30px; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.15);"></div>
                    
                    <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 32px; font-weight: 700; color: #ffffff; text-align: ${block.textAlign || "center"}; line-height: 1.2; letter-spacing: -0.5px;" class="mobile-font-size">
                      ${block.content || ""}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`

      case "text":
        const getTextTag = (textType: string, content: string) => {
          switch (textType) {
            case "h1":
              return `<h1 style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 28px; font-weight: 700; color: #2d3748; text-align: ${block.textAlign || "left"};">${content}</h1>`
            case "h2":
              return `<h2 style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 24px; font-weight: 700; color: #2d3748; text-align: ${block.textAlign || "left"};">${content}</h2>`
            case "h3":
              return `<h3 style="margin: 0 0 15px 0; font-family: 'Georgia', serif; font-size: 20px; font-weight: 700; color: #2d3748; text-align: ${block.textAlign || "left"};">${content}</h3>`
            case "h4":
              return `<h4 style="margin: 0 0 15px 0; font-family: 'Georgia', serif; font-size: 18px; font-weight: 700; color: #2d3748; text-align: ${block.textAlign || "left"};">${content}</h4>`
            default:
              return `<div style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 16px; color: #4a5568; line-height: 1.7; text-align: ${block.textAlign || "left"};">${content}</div>`
          }
        }

        return `
          <tr>
            <td style="padding: 40px 40px 20px 40px; background-color: ${block.backgroundColor || "#ffffff"};" class="mobile-padding">
              ${block.title ? `<h2 style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 24px; font-weight: 700; color: #2d3748; text-align: left;">${block.title}</h2>` : ""}
              ${getTextTag(block.textType || "paragraph", block.htmlContent || block.content || "")}
            </td>
          </tr>`

      case "image":
        return `
          <tr>
            <td align="center" style="padding: 30px 40px; background-color: ${block.backgroundColor || "#ffffff"};" class="mobile-padding">
              ${block.title ? `<h3 style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 20px; font-weight: 700; color: #2d3748; text-align: center;">${block.title}</h3>` : ""}
              <img src="${convertGoogleDriveUrl(block.imageUrl || "")}" alt="${block.title || "Sanat Eseri"}" style="max-width: 100%; height: auto; border-radius: 12px; display: block; box-shadow: 0 8px 32px rgba(0,0,0,0.1);" />
            </td>
          </tr>`

      case "gallery":
        const images = block.imageUrls || []
        if (images.length === 0) return ""

        let galleryHtml = `
          <tr>
            <td style="padding: 30px 40px; background-color: ${block.backgroundColor || "#ffffff"};" class="mobile-padding">
              ${block.title ? `<h3 style="margin: 0 0 30px 0; font-family: 'Georgia', serif; font-size: 20px; font-weight: 700; color: #2d3748; text-align: center;">${block.title}</h3>` : ""}
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">`

        if (images.length === 1) {
          galleryHtml += `
            <tr>
              <td align="center">
                <img src="${convertGoogleDriveUrl(images[0])}" alt="Sanat Eseri" style="width: 80%; height: auto; border-radius: 8px; display: block; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" />
              </td>
            </tr>`
        } else if (images.length === 2) {
          galleryHtml += `
            <tr>
              <td width="48%" style="padding-right: 2%;" class="mobile-stack">
                <img src="${convertGoogleDriveUrl(images[0])}" alt="Sanat Eseri 1" style="width: 100%; height: auto; border-radius: 8px; display: block; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" />
              </td>
              <td width="48%" style="padding-left: 2%;" class="mobile-stack">
                <img src="${convertGoogleDriveUrl(images[1])}" alt="Sanat Eseri 2" style="width: 100%; height: auto; border-radius: 8px; display: block; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" />
              </td>
            </tr>`
        } else if (images.length >= 3) {
          galleryHtml += `
            <tr>
              <td width="32%" style="padding-right: 2%;" class="mobile-stack">
                <img src="${convertGoogleDriveUrl(images[0])}" alt="Sanat Eseri 1" style="width: 100%; height: auto; border-radius: 8px; display: block; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" />
              </td>
              <td width="32%" style="padding: 0 1%;" class="mobile-stack">
                <img src="${convertGoogleDriveUrl(images[1])}" alt="Sanat Eseri 2" style="width: 100%; height: auto; border-radius: 8px; display: block; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" />
              </td>
              <td width="32%" style="padding-left: 2%;" class="mobile-stack">
                <img src="${convertGoogleDriveUrl(images[2])}" alt="Sanat Eseri 3" style="width: 100%; height: auto; border-radius: 8px; display: block; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" />
              </td>
            </tr>`

          if (images.length >= 4) {
            galleryHtml += `
            <tr>
              <td colspan="3" align="center" style="padding-top: 15px;">
                <img src="${convertGoogleDriveUrl(images[3])}" alt="Sanat Eseri 4" style="width: 60%; height: auto; border-radius: 8px; display: block; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" />
              </td>
            </tr>`
          }
        }

        galleryHtml += `
              </table>
            </td>
          </tr>`
        return galleryHtml

      case "divider":
        return `
          <tr>
            <td style="padding: 30px 40px; background-color: ${block.backgroundColor || "#ffffff"};" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="border-top: 1px solid #e2e8f0; padding: 20px 0;">
                    <div style="text-align: center;">
                      <div style="display: inline-block; width: 50px; height: 3px; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 2px;"></div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`

      case "quote":
        return `
          <tr>
            <td style="padding: 40px; background-color: ${block.backgroundColor || "#f7fafc"};" class="mobile-padding">
              <div style="border-left: 4px solid #667eea; padding-left: 20px;">
                <p style="margin: 0; font-family: 'Georgia', serif; font-size: 18px; color: #2d3748; line-height: 1.6; font-style: italic;">
                  "${block.content || ""}"
                </p>
                ${block.title ? `<p style="margin: 15px 0 0 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; color: #718096; font-weight: 600;">— ${block.title}</p>` : ""}
              </div>
            </td>
          </tr>`

      case "button":
        const getButtonStyle = (style: string) => {
          switch (style) {
            case "secondary":
              return "background: #6b7280; color: #ffffff; border: 2px solid #6b7280;"
            case "outline":
              return "background: transparent; color: #667eea; border: 2px solid #667eea;"
            default:
              return "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; border: none;"
          }
        }

        return `
          <tr>
            <td style="background-color: ${block.backgroundColor || "#2d3748"}; padding: 50px 40px;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    ${block.title ? `<h2 style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 24px; font-weight: 700; color: #ffffff; text-align: center;">${block.title}</h2>` : ""}
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="border-radius: 50px; ${getButtonStyle(block.buttonStyle || "primary")} box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);">
                          <a href="${block.buttonUrl || "#"}" target="_blank" rel="noopener noreferrer" style="padding: 16px 32px; text-decoration: none; border-radius: 50px; display: inline-block; font-family: 'Inter', Arial, sans-serif; font-size: 16px; font-weight: 600; text-align: center; letter-spacing: 0.5px; transition: all 0.3s ease;">
                            ${block.content || "Butona Tıklayın"}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`

      case "footer":
        return `
          <tr>
            <td style="padding: 40px; font-size: 12px; color: #718096; font-family: 'Inter', Arial, sans-serif; text-align: ${block.textAlign || "center"}; background-color: ${block.backgroundColor || "#f7fafc"}; border-top: 1px solid #e2e8f0;" class="mobile-padding">
              ${block.content || ""}
              <br><br>
              <a href="#" style="color: #667eea; text-decoration: underline;">Abonelikten çık</a>
            </td>
          </tr>`

      default:
        return ""
    }
  }

  const generateEmailHtml = () => {
    const blocksHtml = emailData.blocks.map((block) => generateBlockHtml(block)).join("")

    return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="format-detection" content="telephone=no">
  <title>Sanat Bülteni</title>
  <link href="https://fonts.googleapis.com/css2?family=Georgia:wght@400;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style type="text/css">
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    
    @media only screen and (max-width: 600px) {
      .mobile-center { text-align: center !important; }
      .mobile-full-width { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding: 20px !important; }
      .mobile-font-size { font-size: 18px !important; }
      .mobile-stack { display: block !important; width: 100% !important; padding: 0 0 15px 0 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Inter', Arial, sans-serif;">
  
  <!-- Main container -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 0; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border-collapse: collapse;" class="mobile-full-width">
          
          ${blocksHtml}
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>`
  }

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      title:
        type === "text"
          ? ""
          : type === "quote"
            ? "Sanatçı Adı"
            : type === "gallery"
              ? "Sanat Galerisi"
              : type === "image"
                ? "Sanat Eseri"
                : type === "button"
                  ? "Özel Davet"
                  : "",
      content:
        type === "text"
          ? "Buraya içeriğinizi yazın..."
          : type === "quote"
            ? "Sanat, hayatın kendisidir."
            : type === "header"
              ? "SANAT BÜLTENİ"
              : type === "button"
                ? "SERGİLERİ KEŞFET"
                : type === "footer"
                  ? "© 2025 Sanat Galerisi. Sanatın gücüyle buluşuyoruz."
                  : "",
      htmlContent: type === "text" ? "<p>Buraya içeriğinizi yazın...</p>" : undefined,
      imageUrl: type === "image" ? "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400" : undefined,
      imageUrls:
        type === "gallery" ? ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400"] : undefined,
      backgroundColor:
        type === "quote"
          ? "#f7fafc"
          : type === "header"
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : type === "button"
              ? "#2d3748"
              : type === "footer"
                ? "#f7fafc"
                : "#ffffff",
      textAlign: type === "header" ? "center" : type === "footer" ? "center" : "left",
      textType: type === "text" ? "paragraph" : undefined,
      buttonUrl: type === "button" ? "https://example.com/sergiler" : undefined,
      buttonStyle: type === "button" ? "primary" : undefined,
    }

    setEmailData((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }))
  }

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setEmailData((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) => (block.id === id ? { ...block, ...updates } : block)),
    }))
  }

  const deleteBlock = (id: string) => {
    setEmailData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== id),
    }))
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    setEmailData((prev) => {
      const blocks = [...prev.blocks]
      const index = blocks.findIndex((block) => block.id === id)

      if (direction === "up" && index > 0) {
        ;[blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]]
      } else if (direction === "down" && index < blocks.length - 1) {
        ;[blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]]
      }

      return { ...prev, blocks }
    })
  }

  const addImageToGallery = (blockId: string, imageUrl: string) => {
    const block = emailData.blocks.find((b) => b.id === blockId)
    if (block && block.type === "gallery") {
      const currentImages = block.imageUrls || []
      if (currentImages.length < 4) {
        updateBlock(blockId, {
          imageUrls: [...currentImages, imageUrl],
        })
      }
    }
  }

  const removeImageFromGallery = (blockId: string, imageIndex: number) => {
    const block = emailData.blocks.find((b) => b.id === blockId)
    if (block && block.type === "gallery" && block.imageUrls) {
      updateBlock(blockId, {
        imageUrls: block.imageUrls.filter((_, index) => index !== imageIndex),
      })
    }
  }

  const formatText = (blockId: string, format: string) => {
    const block = emailData.blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "text") return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()
    if (!selectedText) return

    let formattedText = ""
    switch (format) {
      case "bold":
        formattedText = `<strong>${selectedText}</strong>`
        break
      case "italic":
        formattedText = `<em>${selectedText}</em>`
        break
      case "underline":
        formattedText = `<u>${selectedText}</u>`
        break
      case "align-left":
        formattedText = `<div style="text-align: left;">${selectedText}</div>`
        break
      case "align-center":
        formattedText = `<div style="text-align: center;">${selectedText}</div>`
        break
      case "align-right":
        formattedText = `<div style="text-align: right;">${selectedText}</div>`
        break
      case "list-ul":
        formattedText = `<ul><li>${selectedText}</li></ul>`
        break
      case "list-ol":
        formattedText = `<ol><li>${selectedText}</li></ol>`
        break
      case "link":
        const url = prompt("URL girin:", "https://")
        if (url) {
          formattedText = `<a href="${url}" style="color: #667eea; text-decoration: underline;">${selectedText}</a>`
        } else {
          return
        }
        break
      default:
        return
    }

    const currentHtml = block.htmlContent || `<p>${block.content || ""}</p>`
    const textBefore = currentHtml.substring(0, range.startOffset)
    const textAfter = currentHtml.substring(range.endOffset)
    const newHtml = textBefore + formattedText + textAfter

    updateBlock(blockId, { htmlContent: newHtml })
  }

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(generateEmailHtml())
        doc.close()
      }
    }
  }, [emailData])

  const copyFromIframe = async () => {
    if (!iframeRef.current) return

    try {
      const iframe = iframeRef.current
      const iframeWindow = iframe.contentWindow
      const iframeDoc = iframe.contentDocument || iframeWindow?.document

      if (!iframeDoc || !iframeWindow) {
        throw new Error("Iframe erişimi başarısız")
      }

      iframeWindow.focus()
      const range = iframeDoc.createRange()
      range.selectNodeContents(iframeDoc.body)

      const selection = iframeWindow.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)

      try {
        const htmlContent = generateEmailHtml()
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([htmlContent], { type: "text/html" }),
            "text/plain": new Blob([iframeDoc.body.innerText || ""], { type: "text/plain" }),
          }),
        ])
        alert("✅ Sanat bülteni formatlanmış olarak kopyalandı! Gmail/Outlook'a yapıştırabilirsiniz.")
      } catch (clipboardError) {
        const success = iframeDoc.execCommand("copy")
        if (success) {
          alert("✅ Sanat bülteni formatlanmış olarak kopyalandı! Gmail/Outlook'a yapıştırabilirsiniz.")
        } else {
          throw new Error("Kopyalama başarısız")
        }
      }

      selection?.removeAllRanges()
    } catch (err) {
      console.error("Kopyalama hatası:", err)
      alert("❌ Otomatik kopyalama başarısız. Lütfen 'Yeni Sekmede Aç' butonunu kullanın.")
    }
  }

  const openInNewTab = () => {
    const htmlContent = generateEmailHtml()
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")
  }

  const getBlockIcon = (type: string) => {
    switch (type) {
      case "header":
        return <Hash className="mr-2 h-4 w-4" />
      case "text":
        return <Type className="mr-2 h-4 w-4" />
      case "image":
        return <ImageIcon className="mr-2 h-4 w-4" />
      case "gallery":
        return <Grid3X3 className="mr-2 h-4 w-4" />
      case "quote":
        return <FileText className="mr-2 h-4 w-4" />
      case "button":
        return <MousePointer className="mr-2 h-4 w-4" />
      case "footer":
        return <FileText className="mr-2 h-4 w-4" />
      default:
        return <div className="mr-2 h-4 w-4 border-t-2 border-gray-400"></div>
    }
  }

  const getBlockName = (type: string) => {
    switch (type) {
      case "header":
        return "Başlık Bölümü"
      case "text":
        return "Metin Bölümü"
      case "image":
        return "Görsel Bölümü"
      case "gallery":
        return "Galeri Bölümü"
      case "quote":
        return "Alıntı Bölümü"
      case "button":
        return "Buton Bölümü"
      case "footer":
        return "Alt Bilgi Bölümü"
      case "divider":
        return "Ayırıcı"
      default:
        return "Bilinmeyen Bölüm"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Title Card */}
          <Card className="mb-4">
            <CardContent className="py-4">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  <Palette className="inline-block mr-2 h-8 w-8" />
                  Mail Şablonu Oluşturucu
                </h1>
                <p className="text-gray-600">
                  Blok blok ekleyerek tamamen özelleştirilebilir mail şablonları oluşturun
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Add Block Buttons - Compact */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-lg">Yeni Blok Ekle</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
                <Button
                  onClick={() => addBlock("header")}
                  variant="outline"
                  className="justify-center flex-col h-12 p-1"
                >
                  <Hash className="h-4 w-4 mb-1" />
                  <span className="text-xs">Başlık</span>
                </Button>
                <Button onClick={() => addBlock("text")} variant="outline" className="justify-center flex-col h-12 p-1">
                  <Type className="h-4 w-4 mb-1" />
                  <span className="text-xs">Metin</span>
                </Button>
                <Button
                  onClick={() => addBlock("image")}
                  variant="outline"
                  className="justify-center flex-col h-12 p-1"
                >
                  <ImageIcon className="h-4 w-4 mb-1" />
                  <span className="text-xs">Görsel</span>
                </Button>
                <Button
                  onClick={() => addBlock("gallery")}
                  variant="outline"
                  className="justify-center flex-col h-12 p-1"
                >
                  <Grid3X3 className="h-4 w-4 mb-1" />
                  <span className="text-xs">Galeri</span>
                </Button>
                <Button
                  onClick={() => addBlock("quote")}
                  variant="outline"
                  className="justify-center flex-col h-12 p-1"
                >
                  <FileText className="h-4 w-4 mb-1" />
                  <span className="text-xs">Alıntı</span>
                </Button>
                <Button
                  onClick={() => addBlock("button")}
                  variant="outline"
                  className="justify-center flex-col h-12 p-1"
                >
                  <MousePointer className="h-4 w-4 mb-1" />
                  <span className="text-xs">Buton</span>
                </Button>
                <Button
                  onClick={() => addBlock("divider")}
                  variant="outline"
                  className="justify-center flex-col h-12 p-1"
                >
                  <div className="h-4 w-4 mb-1 border-t-2 border-gray-400"></div>
                  <span className="text-xs">Ayırıcı</span>
                </Button>
                <Button
                  onClick={() => addBlock("footer")}
                  variant="outline"
                  className="justify-center flex-col h-12 p-1"
                >
                  <FileText className="h-4 w-4 mb-1" />
                  <span className="text-xs">Alt Bilgi</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Bülten İçeriği */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Mail İçeriği</h3>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                {emailData.blocks.length} Blok
              </span>
            </div>

            {emailData.blocks.map((block, index) => (
              <Card key={block.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center">
                      {getBlockIcon(block.type)}
                      {getBlockName(block.type)}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      <Button
                        onClick={() => moveBlock(block.id, "up")}
                        disabled={index === 0}
                        variant="ghost"
                        size="sm"
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => moveBlock(block.id, "down")}
                        disabled={index === emailData.blocks.length - 1}
                        variant="ghost"
                        size="sm"
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => deleteBlock(block.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Title field for applicable blocks */}
                  {(block.type === "text" ||
                    block.type === "image" ||
                    block.type === "gallery" ||
                    block.type === "quote" ||
                    block.type === "button") && (
                    <div>
                      <Label>Başlık (İsteğe Bağlı)</Label>
                      <Input
                        value={block.title || ""}
                        onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                        placeholder="Bölüm başlığı"
                      />
                    </div>
                  )}

                  {/* Content field for text-based blocks */}
                  {(block.type === "header" ||
                    block.type === "text" ||
                    block.type === "quote" ||
                    block.type === "button" ||
                    block.type === "footer") && (
                    <div>
                      <Label>İçerik</Label>
                      {block.type === "text" && (
                        <>
                          <div className="flex items-center space-x-2 mb-2">
                            <Label className="text-xs">Metin Tipi:</Label>
                            <Select
                              value={block.textType || "paragraph"}
                              onValueChange={(value) => updateBlock(block.id, { textType: value as any })}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="paragraph">Paragraf</SelectItem>
                                <SelectItem value="h1">Başlık 1</SelectItem>
                                <SelectItem value="h2">Başlık 2</SelectItem>
                                <SelectItem value="h3">Başlık 3</SelectItem>
                                <SelectItem value="h4">Başlık 4</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="bg-gray-50 p-2 rounded mb-2 flex flex-wrap gap-1">
                            <Button
                              onClick={() => formatText(block.id, "bold")}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Kalın"
                            >
                              <Bold className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => formatText(block.id, "italic")}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="İtalik"
                            >
                              <Italic className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => formatText(block.id, "underline")}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Altı Çizili"
                            >
                              <Underline className="h-4 w-4" />
                            </Button>
                            <div className="w-px h-8 bg-gray-300 mx-1"></div>
                            <Button
                              onClick={() => formatText(block.id, "align-left")}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Sola Hizala"
                            >
                              <AlignLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => formatText(block.id, "align-center")}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Ortala"
                            >
                              <AlignCenter className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => formatText(block.id, "align-right")}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Sağa Hizala"
                            >
                              <AlignRight className="h-4 w-4" />
                            </Button>
                            <div className="w-px h-8 bg-gray-300 mx-1"></div>
                            <Button
                              onClick={() => formatText(block.id, "list-ul")}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Madde İşaretleri"
                            >
                              <List className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => formatText(block.id, "list-ol")}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Numaralı Liste"
                            >
                              <ListOrdered className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => formatText(block.id, "link")}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Bağlantı"
                            >
                              <Link className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                      <Textarea
                        value={block.content || ""}
                        onChange={(e) => {
                          const newContent = e.target.value
                          updateBlock(block.id, {
                            content: newContent,
                            htmlContent: block.type === "text" ? `<p>${newContent}</p>` : undefined,
                          })
                        }}
                        placeholder="İçeriği buraya yazın..."
                        rows={block.type === "header" ? 2 : 4}
                      />
                    </div>
                  )}

                  {/* Button URL field */}
                  {block.type === "button" && (
                    <div>
                      <Label>Buton URL</Label>
                      <Input
                        value={block.buttonUrl || ""}
                        onChange={(e) => updateBlock(block.id, { buttonUrl: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                  )}

                  {/* Button Style field */}
                  {block.type === "button" && (
                    <div>
                      <Label>Buton Stili</Label>
                      <Select
                        value={block.buttonStyle || "primary"}
                        onValueChange={(value) => updateBlock(block.id, { buttonStyle: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Ana Buton</SelectItem>
                          <SelectItem value="secondary">İkincil Buton</SelectItem>
                          <SelectItem value="outline">Çerçeveli Buton</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Text Alignment for header and footer */}
                  {(block.type === "header" || block.type === "footer") && (
                    <div>
                      <Label>Metin Hizalama</Label>
                      <Select
                        value={block.textAlign || "center"}
                        onValueChange={(value) => updateBlock(block.id, { textAlign: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Sola Hizala</SelectItem>
                          <SelectItem value="center">Ortala</SelectItem>
                          <SelectItem value="right">Sağa Hizala</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Image URL field */}
                  {block.type === "image" && (
                    <div>
                      <Label>Görsel URL (Google Drive desteklenir)</Label>
                      <Input
                        value={block.imageUrl || ""}
                        onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                        placeholder="Görsel linki veya Google Drive linki"
                      />
                    </div>
                  )}

                  {/* Gallery images */}
                  {block.type === "gallery" && (
                    <div>
                      <Label>Galeri Görselleri (Maksimum 4)</Label>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="Görsel linki veya Google Drive linki"
                            className="flex-1"
                          />
                          <Button
                            onClick={() => {
                              if (newImageUrl.trim()) {
                                addImageToGallery(block.id, newImageUrl.trim())
                                setNewImageUrl("")
                              }
                            }}
                            disabled={!newImageUrl.trim() || (block.imageUrls?.length || 0) >= 4}
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {block.imageUrls && block.imageUrls.length > 0 && (
                          <div className="space-y-2">
                            {block.imageUrls.map((url, imgIndex) => (
                              <div key={imgIndex} className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                                <img
                                  src={convertGoogleDriveUrl(url) || "/placeholder.svg"}
                                  alt={`Görsel ${imgIndex + 1}`}
                                  className="w-10 h-10 object-cover rounded"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder.svg?height=40&width=40"
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-600 truncate">
                                    {url.length > 30 ? `${url.substring(0, 30)}...` : url}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => removeImageFromGallery(block.id, imgIndex)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Background Color for all blocks except divider */}
                  {block.type !== "divider" && (
                    <div>
                      <Label>Arkaplan Rengi</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={
                            block.backgroundColor?.includes("gradient") ? "#667eea" : block.backgroundColor || "#ffffff"
                          }
                          onChange={(e) => updateBlock(block.id, { backgroundColor: e.target.value })}
                          className="w-8 h-8 rounded border"
                        />
                        <Input
                          value={block.backgroundColor || "#ffffff"}
                          onChange={(e) => updateBlock(block.id, { backgroundColor: e.target.value })}
                          className="flex-1"
                          placeholder="Renk kodu veya gradient"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Column - Canlı Önizleme */}
          <div className="space-y-6">
            <div className="sticky top-[220px]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Eye className="mr-2 h-5 w-5" />
                    Canlı Önizleme
                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {emailData.blocks.length} Blok
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <iframe
                      ref={iframeRef}
                      className="w-full border-0"
                      title="Art Bulletin Preview"
                      style={{
                        height: "calc(100vh - 300px)",
                        minHeight: "500px",
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="mt-8">
          <Card>
            <CardContent className="py-4">
              <div className="flex justify-center space-x-4">
                <Button onClick={copyFromIframe} size="lg" className="px-8">
                  <Copy className="mr-2 h-5 w-5" />
                  Sanat Bültenini Kopyala
                </Button>

                <Button onClick={openInNewTab} variant="outline" size="lg" className="px-8 bg-transparent">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Yeni Sekmede Aç
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
