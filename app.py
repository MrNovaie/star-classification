from pathlib import Path

from flask import Flask, redirect, render_template, url_for

# When __name__ is "__main__", Flask can treat CWD as the app root and miss static/.
# Anchor templates + static to this file’s directory no matter where you run python from.
_BASE_DIR = Path(__file__).resolve().parent

app = Flask(
    __name__,
    template_folder=str(_BASE_DIR / "templates"),
    static_folder=str(_BASE_DIR / "static"),
)


@app.context_processor
def inject_site_branding():
    return {'site_name': 'Star Classification'}

@app.route('/')
def index():
    return render_template('home.html')


@app.route('/home')
def home():
    return redirect(url_for('index'), code=301)


@app.route('/star-classes')
def star_classes():
    return render_template('star-classes.html')

@app.route('/time-dilation')
def time_dilation():
    return redirect('https://time-dilation.netlify.app/', code=302)


if __name__ == '__main__':
    app.run(port=5000, debug=False)
