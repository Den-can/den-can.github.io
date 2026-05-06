# Deniz Can Dursun · Portfolio V7

**Tasarım dili:** HMI / Industrial Console (dark)
**Kişilik:** kontrol panosu + datasheet + teknik çizim parmak izi
**Renk:** koyu kömür + safety amber + process cyan + status green

V6 "Editorial Engineering" tasarımının ardından gelen V7, mekatronik mühendisi kimliğine doğrudan oturan bir endüstriyel konsol görsel diline sahip. Sayfa boyunca 8 mühendislik denklemi imza olarak kullanılır; rotor, dyno test bench, ölçüm cluster ve sonuç şematikleri V7 paletinde özel olarak çizilmiştir.

---

## Yapı

```
v7/
├── index.html                  ← TR ana sayfa
├── en/
│   ├── index.html              ← EN ana sayfa
│   └── projects/
│       ├── hopper-scale.html
│       ├── synrm-thesis-case-study.html
│       └── motor-testing-work.html
├── projects/
│   ├── hopper-scale.html
│   ├── synrm-thesis-case-study.html
│   └── motor-testing-work.html
├── assets/
│   ├── css/site.css            ← Tek stylesheet (HMI sistemi)
│   ├── js/site.js              ← Mobile drawer, scroll spy, filter, copy
│   ├── images/
│   │   ├── favicon.svg
│   │   ├── profile/            ← Portrait görselleri
│   │   ├── projects/           ← Hopper fotoğrafları + tez paneli + 4 motor SVG
│   │   ├── og/portfolio-cover.png
│   │   └── icons/
│   └── docs/cv/                ← TR ve EN CV PDF'leri
├── robots.txt
└── sitemap.xml
```

## Tasarım sistemi

### Renkler
| Token | HEX | Kullanım |
|---|---|---|
| `--bg` | `#0E1116` | Ana zemin |
| `--surface` | `#161A20` | Kart yüzeyi |
| `--rule` | `#2A3140` | İnce çizgiler |
| `--text` | `#E8E6E0` | Ana metin |
| `--muted` | `#8A8F98` | İkincil metin |
| `--amber` | `#E8A33D` | Birincil aksan |
| `--cyan` | `#5BC0DE` | İkincil aksan, q-eksenleri |
| `--green` | `#5DD39E` | Status/PASSED |

### Tipografi
- `Inter` 400/500 — başlık ve gövde
- `IBM Plex Mono` 400/500 — okunaklı sayılar, etiketler, denklemler

### Bölüm imzaları
Her bölüm bir mühendislik denklemiyle imzalanır:
- `§00` HERO — `τ = (3/2)·p·(L_d−L_q)·i_d·i_q` (saliency torku)
- `§01` PROFIL — `F = m·a` (newton)
- `§02` PROJELER — `P = √3·V·I·cosφ` (üç-faz güç)
- `§03` TEZ — `∇×H = J + ∂D/∂t` (ampere-maxwell)
- `§04` DENEYIM — `MTBF = ΣT_uptime / N_arıza`
- `§05` EĞITIM — `ε = −dΦ/dt` (faraday)
- `§06` ARAÇLAR — `u(t) = K_p·e + K_i·∫e dt` (PI kontrolör)
- `§07` İLETIŞIM — `ω = 2π·f / p` (senkron hız)

Footer: TR `ölç, doğrula, çalıştır` · EN `measure, verify, run`

---

## Deploy

Sıfır build adımı. Tüm dosyalar statik. GitHub Pages, Netlify, Vercel veya basit bir CDN'ye doğrudan upload edilir.

### GitHub Pages

```bash
# Kök repo (denizcandursun/denizcandursun.github.io) içine
git add .
git commit -m "Portfolio V7 · HMI konsol"
git push origin main
```

Site `https://denizcandursun.github.io/` adresinde yayına girer.

### Yerel önizleme

```bash
cd v7
python3 -m http.server 8765
# http://localhost:8765/  (TR)
# http://localhost:8765/en/  (EN)
```

---

## Bakım notları

### Stillerde değişiklik
Tek `assets/css/site.css` (~1700 satır). Anlamlı bölümler:
1. Reset/temel — token değişkenleri ve grid arka plan
2. Tipografi
3. Topbar / mobile drawer
4. Section shell (panel-tab, signature)
5. Hero (panel + rotor SVG stili + readouts)
6. Profile, projects, thesis, experience, education, toolkit, contact
7. Footer, toast
8. Subpage (subpage-hero, content-section, scope-grid, related-grid)
9. Responsive: 980px ve 640px breakpoint'leri

### Yeni proje eklemek
1. `assets/images/projects/` altına görselleri koy
2. `index.html` içinde mevcut `<article class="project-card">` bloğunu kopyalayıp düzenle (slug, başlık, spec'ler, CTA)
3. `projects/<slug>.html` ve `en/projects/<slug>.html` için mevcut alt sayfaları template olarak kullan
4. `sitemap.xml`'e iki URL ekle (TR + EN)

### Motor test SVG'lerini yeniden üretmek
SVG'ler Python ile programatik üretildi (`motor-testing-{hero,procedure,measurement,reporting}.svg`). Renk ya da geometri değiştirmek için palet sabitlerini güncelleyip script'i tekrar çalıştırmak yeterli. (Build sürecinde `gen_motor_svgs.py` kullanıldı.)

### Rotor SVG (hero)
`index.html` içinde inline. 24 stator dişi, 4 kutuplu rotor, her kutupta 3 nested akı bariyeri, 4 d-ekseni (amber dashed) + 4 q-ekseni (cyan dashed), animasyonlu 4 akı çizgisi. CSS değişkenleriyle renklenir; tema değişiminde otomatik adapte olur.

---

## Erişilebilirlik

- Tüm renk kontrastları WCAG AA seviyesinin üstünde (HMI palette amber/text üzerinde)
- Skip link, ARIA labels, semantic landmarks
- Reduced motion kullanıcıları için `prefers-reduced-motion` desteği
- Tab odakları görünür (`outline: 2px solid var(--amber)`)
- Mobile breakpoint'lerinde nav drawer ile menü erişimi

---

## Lisans / haklar

İçerik (yazı, fotoğraf, PDF, akademik metin): © Deniz Can Dursun.
Kod (HTML/CSS/JS, SVG generator script'leri): kişisel portfolyo kullanımı için.
