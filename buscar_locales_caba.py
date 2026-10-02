import asyncio
import os
import sys
import re
import urllib.parse
from playwright.async_api import async_playwright
import pandas as pd
from historial_manager import cargar_historial, es_duplicado, registrar_prospecto

sys.stdout.reconfigure(encoding='utf-8')

# Lista de búsquedas de alta conversión en distintos barrios de CABA
BUSQUEDAS_DEFAULT = [
    {"query": "barberias en caballito caba", "rubro": "Barbería / Peluquería", "solucion": "Sistema de Turnos Online"},
    {"query": "rotiserias en almagro caba", "rubro": "Gastronomía / Rotisería", "solucion": "Carta Digital & Pedidos WhatsApp"},
    {"query": "dieteticas en villa crespo caba", "rubro": "Dietética / Almacén", "solucion": "Catálogo WhatsApp con Carrito"},
    {"query": "peluquerias en flores caba", "rubro": "Estética / Peluquería", "solucion": "Sistema de Turnos Online"},
    {"query": "pizzerias en colegiales caba", "rubro": "Gastronomía / Pizzería", "solucion": "Carta Digital & Pedidos WhatsApp"},
    {"query": "pet shop veterinaria en palermo caba", "rubro": "Mascotas / Pet Shop", "solucion": "Catálogo WhatsApp / Turnos"},
    {"query": "talleres mecanicos en villa urquiza caba", "rubro": "Taller Mecánico", "solucion": "Software de Turnos / POS"},
    {"query": "kioscos almacenes en balvanera caba", "rubro": "Kiosco / Almacén", "solucion": "Catálogo WhatsApp / POS Caja"},
]

async def scrape_google_maps_leads(queries, max_places_per_query=20, output_excel="prospectos_caba.xlsx"):
    print("=" * 65)
    print("🚀 INICIANDO PROSPECCIÓN EN GOOGLE MAPS CABA")
    print("Filtro: COMERCIOS CON TELÉFONO Y SIN PÁGINA WEB")
    historial = cargar_historial()
    print(f"📚 Historial cargado: {len(historial)} comercios previos registrados para evitar duplicados.")
    print("=" * 65)
    
    leads = []
    vistos = set() # evitar duplicados en la misma sesion
    
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
            
        for item in queries:
            query = item["query"]
            rubro = item["rubro"]
            solucion = item["solucion"]
            
            search_url = f"https://www.google.com/maps/search/{urllib.parse.quote_plus(query)}"
            print(f"\n🔍 Buscando: '{query}'...")
            
            try:
                await page.goto(search_url, wait_until="domcontentloaded", timeout=25000)
                await page.wait_for_timeout(3500)
                
                # Hacer scroll en el feed de resultados
                feed = page.locator('div[role="feed"]')
                if await feed.count() > 0:
                    for _ in range(4):
                        await feed.evaluate("el => el.scrollBy(0, 1500)")
                        await page.wait_for_timeout(1200)
                        
                place_links = page.locator('a[href*="/maps/place/"]')
                total_links = await place_links.count()
                print(f"   Locales detectados en el mapa: {total_links}")
                
                encontrados_en_query = 0
                for i in range(min(total_links, max_places_per_query)):
                    try:
                        link = place_links.nth(i)
                        name = await link.get_attribute("aria-label")
                        if not name:
                            continue
                            
                        # Click para abrir detalles
                        await link.click()
                        await page.wait_for_timeout(2000)
                        
                        # Extraer info usando aria-labels confiables
                        elements = page.locator('[aria-label]')
                        total_el = await elements.count()
                        
                        phone = ""
                        has_website = False
                        website_url = ""
                        address = ""
                        
                        for el_idx in range(total_el):
                            al = await elements.nth(el_idx).get_attribute("aria-label")
                            if not al:
                                continue
                            if al.startswith("Teléfono:"):
                                phone = al.replace("Teléfono:", "").strip()
                            elif al.startswith("Sitio web:"):
                                has_website = True
                                website_url = al.replace("Sitio web:", "").strip()
                            elif al.startswith("Dirección:"):
                                address = al.replace("Dirección:", "").strip()
                        
                        # Si no tiene website y tiene teléfono: ¡ES UN PROSPECTO!
                        if phone and not has_website:
                            # Verificar si ya existe en el historial histórico
                            if es_duplicado(name, phone, historial):
                                print(f"   ⏩ [Omitido - Ya en historial]: {name} ({phone})")
                                continue

                            key = f"{name.strip().lower()}_{phone}"
                            if key not in vistos:
                                vistos.add(key)
                                encontrados_en_query += 1
                                
                                # Extraer rating si está disponible
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
                    except Exception as err:
                        # Si falla uno individual, continuar con el siguiente
                        continue
                        
                print(f"   -> Calificados en esta búsqueda: {encontrados_en_query}")
                
            except Exception as e:
                print(f"   ⚠️ Error en búsqueda '{query}': {e}")
                
        await browser.close()
        
    print("\n" + "=" * 65)
    print(f"✅ BÚSQUEDA FINALIZADA. TOTAL PROSPECTOS CALIFICADOS: {len(leads)}")
    print("=" * 65)
    
    if leads:
        df = pd.DataFrame(leads)
        csv_path = os.path.abspath(output_excel.replace(".xlsx", ".csv"))
        df.to_csv(csv_path, index=False, encoding='utf-8-sig')
        
        # Enriquecer Excel con enlaces directos de WhatsApp 1-Clic
        excel_path = os.path.abspath(output_excel)
        from enriquecer_excel import enrich_excel
        enrich_excel(csv_path, excel_path)
        
        print(f"📁 Archivo Excel CRM con WhatsApp 1-Clic: {excel_path}")
        print(f"📄 Archivo CSV generado: {csv_path}")
        return leads
    else:
        print("No se encontraron comercios con los criterios.")
        return []

if __name__ == "__main__":
    asyncio.run(scrape_google_maps_leads(BUSQUEDAS_DEFAULT, max_places_per_query=15))
