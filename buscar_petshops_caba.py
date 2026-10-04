import asyncio
import os
import sys
import re
import urllib.parse
from playwright.async_api import async_playwright
import pandas as pd
from historial_manager import cargar_historial, es_duplicado, registrar_prospecto

sys.stdout.reconfigure(encoding='utf-8')

# Lista de búsquedas exhaustivas por barrios de CABA para Pet Shops
BARRIOS_PETSHOP = [
    {"query": "pet shop palermo caba", "zona": "Palermo"},
    {"query": "pet shop belgrano caba", "zona": "Belgrano"},
    {"query": "pet shop caballito caba", "zona": "Caballito"},
    {"query": "pet shop recoleta caba", "zona": "Recoleta"},
    {"query": "pet shop villa crespo caba", "zona": "Villa Crespo"},
    {"query": "pet shop almagro caba", "zona": "Almagro"},
    {"query": "pet shop villa urquiza caba", "zona": "Villa Urquiza"},
    {"query": "pet shop flores caba", "zona": "Flores"},
    {"query": "pet shop devoto caba", "zona": "Villa Devoto"},
    {"query": "pet shop colegiales chacarita caba", "zona": "Colegiales / Chacarita"},
    {"query": "peluqueria canina pet shop saavedra nuñez caba", "zona": "Saavedra / Núñez"},
    {"query": "pet shop veterinaria balvanera once caba", "zona": "Balvanera / Once"},
    {"query": "pet shop san telmo barracas caba", "zona": "San Telmo / Barracas"},
    {"query": "pet shop villa del parque caba", "zona": "Villa del Parque"}
]

async def scrape_petshops_caba(max_per_query=20):
    print("=" * 70)
    print("🐶 PROSPECCIÓN DE PET SHOPS & PELUQUERÍAS CANINAS EN CABA")
    print("Condición: CON TELÉFONO DE CONTACTO Y SIN PÁGINA WEB")
    historial = cargar_historial()
    print(f"📚 Historial cargado: {len(historial)} comercios ya registrados.")
    print("=" * 70)
    
    leads = []
    vistos = set()
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge", headless=True)
        context = await browser.new_context(
            locale="es-419",
            viewport={"width": 1280, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        # Aceptar cookies en Google Maps
        try:
            await page.goto("https://www.google.com/maps", wait_until="domcontentloaded", timeout=20000)
            btn = page.locator('button:has-text("Aceptar todo"), button:has-text("Acepto")')
            if await btn.count() > 0:
                await btn.first.click()
                await page.wait_for_timeout(1500)
        except Exception:
            pass
            
        for item in BARRIOS_PETSHOP:
            query = item["query"]
            zona = item["zona"]
            search_url = f"https://www.google.com/maps/search/{urllib.parse.quote_plus(query)}"
            print(f"\n🔍 Buscando Pet Shops en {zona}: '{query}'...")
            
            try:
                await page.goto(search_url, wait_until="domcontentloaded", timeout=25000)
                await page.wait_for_timeout(3500)
                
                # Scroll para cargar resultados
                feed = page.locator('div[role="feed"]')
                if await feed.count() > 0:
                    for _ in range(5):
                        await feed.evaluate("el => el.scrollBy(0, 1500)")
                        await page.wait_for_timeout(1000)
                        
                place_links = page.locator('a[href*="/maps/place/"]')
                total_links = await place_links.count()
                print(f"   Locales encontrados en {zona}: {total_links}")
                
                encontrados_zona = 0
                for i in range(min(total_links, max_per_query)):
                    try:
                        link = place_links.nth(i)
                        name = await link.get_attribute("aria-label")
                        if not name:
                            continue
                            
                        # Abrir ficha del local
                        await link.click()
                        await page.wait_for_timeout(2000)
                        
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
                                
                        # Filtro estricto: Con teléfono y SIN sitio web
                        if phone and not has_website:
                            if es_duplicado(name, phone, historial):
                                print(f"   ⏩ [Ya en historial]: {name} ({phone})")
                                continue
                                
                            key = f"{name.strip().lower()}_{phone}"
                            if key not in vistos:
                                vistos.add(key)
                                encontrados_zona += 1
                                
                                rating = "-"
                                try:
                                    r_loc = page.locator('div.F7nice span[aria-hidden="true"]').first
                                    if await r_loc.count() > 0:
                                        rating = (await r_loc.inner_text()).strip()
                                except Exception:
                                    pass
                                    
                                lead_data = {
                                    "Comercio": name,
                                    "Rubro": "Mascotas / Pet Shop",
                                    "Teléfono": phone,
                                    "Dirección": address or f"{zona}, CABA",
                                    "Rating": rating,
                                    "Tiene Web": "NO",
                                    "Solución Sugerida": "E-commerce WhatsApp & Turnos Peluquería",
                                    "Google Maps": page.url
                                }
                                leads.append(lead_data)
                                registrar_prospecto(name, phone, "Mascotas / Pet Shop", address)
                                print(f"   🐾 PROSPECTO #{len(leads)}: {name} | Tel: {phone} | Dir: {address[:40] if address else zona}")
                    except Exception:
                        continue
                        
                print(f"   -> Calificados en {zona}: {encontrados_zona}")
            except Exception as e:
                print(f"   ⚠️ Error en {zona}: {e}")
                
        await browser.close()
        
    print("\n" + "=" * 70)
    print(f"🎯 BÚSQUEDA COMPLETADA. TOTAL PET SHOPS CALIFICADOS: {len(leads)}")
    print("=" * 70)
    
    if leads:
        os.makedirs("clientes", exist_ok=True)
        csv_file = os.path.abspath("clientes/prospectos_petshop_caba.csv")
        xlsx_file = os.path.abspath("clientes/prospectos_petshop_caba.xlsx")
        
        df_new = pd.DataFrame(leads)
        df_new.to_csv(csv_file, index=False, encoding='utf-8-sig')
        
        # Enriquecer Excel específico de Pet Shops
        from enriquecer_excel import enrich_excel
        enrich_excel(csv_file, xlsx_file)
        print(f"📁 Excel específico de Pet Shops: {xlsx_file}")
        
        # Actualizar Excel general prospectos_caba.xlsx
        main_xlsx = os.path.abspath("prospectos_caba.xlsx")
        main_csv = os.path.abspath("prospectos_caba.csv")
        if os.path.exists(main_csv):
            df_main = pd.read_csv(main_csv, encoding='utf-8-sig')
            df_combined = pd.concat([df_main, df_new], ignore_index=True)
            df_combined.drop_duplicates(subset=["Comercio", "Teléfono"], inplace=True)
            df_combined.to_csv(main_csv, index=False, encoding='utf-8-sig')
            enrich_excel(main_csv, main_xlsx)
            enrich_excel(main_csv, os.path.abspath("clientes/prospectos_caba.xlsx"))
            print(f"📁 Excel general consolidado actualizado: {main_xlsx}")
            
        return leads
    else:
        print("No se encontraron nuevos prospectos sin web.")
        return []

if __name__ == "__main__":
    asyncio.run(scrape_petshops_caba(max_per_query=15))
