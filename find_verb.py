import sys, json
import nltk
lines = ""

for v in sys.argv[1:]:
	# print v
	lines = v

is_noun = lambda pos: pos[:2] == 'VP'
# do the nlp stuff
tokenized = nltk.word_tokenize(lines)
nouns = [word for (word, pos) in nltk.pos_tag(tokenized) if is_noun(pos)]
print nouns