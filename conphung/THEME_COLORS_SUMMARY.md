# 🎨 Theme Colors Summary - 3 Themes Mới

## 1. 🌊 Theme "songnuoc" - Sông Nước Miền Tây

### Màu Chủ Đạo (Tailwind)
- **Primary**: `blue-500` → `blue-600` (#3b82f6 → #2563eb)
- **Secondary**: `cyan-500` → `cyan-600` (#06b6d4 → #0891b2)
- **Background**: `blue-50` → `cyan-50` (gradient)
- **Text**: `blue-900` (#1e3a8a)
- **Accent**: `cyan-400`

### Gradient Buttons
```css
bg-gradient-to-r from-blue-500 to-cyan-500
hover:from-blue-600 hover:to-cyan-600
```

### Background Patterns
- Water waves pattern (SVG)
- Blue/cyan gradients
- Opacity layers for depth

---

## 2. 🍎 Theme "vuontraicay" - Miệt Vườn Trái Cây

### Màu Chủ Đạo (Tailwind)
- **Primary**: `green-500` → `green-600` (#22c55e → #16a34a)
- **Secondary**: `yellow-500` → `yellow-600` (#eab308 → #ca8a04)
- **Background**: `green-50` → `yellow-50` (gradient)
- **Text**: `green-900` (#14532d)
- **Accent**: `orange-500`

### Gradient Buttons
```css
bg-gradient-to-r from-green-500 to-yellow-500
hover:from-green-600 hover:to-yellow-600
```

### Background Patterns
- Fruit pattern (circles)
- Green/yellow gradients
- Vibrant, fresh feeling

---

## 3. 🌳 Theme "rungtram" - Rừng Tràm Sân Chim

### Màu Chủ Đạo (Tailwind)
- **Primary**: `green-700` → `green-800` (#15803d → #166534)
- **Secondary**: `stone-700` → `stone-800` (#44403c → #292524)
- **Background**: `stone-50` → `green-50` (gradient)
- **Text**: `green-900` (#14532d) + `stone-700`
- **Accent**: `green-600`

### Gradient Buttons
```css
bg-gradient-to-r from-green-700 to-stone-700
hover:from-green-600 hover:to-stone-600
```

### Background Patterns
- Swamp/forest pattern (SVG)
- Green/stone gradients
- Natural, rustic feeling

---

## 📊 So Sánh Màu Sắc

| Theme | Primary | Secondary | Background | Mood |
|-------|---------|-----------|------------|------|
| **songnuoc** | Blue (#3b82f6) | Cyan (#06b6d4) | Blue-50 | Mát mẻ, sông nước |
| **vuontraicay** | Green (#22c55e) | Yellow (#eab308) | Green-50 | Tươi mát, vui tươi |
| **rungtram** | Green-700 (#15803d) | Stone-700 (#44403c) | Stone-50 | Hoang sơ, thiên nhiên |

---

## 🎯 Custom Tailwind Colors (Nếu cần)

Có thể thêm vào `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      'songnuoc': {
        primary: '#3b82f6',
        secondary: '#06b6d4',
      },
      'vuontraicay': {
        primary: '#22c55e',
        secondary: '#eab308',
      },
      'rungtram': {
        primary: '#15803d',
        secondary: '#44403c',
      },
    },
  },
}
```

---

## 📝 Usage Examples

### songnuoc
```tsx
<div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
  <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
    Button
  </button>
</div>
```

### vuontraicay
```tsx
<div className="bg-gradient-to-br from-green-500 to-yellow-500 text-white">
  <button className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600">
    Button
  </button>
</div>
```

### rungtram
```tsx
<div className="bg-gradient-to-br from-green-700 to-stone-700 text-white">
  <button className="bg-gradient-to-r from-green-700 to-stone-700 hover:from-green-600 hover:to-stone-600">
    Button
  </button>
</div>
```

---

**Note**: Tất cả màu sắc đều sử dụng Tailwind CSS default colors, không cần custom config.

