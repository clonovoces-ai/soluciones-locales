# 🚀 Soluciones Digitales para Comercios Locales (Suite & Ecosistema)

> Plataforma integral de captación, prospección automatizada y soluciones digitales llave en mano para comercios locales de barrio (Barberías, Salones de Belleza/Uñas, Pet Shops, Gastronomía, Comercios de Indumentaria y Comercios con Venta de Mostrador).

---

## 📌 Tabla de Contenidos
1. [Estructura del Proyecto](#-estructura-del-proyecto)
2. [Soluciones Incluidas en el Repositorio](#-soluciones-incluidas-en-el-repositorio)
3. [Requisitos Previos](#-requisitos-previos)
4. [Instalación y Configuración](#-instalación-y-configuración)
5. [Ejecución en Entorno Local](#-ejecución-en-entorno-local)
6. [Sistema de Demostraciones Dinámicas (?demo=Nombre)](#-sistema-de-demostraciones-dinámicas-demonombredelocal)
7. [Scripts de Prospección y Enriquecimiento](#-scripts-de-prospección-y-enriquecimiento-python)
8. [Software de Caja Offline (Tauri + React)](#-software-de-caja-offline-software_para_caja)
9. [Despliegue a Producción (Vercel)](#-despliegue-a-producción-vercel)
10. [Flujo de Trabajo para Nuevos Clientes](#-flujo-de-trabajo-para-nuevos-clientes)

---

## 📂 Estructura del Proyecto

```text
comercios_locales/
├── web-padre/                 # Portal central SaaS (sd.adrianschuster.com.ar)
├── demo-barberia/             # Sistema de turnos para Barberías (turnos.adrianschuster.com.ar)
├── demo-unas/                 # Sistema de turnos para Belleza & Uñas (unas.adrianschuster.com.ar)
├── demo-mascotas/             # Pet Shop & Peluquería Canina (petshop.adrianschuster.com.ar)
├── demo-landing/              # Landing gastronómica & Carta digital (landing.adrianschuster.com.ar)
├── demo-ecommerce/            # Catálogo online & Pedidos WhatsApp (ecommerce.adrianschuster.com.ar)
├── software_para_caja/        # Sistema POS Desktop offline (Tauri 2 + React + Tailwind)
├── cotizador_privado/         # Calculadora de presupuestos y márgenes comerciales
├── clientes/                  # Bases de prospectos y tarifarios en Excel (.xlsx) y CSV
├── buscar_locales_caba.py     # Scraper/prospector de comercios en Google Maps/OSM
├── buscar_belleza_caba.py     # Scraper específico para salones de belleza y uñas
├── buscar_petshops_caba.py    # Scraper específico para pet shops y veterinarias
├── enriquecer_excel.py        # Generador de links demo y mensajes WhatsApp personalizados
├── flyer_publicitario.txt     # Copy y material gráfico para folletería de calle
├── README.md                  # Documentación del proyecto
└── .gitignore                 # Configuración de exclusiones de Git
```

---

## 💼 Soluciones Incluidas en el Repositorio

| Módulo | Tipo | Tecnologías | Propósito Comercial |
| :--- | :--- | :--- | :--- |
| **`web-padre`** | Web Portal | HTML, Tailwind CSS, TypeScript, Vite | Portal de agencia que consolida la propuesta de valor y las demos en vivo. |
| **`demo-barberia`** | Web App | TypeScript, Vite, Tailwind CSS (Bebas Neue) | Turnero rápido en 3 pasos con selección de barbero, día y horario, directo a WhatsApp. |
| **`demo-unas`** | Web App | TypeScript, Vite, Tailwind CSS (Playfair Display) | Turnos estética con voucher visual, retiro previo y confirmación instantánea. |
| **`demo-mascotas`** | Web App | TypeScript, Vite, Tailwind CSS (Varela Round) | Pet Shop + Turnero de peluquería canina por tamaño (chico, mediano, grande). |
| **`demo-landing`** | Web App | TypeScript, Vite, Tailwind CSS (Fraunces) | Carta digital y reserva de mesas para bodegones y gastronomía. |
| **`demo-ecommerce`** | Web App | TypeScript, Vite, Tailwind CSS (Plus Jakarta Sans) | Catálogo para comercios minoristas con carrito y checkout por WhatsApp. |
| **`software_para_caja`**| Desktop POS | Rust, Tauri 2.0, React 18, Tailwind CSS | Sistema de punto de venta offline, lector de código de barras, turnos de caja y auditoría. |

---

## ⚙️ Requisitos Previos

Antes de comenzar, asegurate de tener instalado en tu sistema:

1. **Node.js** (versión 18.x o 20.x LTS recomendada).
   - Descarga: [nodejs.org](https://nodejs.org/)
   - Verificá con: `node -v` y `npm -v`
2. **Python** (versión 3.9 o superior para ejecutar los scripts de prospección).
   - Descarga: [python.org](https://python.org/)
   - Verificá con: `python --version`
3. **Git** para clonar el repositorio.
4. *(Opcional - solo para compilar el Software de Caja Desktop)*:
   - **Rust & Cargo**: [rustup.rs](https://rustup.rs/)
   - Build Tools de C++ (Visual Studio Build Tools en Windows con "Desktop development with C++").

---

## 📥 Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/clonovoces-ai/soluciones-locales.git
   cd soluciones-locales
   ```

2. **Instalar dependencias de los proyectos web:**
   Cada subdirectorio es una aplicación Vite independiente:
   ```bash
   # Portal central
   cd web-padre && npm install && cd ..

   # Demos
   cd demo-barberia && npm install && cd ..
   cd demo-unas && npm install && cd ..
   cd demo-mascotas && npm install && cd ..
   cd demo-landing && npm install && cd ..
   cd demo-ecommerce && npm install && cd ..

   # Software de caja (opcional)
   cd software_para_caja && npm install && cd ..
   ```

3. **Instalar librerías de Python (para prospección):**
   ```bash
   pip install pandas openpyxl requests
   ```

---

## 💻 Ejecución en Entorno Local

Cada demo y portal puede levantarse individualmente con su script de desarrollo:

| Proyecto | Comando | Puerto Local |
| :--- | :--- | :--- |
| **Portal General (`web-padre`)** | `cd web-padre && npm run dev` | `http://localhost:3000` |
| **Demo Belleza & Uñas (`demo-unas`)** | `cd demo-unas && npm run dev` | `http://localhost:5175` |
| **Demo Barbería (`demo-barberia`)** | `cd demo-barberia && npm run dev` | `http://localhost:5176` |
| **Demo Catálogo E-Commerce (`demo-ecommerce`)**| `cd demo-ecommerce && npm run dev` | `http://localhost:5177` |
| **Demo Pet Shop (`demo-mascotas`)** | `cd demo-mascotas && npm run dev` | `http://localhost:5178` |
| **Demo Gastronomía (`demo-landing`)** | `cd demo-landing && npm run dev` | `http://localhost:5174` |

> 💡 **Tip:** Todas las aplicaciones cuentan con resolución de links automática. Si corren en `localhost`, el portal principal enlaza a los puertos locales (`5174`-`5178`), y en producción enlaza a sus respectivos subdominios de forma transparente.

---

## 🎯 Sistema de Demostraciones Dinámicas (`?demo=NombreDelLocal`)

Uno de los mayores diferenciadores comerciales de este proyecto es que **no requiere compilar ni duplicar código para cada cliente nuevo**.

Todas las demos leen los parámetros `?demo=`, `?local=` o `?nombre=` en la URL:
- `https://turnos.adrianschuster.com.ar/?demo=Leitokids+Peluquer%C3%ADa+Infantil`
- `https://petshop.adrianschuster.com.ar/?demo=Mi+Veterinaria`
- `https://unas.adrianschuster.com.ar/?demo=Studio+Bella`

### ¿Qué hace automáticamente?
1. Reemplaza el título y la marca por el nombre real del cliente.
2. Muestra un banner flotante personalizado: *"Boceto interactivo de demostración preparado para [Nombre del Cliente]"*.
3. Permite al cliente probar la experiencia como si ya fuera su propia página web.

---

## 🔍 Scripts de Prospección y Enriquecimiento (Python)

El proyecto incluye un pipeline automatizado para encontrar comercios locales en Google Maps / OpenStreetMap y generar propuestas personalizadas:

1. **Búsqueda de prospectos en CABA / GBA:**
   ```bash
   python buscar_belleza_caba.py
   python buscar_petshops_caba.py
   python buscar_locales_caba.py
   ```
   *Genera planillas `.csv` y `.xlsx` filtrando por comercios con teléfono y sin sitio web propio.*

2. **Enriquecimiento con enlaces y copys de WhatsApp:**
   ```bash
   python enriquecer_excel.py
   ```
   *Agrega una columna con la URL interactiva personalizada (`?demo=...`) y el mensaje exacto sugerido para enviar por WhatsApp al dueño del negocio.*

3. **Gestión de historial:**
   - [`historial_manager.py`](file:///c:/Users/Adrian/Desktop/comercios_locales/historial_manager.py) y [`historial_contactados.json`](file:///c:/Users/Adrian/Desktop/comercios_locales/historial_contactados.json) evitan contactar dos veces al mismo comercio.

---

## 🖥️ Software de Caja Offline (`software_para_caja`)

Un sistema de punto de venta desarrollado con **React**, **Vite**, **Tailwind CSS** y empaquetado como aplicación de escritorio nativa mediante **Tauri 2.0 (Rust)**.

### Características:
- 100% offline (sin necesidad de conexión a internet para operar).
- Lector de código de barras USB/Bluetooth en tiempo real.
- Control de caja ciega, aperturas, retiros y arqueo de turnos.
- Control de stock, alertas de reposición y actualización masiva de precios por porcentaje.
- Historial y registro de auditoría con PIN para supervisores.

### Cómo ejecutarlo:
```bash
cd software_para_caja

# Modo Web en navegador
npm run dev

# Modo Desktop Nativo (requiere Rust instalado)
npm run tauri:dev
```

### Cómo compilar el instalador para Windows (.exe):
```bash
cd software_para_caja
npm run tauri:build
```
*El ejecutable resultante se genera en `software_para_caja/src-tauri/target/release/bundle/nsis/`.*

---

## ☁️ Despliegue a Producción (Vercel)

El proyecto está diseñado para desplegarse con costo de infraestructura \$0 en **Vercel**:

1. Subir los cambios a GitHub en la rama `main`:
   ```bash
   git add .
   git commit -m "feat: nuevas mejoras en el ecosistema"
   git push origin main
   ```
2. En [Vercel Dashboard](https://vercel.com/):
   - Importá el repositorio de GitHub.
   - Creá un proyecto por cada subdirectorio especificando el **Root Directory**:
     - Proyecto 1: `web-padre` -> Dominio: `sd.adrianschuster.com.ar`
     - Proyecto 2: `demo-barberia` -> Dominio: `turnos.adrianschuster.com.ar`
     - Proyecto 3: `demo-unas` -> Dominio: `unas.adrianschuster.com.ar`
     - Proyecto 4: `demo-mascotas` -> Dominio: `petshop.adrianschuster.com.ar`
     - Proyecto 5: `demo-landing` -> Dominio: `landing.adrianschuster.com.ar`
     - Proyecto 6: `demo-ecommerce` -> Dominio: `ecommerce.adrianschuster.com.ar`
3. Framework Preset: **Vite** (Build command: `npm run build`, Output directory: `dist`).

---

## 📋 Flujo de Trabajo para Nuevos Clientes

1. **Prospectar:** Correr el script del rubro deseado (ej. `python buscar_petshops_caba.py`).
2. **Generar Propuesta:** Abrir el Excel generado en `clientes/`, verificar el teléfono del comercio y copiar el link con la demo personalizada.
3. **Enviar Mensaje:** Contactar al comercio ofreciendo el boceto sin costo de visualización.
4. **Cierre:** Al confirmar el servicio, se configuran sus servicios, precios y horarios reales en el archivo del proyecto correspondiente o se duplica como cliente dedicado.

---

## 📄 Licencia

Este proyecto es de uso privado para comercialización y despliegue de soluciones para comercios locales.
Desarrollado y mantenido por **Adrián Schuster**.
