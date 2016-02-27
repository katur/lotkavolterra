from os import listdir


def listdir_json(path):
    for f in listdir(path):
        if not f.startswith('.') and f.endswith('.json'):
            yield f
