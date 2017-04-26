import sys, json
import nltk
lines = ""

for v in sys.argv[1:]:
	# print v
	lines = v

adjective = []
# do the nlp stuff
tokenized = nltk.word_tokenize(lines)
l = nltk.pos_tag(tokenized)
for w,t in l:
	if t.startswith('J'):
		adjective.append(w)

print adjective