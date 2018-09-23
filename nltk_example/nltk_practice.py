import os
import sys
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords


def analyzeText(text, analyzer):
    sentiment = analyzer.polarity_scores(text)

    for score in sorted(sentiment):
        print('{0}: {1}, '.format(score, sentiment[score]), end= ' ')

    print()

##### End analyzeText function #####

print("\n\n")


filtered_sent = []  # Lists to store filtered sentences
sentences = []      # List to store reviews' sentences where each item in sentecnes is sent
sent = []           # list to store tokenized reviews

s = SentimentIntensityAnalyzer()                # Sentiment Analyzer object
stop_words = set(stopwords.words("English"))    # Stop words to weed out of sentences

enter_input = '1'                           # Initialize variable for getting sentences
input_file = open("example_text.txt", 'r')  # Open the input ile to get example reviews from




## Ask user how they want to test analyst (With the txt reviews file or input)
input_source = input("Enter 0 to use the example_text.txt with reviews, 1 to enter sentences: ")
while input_source != '0'  and input_source != '1':
    input_source = input("Enter 0 (Reviews) or 1 (Sentences)")



# User will enter sentences to analyze
if input_source == '1': 
    while enter_input != '0':
        enter_input = input("Enter another sentence (0 to quit)")
        sentences.append(enter_input)



# Otherwise we use the txt file with reviews
elif input_source == '0':
    reviews_text = input_file.readlines()
    for i, review in enumerate(reviews_text):
        
        if review.replace('\x00', '').strip() != '':    #Special charachter '\x00' pollutes txt field
            sent = sent_tokenize(review.replace('\x00', '').replace('\x19',"\'"))
            sentences.append(sent)
            #print(i, ': ', len(sent), ": ",sent)
            #print((i//2)+1, ': ',review)
            #print('\n\n')




for i,review in enumerate(sentences):
    min_sent = 100.00
    max_sent = 0.00
    average_sent = 0

    for sentence in review:
        print(sentence, '\n')
        analyzeText(sentence, s)
        print('\n')

    print('\n\n\n')
    

print("::::END_OUTPUT::::")
