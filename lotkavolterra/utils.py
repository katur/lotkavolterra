from os import listdir


def listdir_nohidden(path):
    for f in listdir(path):
        if not f.startswith('.'):
            yield f
