import os
import json
import requests
from collections import Counter
from datetime import datetime

print("🔄 Descargando modelo spaCy...")
try:
    import spacy
    nlp = spacy.load('es_core_news_sm')
except:
    os.system('python -m spacy download es_core_news_sm')
    import spacy
    nlp = spacy.load('es_core_news_sm')

print("📥 Leyendo pensamientos desde Railway...")
try:
    response = requests.get('https://thoughts-app-production.up.railway.app/api/thoughts/export/')
    data = response.json()
    thoughts = data.get('thoughts', [])
except Exception as e:
    print(f"❌ Error: {e}")
    exit()

print(f"✓ Cargados {len(thoughts)} pensamientos\n")

if len(thoughts) == 0:
    print("❌ Sin pensamientos")
    exit()

texts = [t['text'] for t in thoughts]

print("🧠 Analizando conceptos...")
keywords = []
for text in texts:
    doc = nlp(text.lower())
    words = [token.text for token in doc if token.pos_ in ['NOUN', 'ADJ'] and len(token.text) > 3]
    keywords.extend(words)

keyword_counts = Counter(keywords)
top_keywords = dict(keyword_counts.most_common(25))

print(f"📌 Top conceptos:")
for word, count in list(top_keywords.items())[:10]:
    print(f"   {word}: {count}x")

# ============= ANÁLISIS PSICOLÓGICO PROFUNDO =============

def analyze_psychological_profile(thoughts):
    """Análisis profundo de personalidad y patrones"""

    # Conteos básicos
    total = len(thoughts)
    positive = len([t for t in thoughts if t.get('sentiment') == 'positivo'])
    negative = len([t for t in thoughts if t.get('sentiment') == 'negativo'])
    neutral = total - positive - negative

    # CATEGORÍAS DE PENSAMIENTOS
    categories = {}
    for t in thoughts:
        cat = t.get('category', 'sin_categoria')
        sent = t.get('sentiment', 'neutro')
        if cat not in categories:
            categories[cat] = {'positivo': 0, 'negativo': 0, 'neutro': 0, 'total': 0}
        categories[cat][sent] += 1
        categories[cat]['total'] += 1

    # PATRONES PSICOLÓGICOS
    patterns = {
        'rumiacion': 0,  # Pensamientos repetitivos
        'catastrofismo': 0,  # Pensamiento de lo peor
        'autoconfianza_baja': 0,  # Duda de sí mismo
        'victimizacion': 0,  # Culpa de otros
        'perfeccionismo': 0,  # Expectativas altas
        'comparacion': 0,  # Compararse con otros
    }

    rumination_keywords = ['dudo', 'no sé', 'no creo', 'no puedo', 'imposible', 'nunca']
    catastrophe_keywords = ['fracasé', 'crisis', 'problema', 'peor', 'malo', 'terrible']
    low_confidence = ['dudo', 'inseguro', 'miedo', 'incapaz', 'débil']
    victimization = ['culpa', 'molesta', 'fustra', 'culpable']
    perfectionism = ['debería', 'perfecto', 'falta', 'mejor', 'no logro']

    for thought in thoughts:
        text = thought['text'].lower()

        if any(kw in text for kw in rumination_keywords):
            patterns['rumiacion'] += 1
        if any(kw in text for kw in catastrophe_keywords):
            patterns['catastrofismo'] += 1
        if any(kw in text for kw in low_confidence):
            patterns['autoconfianza_baja'] += 1
        if any(kw in text for kw in victimization):
            patterns['victimizacion'] += 1
        if any(kw in text for kw in perfectionism):
            patterns['perfeccionismo'] += 1

    # ARQUETIPOS DE PERSONALIDAD (basado en datos)
    archetypes = []

    if patterns['autoconfianza_baja'] > total * 0.15:
        archetypes.append("🎭 El Dudoso: Cuestiona constantemente sus capacidades")

    if patterns['perfeccionismo'] > total * 0.15:
        archetypes.append("⚡ El Perfeccionista: Altas expectativas, se frustra fácil")

    if patterns['rumiacion'] > total * 0.2:
        archetypes.append("🔄 El Rumiador: Repite mentalmente los problemas")

    if negative > total * 0.65:
        archetypes.append("😔 El Pesimista: Enfoque negativo dominante")
    else:
        archetypes.append("🌟 El Resiliente: A pesar de adversidades, mantiene esperanza")

    # ÁREAS CRÍTICAS
    critical_areas = []

    # Relación de pareja
    pareja_mentions = sum(1 for t in thoughts if any(x in t['text'].lower() for x in ['pareja', 'relación', 'frío', 'amor']))
    pareja_negative = sum(1 for t in thoughts if 'pareja' in t['text'].lower() and t.get('sentiment') == 'negativo')
    if pareja_mentions > 2 and pareja_negative / pareja_mentions > 0.5:
        critical_areas.append({
            'area': 'Relación Amorosa',
            'urgencia': 'CRÍTICA',
            'indicadores': f"{pareja_negative}/{pareja_mentions} menciones negativas",
            'recomendacion': 'Terapia de pareja + comunicación profunda'
        })

    # Finanzas
    money_mentions = sum(1 for t in thoughts if any(x in t['text'].lower() for x in ['dinero', 'deuda', 'financiero', 'costo', 'gastar']))
    money_negative = sum(1 for t in thoughts if any(x in t['text'].lower() for x in ['dinero', 'deuda']) and t.get('sentiment') == 'negativo')
    if money_mentions > 3:
        critical_areas.append({
            'area': 'Finanzas',
            'urgencia': 'ALTA',
            'indicadores': f"{money_negative}/{money_mentions} preocupaciones",
            'recomendacion': 'Plan presupuestario + ingresos adicionales'
        })

    # Autoconfianza
    if patterns['autoconfianza_baja'] > 5:
        critical_areas.append({
            'area': 'Autoconfianza',
            'urgencia': 'ALTA',
            'indicadores': f"{patterns['autoconfianza_baja']} pensamientos de duda",
            'recomendacion': 'Terapia cognitiva + coaching personalizado'
        })

    # Asociación (trabajo)
    aso_mentions = sum(1 for t in thoughts if 'asociación' in t['text'].lower())
    aso_negative = sum(1 for t in thoughts if 'asociación' in t['text'].lower() and t.get('sentiment') == 'negativo')
    if aso_mentions > 5:
        critical_areas.append({
            'area': 'Liderazgo/Asociación',
            'urgencia': 'MEDIA',
            'indicadores': f"{aso_negative}/{aso_mentions} mencionada con dudas",
            'recomendacion': 'Delegar tareas + establecer límites de horario'
        })

    # MATRIZ PSICOLÓGICA (Rasgos de personalidad estimados)
    personality_matrix = {
        'apertura': 0.7,  # Nuevas ideas, cambio
        'responsabilidad': 0.85,  # Compromiso, estructura
        'extroversion': 0.5,  # Social/aislamiento
        'amabilidad': 0.75,  # Empatía hacia otros
        'estabilidad': 0.3,  # Ansiedad, estrés (BAJA - 71% negativo)
    }

    # TIMELINE EMOCIONAL (últimos pensamientos)
    recent_thoughts = sorted(thoughts, key=lambda x: x.get('created_at', ''), reverse=True)[:10]
    timeline = []
    for i, t in enumerate(reversed(recent_thoughts)):
        timeline.append({
            'dia': i + 1,
            'sentimiento': t.get('sentiment', 'neutro'),
            'categoria': t.get('category', 'sin_categoria'),
            'preview': t['text'][:50] + '...'
        })

    return {
        'summary': {
            'total_thoughts': total,
            'positive': positive,
            'negative': negative,
            'neutral': neutral,
            'unique_keywords': len(top_keywords),  # AGREGAR ESTO
            'negativity_percent': int(negative / total * 100)
        },
        'key_findings': [  # CAMBIAR ESTO
            f"🎭 Arquetipos: {', '.join(archetypes[:2])}",
            f"🚨 Áreas críticas: {len(critical_areas)}",
            f"💪 Fortalezas: {', '.join(identify_strengths(thoughts)[:2])}",
            f"❌ Debilidades: {', '.join(identify_weaknesses(thoughts, patterns)[:1])}",
            f"⚡ Próximas acciones: {len(prioritize_actions(critical_areas, patterns))} pasos",
        ],
        'categories': categories,
        'patterns': patterns,
        'archetypes': archetypes,
        'critical_areas': critical_areas,
        'personality_matrix': personality_matrix,
        'timeline': timeline,
        'psychological_profile': {
            'strengths': identify_strengths(thoughts),
            'weaknesses': identify_weaknesses(thoughts, patterns),
            'priorities': prioritize_actions(critical_areas, patterns)
        }
    }

def identify_strengths(thoughts):
    """Identifica fortalezas"""
    strengths = []

    achievements = [t for t in thoughts if t.get('sentiment') == 'positivo' and any(x in t['text'].lower() for x in ['logré', 'desarrollé', 'alcancé', 'conseguí'])]
    if len(achievements) > 2:
        strengths.append(f"💪 Capacidad de Ejecución: {len(achievements)} logros registrados")

    consistency = sum(1 for t in thoughts if any(x in t['text'].lower() for x in ['gym', 'entreno', 'ordeno', 'organizo']))
    if consistency > 3:
        strengths.append(f"🎯 Disciplina: Mantiene hábitos (gym, orden)")

    learning = sum(1 for t in thoughts if any(x in t['text'].lower() for x in ['proyecto', 'desarrollo', 'aprendí', 'skill']))
    if learning > 2:
        strengths.append(f"🧠 Mentalidad de Aprendizaje: Continúa desarrollándose")

    if not strengths:
        strengths.append("📈 Autoconciencia: Reflexiona sobre sus pensamientos")

    return strengths

def identify_weaknesses(thoughts, patterns):
    """Identifica debilidades"""
    weaknesses = []

    if patterns['autoconfianza_baja'] > 5:
        weaknesses.append("❌ Autoconfianza: Duda recurrente de capacidades")

    if patterns['rumiacion'] > 8:
        weaknesses.append("🔄 Rumiación Mental: Repite problemas sin solucionar")

    if sum(1 for t in thoughts if any(x in t['text'].lower() for x in ['procrastino', 'no logro', 'no termino'])) > 2:
        weaknesses.append("⏰ Procrastinación: Dificultad completar tareas")

    if sum(1 for t in thoughts if 'pareja' in t['text'].lower() and t.get('sentiment') == 'negativo') > 2:
        weaknesses.append("❤️ Comunicación: Desconexión con pareja")

    return weaknesses

def prioritize_actions(critical_areas, patterns):
    """Prioriza acciones"""
    actions = []

    for area in critical_areas:
        if area['urgencia'] == 'CRÍTICA':
            actions.append(f"🚨 [SEMANA 1] {area['area']}: {area['recomendacion']}")
        elif area['urgencia'] == 'ALTA':
            actions.append(f"⚡ [SEMANA 2-3] {area['area']}: {area['recomendacion']}")

    if patterns['autoconfianza_baja'] > 5:
        actions.append("📚 [DIARIO] Lectura: 15min libros de psicología/autoayuda")

    actions.append("💪 [DIARIO] Continúa gym: Es tu ancla de estabilidad")

    return actions

# GENERAR ANÁLISIS
print("\n🔬 Analizando perfil psicológico...")
analysis_deep = analyze_psychological_profile(thoughts)

# Nodos
prof_keywords = ['liderazgo', 'equipo', 'cliente', 'estrategia', 'asociación', 'compañero']
nodes = []
for keyword, count in top_keywords.items():
    size = min(20, max(5, count * 1.5))
    category = 'profesional' if any(x in keyword for x in prof_keywords) else 'personal'
    nodes.append({'id': keyword, 'category': category, 'size': size})

# Enlaces
print("🔗 Generando conexiones...")
links = []
for text in texts:
    doc = nlp(text.lower())
    words = [token.text for token in doc if token.pos_ in ['NOUN', 'ADJ'] and len(token.text) > 3]

    for j in range(len(words)):
        for k in range(j + 1, len(words)):
            w1, w2 = words[j], words[k]
            if w1 in top_keywords and w2 in top_keywords:
                existing = [l for l in links if l['source'] == w1 and l['target'] == w2]
                if existing:
                    existing[0]['strength'] = min(1.0, existing[0]['strength'] + 0.15)
                else:
                    links.append({'source': w1, 'target': w2, 'strength': 0.75})

# Guardar gráfico
graph_data = {
    'nodes': nodes,
    'links': links,
    'stats': {
        'total_thoughts': len(thoughts),
        'unique_keywords': len(top_keywords),
        'total_connections': len(links)
    }
}

# Guardar análisis profundo
output_path = 'thoughts-frontend/public/graph_data.json'
analysis_path = 'thoughts-frontend/public/analysis_deep.json'

os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(graph_data, f, ensure_ascii=False, indent=2)

with open(analysis_path, 'w', encoding='utf-8') as f:
    json.dump(analysis_deep, f, ensure_ascii=False, indent=2)

print(f"\n✅ ANÁLISIS PSICOLÓGICO COMPLETADO!")
print(f"\n📊 RADIOGRAFÍA MENTAL:")
print(f"   Negatividad: {analysis_deep['summary']['negativity_percent']}% 🚨")
print(f"   Arquetipos: {', '.join(analysis_deep['archetypes'][:2])}")
print(f"   Áreas críticas: {len(analysis_deep['critical_areas'])}")
print(f"\n⚡ PRIORIDADES:")
for action in analysis_deep['psychological_profile']['priorities'][:3]:
    print(f"   {action}")

print(f"\n📤 Pusheando...")
os.chdir('thoughts-frontend')
os.system('git add public/graph_data.json public/analysis_deep.json')
os.system('git commit -m "Deep psychological analysis and profile"')
os.system('git push origin main')

print(f"\n🚀 ¡RADIOGRAFÍA LISTA! Railway redeploy en 1-2 minutos")
