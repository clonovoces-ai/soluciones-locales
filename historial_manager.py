import json
import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

HISTORIAL_FILE = os.path.join(os.path.dirname(__file__), "historial_contactados.json")

def limpiar_telefono(tel: str) -> str:
    """Extrae solo los digitos para comparaciones exactas."""
    if not tel:
        return ""
    digits = re.sub(r"\D", "", str(tel))
    # Quitar prefijo de pais si existe
    if digits.startswith("549"):
        digits = digits[3:]
    elif digits.startswith("54"):
        digits = digits[2:]
    return digits

def limpiar_nombre(nombre: str) -> str:
    """Limpia caracteres especiales y pasa a minusculas."""
    if not nombre:
        return ""
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s]", "", str(nombre).lower())).strip()

def cargar_historial() -> list:
    """Carga la lista de comercios ya descubiertos."""
    if not os.path.exists(HISTORIAL_FILE):
        return []
    try:
        with open(HISTORIAL_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️ Error al leer historial: {e}")
        return []

def guardar_historial(historial: list):
    """Guarda la lista actualizada en el archivo JSON."""
    try:
        with open(HISTORIAL_FILE, "w", encoding="utf-8") as f:
            json.dump(historial, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"⚠️ Error al guardar historial: {e}")

def es_duplicado(nombre: str, telefono: str, historial: list) -> bool:
    """Verifica si el telefono o el nombre ya existen en el historial."""
    tel_norm = limpiar_telefono(telefono)
    nom_norm = limpiar_nombre(nombre)
    
    for item in historial:
        h_tel = limpiar_telefono(item.get("telefono", ""))
        h_nom = limpiar_nombre(item.get("nombre", ""))
        
        # Coincidencia por teléfono (el dato más único)
        if tel_norm and h_tel and (tel_norm == h_tel or tel_norm.endswith(h_tel) or h_tel.endswith(tel_norm)):
            return True
        # Coincidencia por nombre exacto si es representativo
        if nom_norm and h_nom and len(nom_norm) > 4 and nom_norm == h_nom:
            return True
            
    return False

def registrar_prospecto(nombre: str, telefono: str, rubro: str = "", direccion: str = ""):
    """Registra un nuevo prospecto en el historial si no existe."""
    historial = cargar_historial()
    if not es_duplicado(nombre, telefono, historial):
        historial.append({
            "nombre": nombre,
            "telefono": telefono,
            "rubro": rubro,
            "direccion": direccion,
            "fecha_registro": os.environ.get("DATE", "")
        })
        guardar_historial(historial)
        return True
    return False

if __name__ == "__main__":
    # Inicializar historial con los prospectos ya encontrados en prospectos_caba.csv
    import pandas as pd
    
    csv_file = os.path.join(os.path.dirname(__file__), "prospectos_caba.csv")
    if os.path.exists(csv_file):
        df = pd.read_csv(csv_file, encoding="utf-8-sig")
        # Identificar columnas por posicion o nombre aproximado
        col_nom = df.columns[0]
        col_rub = df.columns[1]
        col_tel = df.columns[2]
        col_dir = df.columns[3]
        
        count = 0
        for _, row in df.iterrows():
            nom = str(row[col_nom])
            tel = str(row[col_tel])
            rub = str(row[col_rub])
            dire = str(row[col_dir])
            if registrar_prospecto(nom, tel, rub, dire):
                count += 1
                
        print(f"✅ Historial inicial creado con {count} comercios registrados en '{HISTORIAL_FILE}'.")
    else:
        print("No se encontro prospectos_caba.csv para inicializar.")
