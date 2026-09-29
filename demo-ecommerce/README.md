# 🏪 Plantilla Web & Catálogo para Comercios Locales

Esta plantilla está pensada para **vender y desplegar sitios web con catálogo y pedidos por WhatsApp en menos de 10 minutos** a comercios de tu zona (kioscos, almacenes, fiambrerías, rotiserías, dietéticas, pet shops, etc.).

---

## 🚀 Características incluidas

1. **Catálogo Mobile-First**: 100% responsivo, diseñado para comprar desde celulares en segundos.
2. **Carrito de Compras con Envío a WhatsApp**:
   - Calcula subtotal, descuentos por pago en efectivo y total.
   - Pide nombre, forma de entrega (retiro en local o delivery a domicilio) y método de pago.
   - Genera un mensaje formateado y prolijo que se abre directo en el WhatsApp del comerciante.
3. **Buscador en tiempo real & Filtro por Categorías**: Busca por nombre, descripción o código de barras.
4. **Carga Masiva con Excel (.xlsx)**:
   - Permite que el comerciante o vos suban un archivo Excel para actualizar todos los productos y precios al instante.
   - Botón para descargar una planilla modelo `.xlsx` pre-configurada.
5. **Configuración Rápida en 1 solo archivo**: En `src/config.ts` cambiás nombre, WhatsApp, redes, dirección y horarios.
6. **Costo de Servidor \$0**: Compila a HTML/JS/CSS estático ultraliviano, ideal para **Vercel** o **Cloudflare Pages**.

---

## 🛠️ Cómo probarla en tu computadora

```bash
# 1. Entrar a la carpeta
cd plantilla-comercio-local

# 2. Instalar dependencias (si no lo hiciste)
npm install

# 3. Iniciar el servidor local
npm run dev
```

Abrí el navegador en la URL que muestra la consola (por ejemplo, `http://localhost:5173`).

---

## 🎨 Cómo personalizarla para un cliente nuevo (en 2 minutos)

1. Abrí [`src/config.ts`](file:///C:/Users/Adrian/.gemini/antigravity/scratch/plantilla-comercio-local/src/config.ts):
   - Cambiá `name`: Nombre de la tienda.
   - Cambiá `whatsapp`: Número con código de país y de área (ej: `5491122334455`).
   - Cambiá `address`, `mapsUrl`, `hours`, `instagram`.
2. Abrí [`src/products.ts`](file:///C:/Users/Adrian/.gemini/antigravity/scratch/plantilla-comercio-local/src/products.ts) o usá el botón **"Cargar Excel"** en la web para cargar los productos reales del cliente.

---

## ☁️ Cómo desplegarla a Producción

### Opción A: Vercel (Recomendada y más rápida)
1. Subí tu código a un repositorio de GitHub (público o privado).
2. Entrá en [vercel.com](https://vercel.com) e iniciá sesión con GitHub.
3. Hacé clic en **"Add New Project"** y seleccioná el repositorio.
4. Vercel detectará automáticamente que es un proyecto **Vite** (Framework Preset: Vite, Build Command: `npm run build`, Output: `dist`).
5. Hacé clic en **"Deploy"**. En 30 segundos tenés una URL gratis `tu-proyecto.vercel.app` con certificado SSL incluido.

### Opción B: Cloudflare Pages (Directo o Drag & Drop)
1. Ejecutá en tu consola:
   ```bash
   npm run build
   ```
   Esto generará la carpeta `dist/`.
2. En tu panel de Cloudflare, andá a **Workers & Pages** > **Create application** > **Pages**.
3. Podés conectar tu repositorio de GitHub o simplemente arrastrar y soltar la carpeta `dist/`.

---

## 🌐 Cómo vincular un Dominio propio (ej: `.com` o `.com.ar`)

1. **Si es `.com` en Cloudflare / Namecheap / Porkbun:**
   - En Vercel o Cloudflare Pages andá a **Settings** > **Domains**.
   - Ingresá el dominio del cliente (ej: `kioscosantelmo.com`).
   - Te indicará agregar un registro CNAME o A en tu proveedor de DNS.
2. **Si es `.com.ar` en NIC.ar:**
   - Creá una cuenta gratis en **Cloudflare** y agregá el dominio del cliente.
   - Cloudflare te dará 2 DNS (ej: `dns1.cloudflare.com` y `dns2.cloudflare.com`).
   - En **NIC.ar**, delegá el dominio apuntando a esos 2 DNS de Cloudflare.
   - Luego, desde Cloudflare Pages o Vercel vinculás el dominio con 1 clic.

---

## 💼 Checklist comercial para cerrar ventas

1. **Armate una Demo con tu celular**:
   - Abrí esta plantilla en tu teléfono.
   - Andá al local y mostrale cómo se ve: cargá 2 alfajores y una gaseosa en el carrito, tocá "Pedir por WhatsApp" y mostrale cómo le llega el pedido impecable a su WhatsApp.
2. **Propuesta de Precio:**
   - **Setup Inicial (Diseño + Carga inicial de productos):** Cobro único accesible.
   - **Abono mensual de Mantenimiento:** Para cubrir dominio, pequeños cambios de precios y soporte técnico.
3. **El argumento clave**:
   - *"No pagás comisiones del 25% como en las apps de delivery (PedidosYa / Rappi), el cliente te compra directo a vos por WhatsApp y vos te quedás con el 100% de la ganancia."*
