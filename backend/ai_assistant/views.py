import os
import json
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions


OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')


def call_openai(messages, max_tokens=800):
    """Direct HTTP call to OpenAI — no package needed!"""
    headers = {
        'Authorization': f'Bearer {OPENAI_API_KEY}',
        'Content-Type': 'application/json',
    }
    body = {
        'model': 'gpt-3.5-turbo',
        'messages': messages,
        'max_tokens': max_tokens,
        'temperature': 0.7,
    }
    response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers=headers,
        json=body,
        timeout=30,
    )
    data = response.json()
    return data['choices'][0]['message']['content']


class AskDoubtView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        question = request.data.get('question', '').strip()
        language = request.data.get('language', 'Python')

        if not question:
            return Response({'error': 'Question required'}, status=400)

        try:
            answer = call_openai([
                {
                    "role": "system",
                    "content": f"""You are DevPath Pro's AI tutor for beginner programmers.
Always respond in this format:

## Simple Explanation
[Beginner-friendly explanation]

## Code Example
```{language.lower()}
[working code]
```

## Output
```
[expected output]
```

## Key Points
- [point 1]
- [point 2]
- [point 3]

## Related Topics
[topic1], [topic2], [topic3]"""
                },
                {
                    "role": "user",
                    "content": f"Language: {language}\nQuestion: {question}"
                }
            ])
            return Response({
                'question': question,
                'answer': answer,
                'language': language,
            })

        except Exception as e:
            return Response({'error': str(e)}, status=500)


class SuggestTopicsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        topic = request.data.get('topic', '')
        try:
            result = call_openai([
                {
                    "role": "system",
                    "content": 'Return only a JSON array of 5 related topics. Example: ["Functions", "Lists", "Loops"]'
                },
                {
                    "role": "user",
                    "content": f"Topic: {topic}"
                }
            ], max_tokens=100)
            topics = json.loads(result)
            return Response({'topics': topics})
        except:
            return Response({
                'topics': ['Functions', 'Lists', 'Loops', 'Dictionaries', 'Classes']
            })