from flask import Flask, request

from server.db import Session
from server.models import Image

app = Flask(__name__)


@app.route('/upload_style', methods=['POST'])
def upload_style():
    if request.method == 'POST':

        # Get the list of files from webpage
        files = request.files.getlist("file")

        with Session() as session:
            # Iterate for each file in the files List, and Save them
            for file in files:
                session.add(Image(name=file.name, path=file.filename))
                file.save(file.filename)
        return "<h1>Files Uploaded Successfully.!</h1>"


@app.route("/generate_promt", methods=['POST'])
def generate_promt():
    promt_text = request.get_json(force=True)


if __name__ == '__main__':
    app.run(debug=True)
