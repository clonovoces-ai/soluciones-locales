import json
import os
import sys
import pandas as pd
from enriquecer_excel import enrich_excel

sys.stdout.reconfigure(encoding='utf-8')

def generar():
    historial_path = "historial_contactados.json"
    with open(historial_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    # Filtrar rubros de belleza / estética / uñas / barberías o los obtenidos a partir del índice 46
    # Para ser exactos: los de índice >= 46 son los recopilados en esta sesión de belleza
    belleza_leads = data[46:]
    
    rows = []
    for item in belleza_leads:
        nombre = item.get("nombre", "")
        telefono = item.get("telefono", "")
        rubro = item.get("rubro", "Barbería / Estética")
        direccion = item.get("direccion", "CABA")
        
        rows.append({
            "Comercio": nombre,
            "Rubro": rubro,
            "Teléfono": telefono,
            "Dirección": direccion,
            "Rating": "-",
            "Tiene Web": "NO",
            "Solución Sugerida": "Sistema de Turnos Online",
            "Google Maps": f"https://www.google.com/maps/search/{nombre}"
        })
        
    df = pd.DataFrame(rows)
    os.makedirs("clientes", exist_ok=True)
    
    csv_path = os.path.join("clientes", "prospectos_belleza_caba.csv")
    excel_path = os.path.join("clientes", "prospectos_belleza_caba.xlsx")
    
    df.to_csv(csv_path, index=False, encoding='utf-8-sig')
    enrich_excel(csv_path, excel_path)
    
    print(f"✅ Excel generado con éxito en: {excel_path}")
    print(f"Total prospectos calificados de belleza: {len(rows)}")

if __name__ == "__main__":
    generar()
