import os
import json

stopwords = dict()
for fname in os.listdir('en'):
    with open('en/'+fname, 'r', encoding='utf-8') as f:
        for stopword in f.read().strip().split('\n'):
            stopwords[stopword.lower()] = 0

with open('stopwords.js', 'w', encoding='utf-8') as f:
    print('const $stopWords = ' + json.dumps(stopwords).replace(' ', '') + ';', file=f)
