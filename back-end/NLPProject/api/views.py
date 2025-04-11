from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from .models import *
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk import pos_tag
from textblob import TextBlob
from nltk.corpus import stopwords
import re

nltk.download('punkt', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)
nltk.download('vader_lexicon', quiet=True)
nltk.download('stopwords', quiet=True)

sia = SentimentIntensityAnalyzer()

interjections = ["wow", "oh", "yay", "ouch", "oops", "uh", "ah", "ugh"]
amplifiers = {
    "very": 1.5,
    "extremely": 2.0,
    "really": 1.5,
    "quite": 1.2,
    "absolutely": 1.8,
    "totally": 1.7
}
diminishers = {
    "slightly": 0.8,
    "somewhat": 0.7,
    "barely": 0.5,
    "hardly": 0.5
}

stop_words = set(stopwords.words('english'))

class SentimentAnalysis(generics.GenericAPIView):
    serializer_class = LogSerializer

    def post(self, request):
        if 'text' not in request.data:
            return Response({'error': 'No text provided.'}, status=400)

        text = request.data['text']
        
        cleaned_text = self.clean_text(text)
        if not cleaned_text or len(cleaned_text.split()) < 2:
            return Response({'message': 'Text contains insufficient meaningful content.'}, status=400)

        context_analysis = self.contextual_analysis(cleaned_text)
        sentiment_score = self.compute_sentiment(cleaned_text)
        adjusted_score = self.adjust_for_interjections_amplifiers(cleaned_text, sentiment_score)
        keyword_score = self.keyword_scores(cleaned_text)
        ratios_subjectivity = self.compute_ratios_and_subjectivity(cleaned_text)

        if adjusted_score['compound'] <= -0.05:
            sentiment = "Negative"
            score = adjusted_score['neg']
        elif adjusted_score['compound'] >= 0.05:
            sentiment = "Positive"
            score = adjusted_score['pos']
        else:
            sentiment = "Neutral"
            score = adjusted_score['neu']

        magnitude = self.calculate_magnitude(adjusted_score)
        
        data = {
            'text': text,
            'sentiment': sentiment,
            'score': score,
            'magnitude': magnitude,
            'subjectivity': ratios_subjectivity['subjectivity']
        }

        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            log = serializer.save(
                text=text,
                sentiment=sentiment,
                score=score,
                magnitude=magnitude,
                subjectivity=ratios_subjectivity['subjectivity']
            )

            if not log:
                return Response({'message': 'Results not logged.'}, status=500)

            response = {
                'context_analysis': context_analysis,
                'adjusted_score': adjusted_score,
                'keyword_score': keyword_score,
                'ratios_subjectivity': ratios_subjectivity,
                'sentiment': sentiment,
                'logged': 'Successfully logged results.'
            }

            return Response(response, status=201)
        else:
            return Response(serializer.errors, status=400)

    def clean_text(self, text):
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        text = re.sub(r'[^\w\s.,!?]', '', text)
        words = word_tokenize(text)

        filtered_words = [
            word for word in words 
            if word.isalpha() and len(word) > 1 and word.lower() not in stop_words
        ]
        return ' '.join(filtered_words)

    def calculate_magnitude(self, scores):
        base_magnitude = abs(scores['compound'])
        max_sentiment = max(scores['pos'], scores['neg'], scores['neu'])
        magnitude = (base_magnitude * 0.7) + (max_sentiment * 0.3)
        scaled_magnitude = magnitude * 5
        if abs(scores['compound']) > 0.05 and scaled_magnitude < 1:
            scaled_magnitude = 1 + abs(scores['compound']) * 4
        return min(scaled_magnitude, 10)

    def contextual_analysis(self, text):
        sentences = sent_tokenize(text)
        tokenized_sentences = [word_tokenize(sentence) for sentence in sentences]
        pos_tagged = [pos_tag(tokens) for tokens in tokenized_sentences]
        return pos_tagged

    def compute_sentiment(self, text):
        return sia.polarity_scores(text)

    def adjust_for_interjections_amplifiers(self, text, sentiment_score):
        words = word_tokenize(text.lower())
        adjustment = 1.0
        
        for word in words:
            if word in amplifiers:
                adjustment *= amplifiers[word]
            elif word in diminishers:
                adjustment *= diminishers[word]
            elif word in interjections:
                adjustment *= 1.2
        
        adjusted = sentiment_score.copy()
        adjusted['compound'] = max(-1.0, min(1.0, sentiment_score['compound'] * adjustment))
        
        return adjusted

    def keyword_scores(self, text):
        words = word_tokenize(text)
        filtered_words = [
            word for word in words 
            if word.isalpha() and len(word) > 2 and word.lower() not in stop_words
        ]
        
        keyword_scores = []
        for word in filtered_words:
            if word.lower() in sia.lexicon:
                scores = sia.polarity_scores(word)
                max_score = max(scores['neg'], scores['pos'], scores['neu'])
                if max_score is scores['neg']:
                    sentiment = "Negative"
                elif max_score is scores['pos']:
                    sentiment = "Positive"
                else:
                    sentiment = "Neutral"

                magnitude = abs(scores['compound']) * 5
                keyword_scores.append({word: {"sentiment": sentiment, "score": max_score, "magnitude": magnitude}})
        
        return keyword_scores

    def compute_ratios_and_subjectivity(self, text):
        sentiment_score = self.compute_sentiment(text)
        total = sentiment_score['neg'] + sentiment_score['neu'] + sentiment_score['pos']
        
        if total == 0:
            return {
                'ratios': {'positive': 0, 'negative': 0, 'neutral': 0}, 
                'magnitude': 0, 
                'subjectivity': "Neutral"
            }

        positive_ratio = (sentiment_score['pos'] / total) * 100
        negative_ratio = (sentiment_score['neg'] / total) * 100
        neutral_ratio = (sentiment_score['neu'] / total) * 100
        
        text_blob = TextBlob(text)
        subjectivity_value = text_blob.sentiment.subjectivity
        
        if subjectivity_value > 0.6:
            subjectivity = "Subjective"
        elif subjectivity_value < 0.4:
            subjectivity = "Objective"
        else:
            subjectivity = "Neutral"

        return {
            'ratios': {
                'positive': positive_ratio,
                'negative': negative_ratio,
                'neutral': neutral_ratio
            },
            'sentiment_score': max(sentiment_score['neg'], sentiment_score['pos'], sentiment_score['neu']),
            'magnitude': self.calculate_magnitude(sentiment_score),
            'subjectivity': subjectivity
        }
    
class LogsView(generics.ListAPIView):
    queryset = Log.objects.all()
    serializer_class = LogSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)