from flask import Flask, request, render_template
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound, VideoUnavailable

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    transcript = ""
    error = ""
    if request.method == 'POST':
        url = request.form['url']
        video_id = extract_video_id(url)
        if not video_id:
            error = "Invalid YouTube URL."
        else:
            try:
                data = YouTubeTranscriptApi.get_transcript(video_id)
                transcript = ' '.join([item['text'] for item in data])
            except VideoUnavailable:
                error = "The video is unavailable."
            except TranscriptsDisabled:
                error = "Transcripts are disabled for this video."
            except NoTranscriptFound:
                error = "No transcript found for this video."
            except Exception as e:
                error = f"Unexpected error: {str(e)}"
    return render_template('index.html', transcript=transcript, error=error)

def extract_video_id(url):
    try:
        if "youtu.be/" in url:
            return url.split("youtu.be/")[1].split("?")[0]
        elif "youtube.com/watch?v=" in url:
            return url.split("v=")[1].split("&")[0]
        else:
            return None
    except:
        return None

if __name__ == '__main__':
    app.run(debug=True)
