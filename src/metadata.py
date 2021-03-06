import os
import pandas as pd
from fuzzywuzzy import process, fuzz

class Metadata:
    def __init__(self):
        DIR_PATH = os.path.dirname(os.path.realpath(__file__))
        MOVIES_METADATA_PATH = DIR_PATH + "/../datasets/movies_metadata.csv"

        print("Loading movies metadata...")
        credits = pd.read_csv(DIR_PATH + '/../datasets/credits.csv')
        keywords = pd.read_csv(DIR_PATH + '/../datasets/keywords.csv')
        self.MOVIES_METADATA = pd.read_csv(MOVIES_METADATA_PATH, low_memory=False)
        self.MOVIES_METADATA = self.MOVIES_METADATA.drop([19730, 29503, 35587])

        keywords['id'] = keywords['id'].astype('int')
        credits['id'] = credits['id'].astype('int')
        self.MOVIES_METADATA['id'] = self.MOVIES_METADATA['id'].astype('int')
        print(len(self.MOVIES_METADATA))

        # Merge keywords and credits into your main metadata dataframe
        self.MOVIES_METADATA = self.MOVIES_METADATA.merge(credits, on='id')
        self.MOVIES_METADATA = self.MOVIES_METADATA.merge(keywords, on='id')

        print("Loaded movies metadata.")

    def get_movie_by_id(self, movie_id):
        return self.MOVIES_METADATA.iloc[movie_id]

    def get_movie_by_title(self, query):
        def get_ratio(row):
            title = row["title"]
            return fuzz.token_sort_ratio(title, query)
        filtered_movies = self.MOVIES_METADATA[self.MOVIES_METADATA.apply(get_ratio, axis=1) > 70]
        return filtered_movies.head(100).to_dict('records')
