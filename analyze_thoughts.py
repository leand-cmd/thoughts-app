import os
import django
import json
from collections import Counter
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import DBSCAN
from sklearn.metrics.pairwise import cosine_similarity

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from thoughts.models import Thought
import spacy

# Cargar modelo de spaCy
try:
    nlp = spacy.load('es_core_news_sm')
except:
    print("Descargando modelo de spaCy...")
    os.system('python -m spacy download es_core_news_sm')
    nlp = spacy.load('es_core_news_sm')

# Obtener todos los pensamientos
thoughts = Thought.objects.all()
print(f"✓ Cargados {thoughts.count()} pensamientos")

if thoughts.count() == 0:
    print("❌ No hay pensamientos para analizar")
    exit()

# Extraer textos
texts = [t.text for t in thoughts]

# NLP - Extraer palabras clave
keywords = []
for text in texts:
    doc = nlp(text.lower())
    # Sustantivos y adjetivos
    words = [token.text for token in doc if token.pos_ in ['NOUN', 'ADJ'] and len(token.text) > 3]
    keywords.extend(words)

# Palabras más frecuentes
keyword_counts = Counter(keywords)
top_keywords = dict(keyword_counts.most_common(20))

print(f"\n📊 Palabras clave principales:")
for word, count in top_keywords.items():
    print(f"  - {word}: {count}")

# Calcular similaridad
vectorizer = TfidfVectorizer(max_features=100, stop_words='spanish')
tfidf_matrix = vectorizer.fit_transform(texts)
similarity_matrix = cosine_similarity(tfidf_matrix)

# Clustering
clustering = DBSCAN(eps=0.3, min_samples=1).fit(tfidf_matrix.toarray())
labels = clustering.labels_

print(f"\n🔗 Clusters encontrados: {len(set(labels))}")

# Generar nodos y conexiones para D3.js
nodes = []
links = []
node_ids = {}

# Crear nodos de conceptos principales
for i, (keyword, count) in enumerate(top_keywords.items()):
    node_id = keyword
    size = min(20, max(5, count * 2))

    # Determinar categoría por keywords
    if any(x in keyword for x in ['liderazgo', 'equipo', 'cliente', 'estrategia']):
        category = 'profesional'
    else:
        category = 'personal'

    nodes.append({
        'id': node_id,
        'category': category,
        'size': size
    })
    node_ids[keyword] = i

# Crear conexiones entre conceptos que aparecen juntos
for i, text in enumerate(texts):
    doc = nlp(text.lower())
    words = [token.text for token in doc if token.pos_ in ['NOUN', 'ADJ'] and len(token.text) > 3]

    for j in range(len(words)):
        for k in range(j + 1, len(words)):
            w1, w2 = words[j], words[k]
            if w1 in top_keywords and w2 in top_keywords:
                # Buscar si ya existe la conexión
                existing = [l for l in links if (l['source'] == w1 and l['target'] == w2) or (l['source'] == w2 and l['target'] == w1)]
                if existing:
                    existing[0]['strength'] = min(1.0, existing[0]['strength'] + 0.1)
                else:
                    links.append({
                        'source': w1,
                        'target': w2,
                        'strength': 0.7
                    })

# Generar JSON para D3.js
graph_data = {
    'nodes': nodes,
    'links': links,
    'stats': {
        'total_thoughts': thoughts.count(),
        'unique_keywords': len(top_keywords),
        'clusters': len(set(labels))
    }
}

# Guardar JSON
output_file = 'analysis_output.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(graph_data, f, ensure_ascii=False, indent=2)

print(f"\n✅ Análisis completado!")
print(f"📄 Resultado guardado en: {output_file}")
print(f"\nEstadísticas:")
print(f"  Total pensamientos: {graph_data['stats']['total_thoughts']}")
print(f"  Conceptos únicos: {graph_data['stats']['unique_keywords']}")
print(f"  Conexiones: {len(links)}")
