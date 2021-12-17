import nltk
import json

lemmas = sorted({
    lemma.lower()
    for lemma in nltk.corpus.wordnet.all_lemma_names()
    if '_' not in lemma
})
lemma2index = {x: i for (i, x) in enumerate(lemmas)}

relations = dict()
for (i, lemma) in enumerate(lemmas):
    related = set()
    for synset in nltk.corpus.wordnet.synsets(lemma):
        for synonym in synset.lemma_names():
            if '_' not in synonym:
                related.add(synonym.lower())
        for hyposet in synset.hyponyms():
            for hyponym in synset.lemma_names():
                if '_' not in hyponym:
                    related.add(hyponym.lower())
    related.discard(lemma)
    if len(related) > 0:
        relations[i] = [lemma2index[lemma] for lemma in sorted(related)]

with open('wn_lemmas.js', 'w', encoding='utf-8') as f:
    print('const $lemmas = ' + json.dumps(lemmas).replace(' ', '') + ';', file=f)
with open('wn_relations.js', 'w', encoding='utf-8') as f:
    print('const $relations = ' + json.dumps(relations).replace(' ', '') + ';', file=f)
