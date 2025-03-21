import re
import json
import collections
import nltk


ns = [1, 2, 3]
min_freq = 2

all_tokens = re.split(
    '[^a-z]+',
    ' '.join(nltk.corpus.brown.words()).lower()
)
all_sents = [
    re.split(
        '[^a-z]+',
        ' '.join(sent).lower()
    )
    for sent in nltk.corpus.brown.sents()
]

token_freqs = collections.Counter(all_tokens)

vocab = ['EDGE', 'UNK'] + [
    token
    for (token, freq) in sorted(
        token_freqs.items(),
        key=(lambda item: item[1]),
        reverse=True
    )
    if freq >= min_freq
]
token2index = {t: i for (i, t) in enumerate(vocab)}
edge_index = token2index['EDGE']
unk_index = token2index['UNK']

ngrams = {
    n: collections.defaultdict(lambda: collections.defaultdict(lambda: 0))
    for n in ns
}
for sent in all_sents:
    sent_indexes = [
        token2index.get(token, unk_index)
        for token in ['EDGE'] + sent + ['EDGE']
    ]
    for n in ns:
        for (i, ngram) in enumerate(nltk.ngrams(sent_indexes, n)):
            if n == 1 and i == 0:
                continue # First edge token is only there for use in prefixes.
            prefix = ngram[:-1]
            target = ngram[-1]
            if unk_index in prefix or target == unk_index:
                continue
            prefix_s = ','.join(str(index) for index in prefix)
            ngrams[n][prefix_s][target] += 1


with open('data.js', 'w', encoding='utf-8') as f:
    print('const $edgeIndex = ' + json.dumps(edge_index) + ';', file=f)
    print('const $unkIndex = ' + json.dumps(unk_index) + ';', file=f)
    print('const $vocab = ' + json.dumps(vocab).replace(' ', '') + ';', file=f)
    print('const $tokenToIndex = ' + json.dumps({t: i for (i, t) in enumerate(vocab)}).replace(' ', '') + ';', file=f)
    print('const $ngrams = ' + json.dumps(ngrams).replace(' ', '') + ';', file=f)
