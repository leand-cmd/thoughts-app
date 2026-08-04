import requests
import json

BASE_URL = "http://localhost:8000/api"

# Test 1: Crear pensamiento
print("=== CREANDO PENSAMIENTO ===")
thought_data = {
    "text": "Me despierto sin energía hoy",
    "category": "personal",
    "sentiment": "negativo"
}

response = requests.post(f"{BASE_URL}/thoughts/", json=thought_data)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

# Test 2: Listar todos
print("\n=== LISTANDO PENSAMIENTOS ===")
response = requests.get(f"{BASE_URL}/thoughts/")
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

# Test 3: Export
print("\n=== EXPORTANDO ===")
response = requests.get(f"{BASE_URL}/thoughts/export/")
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")
