import sys, json
import nltk
lines = ""

for v in sys.argv[1:]:
	# print v
	lines = v

verb = []
# do the nlp stuff
tokenized = nltk.word_tokenize(lines)
l = nltk.pos_tag(tokenized)
for w,t in l:
	if t.startswith('V'):
		verb.append(w)

print verb