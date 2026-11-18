# 1. Aşama: React projesini derle (Build)
FROM node:20-alpine AS builder
WORKDIR /app

# Bağımlılık dosyalarını kopyala ve paketleri yükle
COPY package*.json ./
RUN npm install

# Tüm kaynak kodları kopyala ve projeyi derle
COPY . .
RUN npm run build

# 2. Aşama: Nginx ile yayınla (Serve)
FROM nginx:alpine

# Derlenen dosyaları (dist klasörü) Nginx'in html dizinine kopyala
COPY --from=builder /app/dist /usr/share/nginx/html

# Kendi yazdığımız Nginx ayarlarını kopyala (API yönlendirmesi için)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]