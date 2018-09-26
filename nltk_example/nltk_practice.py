import os
import sys
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.corpus import subjectivity
from nltk.sentiment.util import *
from nltk.classify import NaiveBayesClassifier
from nltk.sentiment.sentiment_analyzer import SentimentAnalyzer


'''
Function analyzeText:
    analyzes a single text and returns dictionary of sentiment ratings
Params:
    text: the text to analyze
    analyzer: analyzer object
'''
def analyzeText(text, analyzer):

    sentiment = analyzer.polarity_scores(text)

    #print('{0}: {1}. '.format('pos', sentiment['pos']))
    #for score in sorted(sentiment):
    #    print('{0}: {1}, '.format(score, sentiment[score]), end= ' ')
    #print()
    
    return sentiment

##### End analyzeText function #####



'''
Function analyzeReviews:
    analyze all of the reviews in an list, return processed reviews
Params:
    reviews_list: list of text for a review
Calls:
    calls analyzeText function
'''
def analyzeReviews(reviews_list, analyzerObject):
    
    s = analyzerObject
    reviews = []

    # For each raw_text review in reviews_list
    for index, review in enumerate(reviews_list):
        
        processed_review = {}  # Empty dictionary to fill with review data
       
        
        if review.strip() != '':
            try:
                good = 0.0
                bad = 0.0
                compound = 0.0


                processed_review['text'] = review
                sentences = sent_tokenize(review)

                # For sentence in sentences
                for sentence in sentences:
                    sentiment_scores = analyzeText(sentence, s)
                    
                    if sentiment_scores['pos'] > good:
                        good = sentiment_scores['pos']

                    if sentiment_scores['neg'] > bad:
                        bad = sentiment_scores['neg']

                    if abs(sentiment_scores['compound']) > abs(compound):
                            compound = sentiment_scores['compound']

                    #good = sentiment_scores['pos']
                    #bad += sentiment_scores['neg']
                    #compound += sentiment_scores['compound']
            
                #good /= len(sentences)
                #bad /= len(sentences)
                #compound /= len(sentences)

                processed_review["total good"] = good
                processed_review["total bad"] = bad
                processed_review["total compound"] = compound

                reviews.append(processed_review)

            except:
                continue

    return reviews

##### End analyzeReviews function #####



def filter_fluff(text):

    stop_words = set(stopwords.words("English"))    # Stop words to weed out of sentence


##### End filter_fluff function #####



def main():

    n = 100
    subj_docs = [(sent, 'subj') for sent in subjectivity.sents(categories='subj')[:n]]
    obj_docs = [(sent, 'obj') for sent in subjectivity.sents(categories='obj')[:n]]
    
    train_sub = subj_docs[:80]
    test_sub = subj_docs[80:100]
    train_obj = obj_docs[:80]
    test_obj = obj_docs[80:100]

    training_docs = train_sub + train_obj
    testing_docs = test_sub + test_obj

    sentiment = SentimentIntensityAnalyzer()
    #sentiment = SentimentAnalyzer()

    #all_words_neg = sentiment.all_words([mark_negation(doc) for doc in training_docs])
    #unigram_feats = sentiment.unigram_word_feats(all_words_neg, min_freq=4)
    #sentiment.add_feat_extractor(extract_unigram_feats, unigrams=unigram_feats)
    #training_set = sentiment.apply_features(training_docs)
    #test_set = sentiment.apply_features(testing_docs)
    #trainer = NaiveBayesClassifier.train
    #classifier = sentiment.train(trainer, training_set)




    

    reviews_file = open("example_text.txt", 'r')
    text_reviews = []
    
    for i, line in enumerate(reviews_file.readlines()):
        
        clean_review = line.replace('\x00', '').replace('\x19',"\'")
        
        if clean_review.strip() != '':
            text_reviews.append(clean_review)


    reviews = analyzeReviews(text_reviews, sentiment)    
    for i, review in enumerate(reviews):
        
        good = review['total good']
        bad = review['total bad']
        compound = review['total compound']
        text = review['text']

        print('{}: Good: {}, Bad: {}, Compound: {}\n{}'.format(i,good, bad, compound, text))




print('\n\n')
main()
