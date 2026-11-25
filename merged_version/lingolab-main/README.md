# lingolab

## Backend (create-flow integration)

On Windows, double-click **Open LingoLab.vbs** to open the site directly in your browser. No terminal window or Python server is needed for the browser experience; language progress is saved locally.

```bash
pip install -r requirements.txt
python app.py
```

When the server starts, open **`http://127.0.0.1:5000/`** in your browser (the terminal prints this link). That serves the site and the API on the same port.

After you finish the create flow, the frontend POSTs your language to `/api/language`. End results and the translation challenge use `POST /api/sentences`.
