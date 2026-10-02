import asyncio
import os
import sys
import urllib.parse
from playwright.async_api import async_playwright
import pandas as pd
from historial_manager import cargar_historial, es_duplicado, registrar_prospecto
from enriquecer_excel import enrich_excel

sys.stdout.reconfigure(encoding='utf-8')

# Lista de búsquedas especializadas en el rubro Belleza, Barberías, Peluquerías y Uñas en CABA
BUSQUEDAS_BELLEZA = [
    # 1. Barberías
    {"query": "barberias en palermo caba", "rubro": "Barbería", "solucion": "Sistema de Turnos Online"},
    {"query": "barberias en belgrano caba", "rubro": "Barbería", "solucion": "Sistema de Turnos Online"},
    {"query": "barberias en recoleta caba", "rubro": "Barbería", "solucion": "Sistema de Turnos Online"},
    {"query": "barberias en villa urquiza caba", "rubro": "Barbería", "solucion": "Sistema de Turnos Online"},
    {"query": "barberias en villa devoto caba", "rubro": "Barbería", "solucion": "Sistema de Turnos Online"},
    
    # 2. Peluquerías y Estilistas
    {"query": "peluquerias en caballito caba", "rubro": "Peluquería / Estilista", "solucion": "Sistema de Turnos Online"},
    {"query": "peluquerias en palermo caba", "rubro": "Peluquería / Estilista", "solucion": "Sistema de Turnos Online"},
    {"query": "estilistas salon de belleza en almagro caba", "rubro": "Estilista / Salón de Belleza", "solucion": "Sistema de Turnos Online"},
    {"query": "peluquerias en villa crespo caba", "rubro": "Peluquería / Estilista", "solucion": "Sistema de Turnos Online"},
    {"query": "peluquerias en belgrano caba", "rubro": "Peluquería / Estilista", "solucion": "Sistema de Turnos Online"},
    {"query": "peluquerias en flores caba", "rubro": "Peluquería / Estilista", "solucion": "Sistema de Turnos Online"},

    # 3. Uñas, Manicuría & Nail Salons
    {"query": "salon de uñas manicure en palermo caba", "rubro": "Uñas & Manicuría", "solucion": "Sistema de Turnos Online"},
    {"query": "nail salon uñas esculpidas en belgrano caba", "rubro": "Uñas & Manicuría", "solucion": "Sistema de Turnos Online"},
    {"query": "unas manicure en caballito caba", "rubro": "Uñas & Manicuría", "solucion": "Sistema de Turnos Online"},
    {"query": "salon de uñas en recoleta caba", "rubro": "Uñas & Manicuría", "solucion": "Sistema de Turnos Online"},
    {"query": "uñas esculpidas en villa crespo caba", "rubro": "Uñas & Manicuría", "solucion": "Sistema de Turnos Online"},

    # 4. Estética, Cejas & Pestañas
    {"query": "centro de estetica cejas y pestañas en palermo caba", "rubro": "Estética & Pestañas", "solucion": "Sistema de Turnos Online"},
    {"query": "estetica corporal y facial en caballito caba", "rubro": "Centro de Estética", "solucion": "Sistema de Turnos Online"},
    {"query": "estudio de cejas y pestañas en belgrano caba", "rubro": "Estética & Pestañas", "solucion": "Sistema de Turnos Online"}
]

async def scrape_belleza_leads(max_places_per_query=15, output_dir="clientes", filename="prospectos_belleza_caba.xlsx"):
    os.makedirs(output_dir, exist_ok=True)
    output_excel = os.path.join(output_dir, filename)
    output_csv = os.path.join(output_dir, filename.replace(".xlsx", ".csv"))
    
    print("=" * 70)
    print("✂️  INICIANDO PROSPECCIÓN: BARBERÍAS, PELUQUERÍAS, ESTILISTAS Y UÑAS")
    print("📍 Zona: CABA (Todo Buenos Aires)")
    print("🔍 Filtro estricto: CON TELÉFONO + SIN SITIO WEB + SIN DUPLICADOS PREVIOS")
    
    historial = cargar_historial()
    print(f"📚 Historial cargado: {len(historial)} comercios previos registrados para descartar duplicados.")
    print(f"📂 Carpeta de destino: {os.path.abspath(output_dir)}")
    print("=" * 70)
    
    leads = []
    vistos_sesion = set()
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)
        context = await browser.new_context(
            locale="es-419",
            viewport={"width": 1280, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        # Aceptar cookies la primera vez
        try:
            await page.goto("https://www.google.com/maps", wait_until="domcontentloaded", timeout=20000)
            btn = page.locator('button:has-text("Aceptar todo"), button:has-text("Acepto")')
            if await btn.count() > 0:
                await btn.first.click()
                await page.wait_for_timeout(1500)
        except Exception:
            pass
            
        for idx, item in enumerate(BUSQUEDAS_BELLEZA, 1):
            query = item["query"]
            rubro = item["rubro"]
            solucion = item["solucion"]
            
            search_url = f"https://www.google.com/maps/search/{urllib.parse.quote_plus(query)}"
            print(f"\n[{idx}/{len(BUSQUEDAS_BELLEZA)}] 🔎 Buscando: '{query}'...")
            
            try:
                await page.goto(search_url, wait_until="domcontentloaded", timeout=25000)
                await page.wait_for_timeout(3500)
                
                # Desplazar feed de resultados
                feed = page.locator('div[role="feed"]')
                if await feed.count() > 0:
                    for _ in range(4):
                        await feed.evaluate("el => el.scrollBy(0, 1500)")
                        await page.wait_for_timeout(1000)
                        
                place_links = page.locator('a[href*="/maps/place/"]')
                total_links = await place_links.count()
                print(f"   Locales detectados en mapa: {total_links}")
                
                encontrados_en_query = 0
                for i in range(min(total_links, max_places_per_query)):
                    try:
                        link = place_links.nth(i)
                        name = await link.get_attribute("aria-label")
                        if not name:
                            continue
                            
                        # Click para abrir ficha
                        await link.click()
                        await page.wait_for_timeout(1800)
                        
                        # Extraer información
                        elements = page.locator('[aria-label]')
                        total_el = await elements.count()
                        
                        phone = ""
                        has_website = False
                        address = ""
                        
                        for el_idx in range(total_el):
                            al = await elements.nth(el_idx).get_attribute("aria-label")
                            if not al:
                                continue
                            if al.startswith("Teléfono:"):
                                phone = al.replace("Teléfono:", "").strip()
                            elif al.startswith("Sitio web:"):
                                has_website = True
                            elif al.startswith("Dirección:"):
                                address = al.replace("Dirección:", "").strip()
                                
                        # Si tiene teléfono y NO tiene web
                        if phone and not has_website:
                            # 1. Filtro contra historial previo
                            if es_duplicado(name, phone, historial):
                                print(f"   ⏩ [Omitido - Ya en historial]: {name} ({phone})")
                                continue
                                
                            # 2. Filtro contra la sesión actual
                            key = f"{name.strip().lower()}_{phone}"
                            if key in vistos_sesion:
                                continue
                                
                            vistos_sesion.add(key)
                            encontrados_en_query += 1
                            
                            # Rating
                            rating = ""
                            try:
                                r_loc = page.locator('div.F7nice span[aria-hidden="true"]').first
                                if await r_loc.count() > 0:
                                    rating = (await r_loc.inner_text()).strip()
                            except Exception:
                                pass
                                
                            lead_data = {
                                "Comercio": name,
                                "Rubro": rubro,
                                "Teléfono": phone,
                                "Dirección": address or "CABA",
                                "Rating": rating or "-",
                                "Tiene Web": "NO",
                                "Solución Sugerida": solucion,
                                "Google Maps": page.url
                            }
                            leads.append(lead_data)
                            registrar_prospecto(name, phone, rubro, address)
                            print(f"   🎯 NUEVO PROSPECTO #{len(leads)}: {name} | Tel: {phone} | Dir: {address[:40] if address else ''}")
                    except Exception:
                        continue
                        
                print(f"   -> Nuevos calificados en este barrio: {encontrados_en_query}")
                
            except Exception as e:
                print(f"   ⚠️ Error en búsqueda '{query}': {e}")
                
        await browser.close()
        
    print("\n" + "=" * 70)
    print(f"🎉 BÚSQUEDA FINALIZADA. TOTAL NUEVOS PROSPECTOS DE BELLEZA: {len(leads)}")
    print("=" * 70)
    
    if leads:
        df = pd.DataFrame(leads)
        df.to_csv(output_csv, index=False, encoding='utf-8-sig')
        enrich_excel(output_csv, output_excel)
        print(f"\n📁 Archivo Excel CRM generado: {os.path.abspath(output_excel)}")
        print(f"📄 Archivo CSV generado: {os.path.abspath(output_csv)}")
        return leads
    else:
        print("No se encontraron nuevos comercios que cumplan con los filtros.")
        return []

if __name__ == "__main__":
    asyncio.run(scrape_belleza_leads(max_places_per_query=15))
