import os
import pandas as pd

class Metadata:
    def __init__(self):
        DIR_PATH = os.path.dirname(os.path.realpath(__file__))
        MOVIES_METADATA_PATH = DIR_PATH + "/../datasets/movies_metadata.csv"

        print("Loading movies metadata...")
        self.MOVIES_METADATA = pd.read_csv(MOVIES_METADATA_PATH, low_memory=False)
        print("Loaded movies metadata.")

    def get_movie_by_id(self, movie_id):
        return self.MOVIES_METADATA.iloc[movie_id]
