import re
import urllib.parse
import sys
import pandas as pd
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

sys.stdout.reconfigure(encoding='utf-8')

def format_whatsapp_number(raw_phone):
    digits = re.sub(r'\D', '', str(raw_phone))
    if not digits:
        return ""
    if digits.startswith("549"):
        return digits
    if digits.startswith("5411"):
        return "549" + digits[2:]
    if digits.startswith("01115"):
        return "54911" + digits[5:]
    if digits.startswith("011"):
        return "54911" + digits[3:]
    if digits.startswith("1115"):
        return "54911" + digits[4:]
    if digits.startswith("11") and len(digits) == 10:
        return "549" + digits
    if len(digits) == 8:
        return "54911" + digits
    if digits.startswith("15") and len(digits) == 10:
        return "54911" + digits[2:]
    return "549" + digits

def limpiar_nombre(comercio):
    # Quitar sufijos comunes como "| Almacén", "- Unisex", etc.
    c = str(comercio).split("|")[0].split("·")[0].strip()
    c = c.replace('"', '').replace("'", '').strip()
    # Si viene todo en minúsculas, poner en formato título legible
    if c.islower():
        c = c.title()
    return c

def generar_mensaje_y_demo(comercio, solucion, rubro):
    nombre_limpio = limpiar_nombre(comercio)
    encoded_name = urllib.parse.quote_plus(nombre_limpio)
    rubro_lower = str(rubro).lower()
    comercio_lower = str(comercio).lower()
    
    # 1. Rubro Mascotas, Pet Shop, Veterinaria & Peluquería Canina
    if any(k in rubro_lower or k in comercio_lower for k in ["mascota", "pet", "veterin", "canin", "felin", "perr"]):
        demo_url = f"https://mascotas.adrianschuster.com.ar/?demo={encoded_name}"
        msg = (
            f"¡Hola gente de {nombre_limpio}! ¿Cómo andan? Vi su local en Google Maps y me gustó mucho la propuesta que tienen para las mascotas del barrio.\n\n"
            f"Me tomé unos minutos para armarles un boceto interactivo de prueba para que vean cómo sus clientes podrían pedir turnos de baño y peluquería canina por tamaño de perro, o pedir bolsas de alimento directo a este WhatsApp:\n"
            f"👉 {demo_url}\n\n"
            f"Es una muestra rápida para que vean la idea funcionando en vivo (con selector de tamaño pequeño/mediano/grande y notas del peludito). Si les interesa tenerlo activo para {nombre_limpio}, avísenme y les paso una propuesta súper accesible. ¡Saludos a los peluditos!"
        )
        return msg, demo_url

    # 2. Rubro Uñas, Manicuría, Nail Art, Pestañas & Belleza
    elif any(k in rubro_lower or k in comercio_lower for k in ["uña", "nail", "manicur", "pedicur", "pestaña", "ceja", "estética", "estetica", "belleza"]):
        demo_url = f"https://unas.adrianschuster.com.ar/?demo={encoded_name}"
        msg = (
            f"¡Hola chicas de {nombre_limpio}! ¿Cómo están? Vi su estudio en Google Maps y me encantaron sus trabajos.\n\n"
            f"Me tomé unos minutos para armarles un boceto interactivo de prueba para que vean cómo sus clientas podrían reservar turnos de manicuría, kapping, esculpidas y pestañas desde el celular directo a este WhatsApp:\n"
            f"👉 {demo_url}\n\n"
            f"Es una muestra rápida para que vean lo simple que funciona (con selección de especialista, día, horario y opción de retiro previo). Si les gustaría tenerlo activo para su estudio, avísenme y les paso una propuesta súper accesible. ¡Que tengan un lindo día!"
        )
        return msg, demo_url

    # 3. Rubro Barbería & Peluquería
    elif "Turnos" in str(solucion) or "barber" in rubro_lower or "peluquer" in rubro_lower:
        demo_url = f"https://turnos.adrianschuster.com.ar/?demo={encoded_name}"
        msg = (
            f"¡Hola! ¿Cómo están en {nombre_limpio}? Vi su local en Google Maps y me gustó mucho lo que hacen.\n\n"
            f"Me tomé unos minutos para armarles un boceto interactivo de prueba para que vean cómo sus clientes podrían reservar turnos online desde el celular directo a este WhatsApp (sin que tengan que instalar nada):\n"
            f"👉 {demo_url}\n\n"
            f"Es solo una muestra para que vean la idea funcionando en vivo. Si les interesa tenerlo activo con sus servicios y horarios reales, avísenme y les paso una propuesta súper accesible. ¡Saludos!"
        )
        return msg, demo_url
        
    elif "Carta" in str(solucion) or "Gastronomía" in str(rubro) or "Pizzería" in str(rubro):
        demo_url = f"https://landing.adrianschuster.com.ar/?demo={encoded_name}"
        msg = (
            f"¡Hola gente de {nombre_limpio}! ¿Cómo andan?\n\n"
            f"Estaba viendo su local en Google Maps y me tomé unos minutos para armarles un boceto interactivo de prueba de su carta digital:\n"
            f"👉 {demo_url}\n\n"
            f"La idea es que los clientes puedan ver los platos con fotos desde el celular, calcular el envío y mandarles el pedido armadito acá por WhatsApp, sin pagarle el 30% de comisión a apps de delivery.\n\n"
            f"Es solo una muestra para que vean cómo funcionaría. ¿Tienen ganas de que les arme una propuesta para {nombre_limpio}?"
        )
        return msg, demo_url
        
    elif "POS" in str(solucion) or "Taller" in str(rubro):
        demo_url = "https://sd.adrianschuster.com.ar/"
        msg = (
            f"¡Hola {nombre_limpio}! ¿Cómo estás?\n\n"
            f"Te escribo porque vi tu local en Google Maps. Me dedico a instalar software de caja y control de ventas (POS) para locales comerciales de la zona.\n\n"
            f"Es un sistema rápido para la PC del mostrador:\n"
            f"✓ Funciona 100% offline (si se corta internet seguís cobrando igual)\n"
            f"✓ Compatible con lector de código de barras\n"
            f"✓ Control de stock diario y arqueo de caja al cierre\n\n"
            f"Si te gustaría agilizar el mostrador y tener control de las ventas del día a día, avisame y te paso detalles. ¡Un saludo!"
        )
        return msg, demo_url
        
    else: # Catálogo / Dietética / Kiosco / Almacén / Pet shop
        demo_url = f"https://ecommerce.adrianschuster.com.ar/?demo={encoded_name}"
        msg = (
            f"¡Hola! Buenas tardes. Les escribo porque vi {nombre_limpio} en Google Maps y me pareció un local excelente.\n\n"
            f"Les armé un boceto de prueba de cómo quedaría su tienda/catálogo online con el nombre de ustedes:\n"
            f"👉 {demo_url}\n\n"
            f"Tus clientes pueden ver los productos con fotos y precios desde el celular, sumar al carrito y mandarte el pedido listo para despachar por WhatsApp. Y los precios los actualizás vos mismo desde un simple Excel.\n\n"
            f"Es solo una muestra para que vean la idea. ¿Les gustaría que les prepare una propuesta para {nombre_limpio}?"
        )
        return msg, demo_url

def enrich_excel(input_csv="prospectos_caba.csv", output_excel="prospectos_caba.xlsx"):
    df = pd.read_csv(input_csv)
    
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Prospectos CABA (CRM)"
    
    headers = [
        "Comercio",
        "Nombre Limpio",
        "Rubro",
        "Teléfono Original",
        "Dirección",
        "Rating",
        "Solución a Ofrecer",
        "Enviar WhatsApp (1 Clic)",
        "Demo Personalizada",
        "Estado de Contacto",
        "Notas / Respuesta",
        "Ficha Google Maps"
    ]
    ws.append(headers)
    
    # Header styling
    header_fill = PatternFill(start_color="111827", end_color="111827", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    thin_border = Border(
        left=Side(style='thin', color='E5E7EB'),
        right=Side(style='thin', color='E5E7EB'),
        top=Side(style='thin', color='E5E7EB'),
        bottom=Side(style='thin', color='E5E7EB')
    )
    
    for col_num in range(1, len(headers) + 1):
        c = ws.cell(row=1, column=col_num)
        c.fill = header_fill
        c.font = header_font
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws.row_dimensions[1].height = 28
    
    link_font = Font(name="Calibri", size=11, bold=True, color="059669", underline="single") # Verde WhatsApp
    demo_font = Font(name="Calibri", size=10, bold=True, color="D97706", underline="single") # Ámbar demo
    gmaps_font = Font(name="Calibri", size=10, color="2563EB", underline="single")
    default_font = Font(name="Calibri", size=10)
    
    for row_idx, row in df.iterrows():
        comercio = str(row.get("Comercio", ""))
        nombre_limpio = limpiar_nombre(comercio)
        rubro = str(row.get("Rubro", ""))
        tel_orig = str(row.get("Teléfono", ""))
        direccion = str(row.get("Dirección", ""))
        rating = str(row.get("Rating", ""))
        solucion = str(row.get("Solución Sugerida", ""))
        maps_url = str(row.get("Google Maps", ""))
        
        wa_digits = format_whatsapp_number(tel_orig)
        mensaje, demo_url = generar_mensaje_y_demo(comercio, solucion, rubro)
        wa_link = f"https://wa.me/{wa_digits}?text={urllib.parse.quote(mensaje)}" if wa_digits else ""
        
        excel_row = [
            comercio,
            nombre_limpio,
            rubro,
            tel_orig,
            direccion,
            rating,
            solucion,
            "📲 Enviar Mensaje",
            "🔗 Probar Boceto",
            "Pendiente",
            "",
            "Ver en Maps"
        ]
        ws.append(excel_row)
        current_row = ws.max_row
        ws.row_dimensions[current_row].height = 22
        
        # Style cells
        for col_idx in range(1, len(headers) + 1):
            cell = ws.cell(row=current_row, column=col_idx)
            cell.font = default_font
            cell.border = thin_border
            cell.alignment = Alignment(vertical="center")
            
        # Format WhatsApp Link cell (Col 8)
        wa_cell = ws.cell(row=current_row, column=8)
        if wa_link:
            wa_cell.hyperlink = wa_link
            wa_cell.font = link_font
            wa_cell.alignment = Alignment(horizontal="center", vertical="center")
            
        # Format Demo Link cell (Col 9)
        demo_cell = ws.cell(row=current_row, column=9)
        if demo_url:
            demo_cell.hyperlink = demo_url
            demo_cell.font = demo_font
            demo_cell.alignment = Alignment(horizontal="center", vertical="center")
            
        # Format Google Maps Link cell (Col 12)
        maps_cell = ws.cell(row=current_row, column=12)
        if maps_url and maps_url != "nan":
            maps_cell.hyperlink = maps_url
            maps_cell.font = gmaps_font
            maps_cell.alignment = Alignment(horizontal="center", vertical="center")
            
        # Center Rating and Estado
        ws.cell(row=current_row, column=6).alignment = Alignment(horizontal="center", vertical="center")
        ws.cell(row=current_row, column=10).alignment = Alignment(horizontal="center", vertical="center")
        ws.cell(row=current_row, column=10).font = Font(name="Calibri", size=10, italic=True, color="6B7280")
        
    # Auto-adjust column widths
    for col in ws.columns:
        col_letter = get_column_letter(col[0].column)
        max_len = 0
        for cell in col:
            val_str = str(cell.value or '')
            if cell.hyperlink:
                val_str = "📲 Enviar Mensaje WhatsApp"
            max_len = max(max_len, len(val_str))
        ws.column_dimensions[col_letter].width = min(max(max_len + 4, 14), 48)
        
    wb.save(output_excel)
    print(f"✅ Excel enriquecido con Bocetos Personalizados guardado en: {output_excel}")

if __name__ == "__main__":
    enrich_excel()
