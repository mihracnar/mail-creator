# 🚀 GitHub Pages Deployment Rehberi

Bu rehber, Sanat Bülteni Oluşturucu'yu GitHub Pages'te nasıl deploy edeceğinizi adım adım açıklar.

## 📋 Ön Gereksinimler

- GitHub hesabı
- Git kurulu
- Node.js kurulu (v18 veya üzeri)

## 🔧 Kurulum Adımları

### 1. Repository Oluşturma

1. GitHub'da yeni bir repository oluşturun
2. Repository adını not edin (örn: `sanat-bulteni-olusturucu`)

### 2. Kodu Upload Etme

\`\`\`bash
# Projeyi klonlayın veya indirin
git clone <your-repo-url>
cd <your-repo-name>

# Bağımlılıkları yükleyin
npm install

# İlk commit
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

### 3. Base Path Ayarlama (Opsiyonel)

Eğer repository adınız domain'inizden farklıysa, `next.config.mjs` dosyasında base path ayarlayın:

\`\`\`javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: '/your-repository-name',
  assetPrefix: '/your-repository-name/',
}
\`\`\`

### 4. GitHub Pages Ayarları

1. Repository'nizde **Settings** sekmesine gidin
2. Sol menüden **Pages** seçin
3. **Source** olarak **GitHub Actions** seçin

### 5. Deploy

Artık `main` branch'e her push yaptığınızda otomatik deploy olacak:

\`\`\`bash
git add .
git commit -m "Update content"
git push origin main
\`\`\`

## 🌐 Erişim

Deploy tamamlandıktan sonra sitenize şu adresten erişebilirsiniz:

\`\`\`
https://your-username.github.io/your-repository-name/
\`\`\`

## 🔍 Sorun Giderme

### Build Hatası
- `npm run build` komutunu lokal olarak çalıştırıp hataları kontrol edin
- Dependencies'lerin doğru yüklendiğinden emin olun

### 404 Hatası
- Base path ayarlarını kontrol edin
- Repository adının doğru olduğundan emin olun

### Görsel Yüklenmeme
- `next.config.mjs`'de `images.unoptimized: true` olduğundan emin olun
- Görsel URL'lerinin doğru olduğunu kontrol edin

## 📊 Build Status

Repository'nizde Actions sekmesinden build durumunu takip edebilirsiniz.

## 🔄 Güncelleme

Yeni özellikler eklemek için:

1. Değişiklikleri yapın
2. Test edin: `npm run dev`
3. Build edin: `npm run build`
4. Push edin: `git push origin main`

## 💡 İpuçları

- Her commit otomatik deploy tetikler
- Build süresi yaklaşık 2-3 dakika
- Cache temizleme için hard refresh yapın (Ctrl+F5)

## 🆘 Yardım

Sorun yaşıyorsanız:
1. GitHub Actions loglarını kontrol edin
2. Browser console'da hata mesajlarına bakın
3. Issue açın veya documentation'ı kontrol edin
